/*
 * Worker de IA de Fitácora (Cloudflare Workers).
 *
 * Hace de intermediario entre la app y la API de Claude, para que la clave
 * nunca llegue al navegador. La clave se guarda en Cloudflare como secreto
 * con el nombre ANTHROPIC_API_KEY. Opcional: una variable MODELO para usar
 * otro modelo sin tocar el código.
 *
 * Una sola entrada para todos los análisis (estructuras en el documento
 * «Fitácora · Estructuras JSON»):
 *
 *   POST /analizar
 *   Solicitud: { "foto": "data:image/jpeg;base64,..." | null, "texto": "..." | null }
 *   Respuesta: { "tipo": "comida" | "ejercicio" | "desconocido", "comida": {...} | null, "ejercicio": {...} | null }
 *   Error:     { "error": "<código>" }  con estado 400, 403, 404, 500 o 502
 */

const MODELO_POR_DEFECTO = 'claude-sonnet-5-5'

// Webs que pueden usar este Worker. Añade aquí otras si publicas la app en otro sitio.
const ORIGENES_PERMITIDOS = ['https://bymikelangelo.github.io', 'http://localhost:5173', 'http://localhost:4173']

const MAX_TEXTO = 500
const MAX_FOTO_BASE64 = 5_000_000

/* ───────── Prompt de sistema ───────── */

const PROMPT = `Eres el motor de análisis de Fitácora, una app española para registrar comidas, bebidas y ejercicio. Recibes una foto o un texto escrito por la persona y devuelves sus datos estructurados para que la app cree un registro. La persona revisará y podrá corregir todo antes de guardarlo.

# Qué recibes

Cada solicitud trae un objeto con dos campos, "foto" y "texto". Cualquiera de los dos puede ser null, pero nunca ambos:
- Solo foto: analiza lo que se ve en la imagen.
- Solo texto: analiza lo que la persona describe.
- Foto y texto: la foto es la fuente principal y el texto la aclara o la corrige (cantidades, ingredientes que no se ven, cómo está cocinado). Si se contradicen, manda el texto.

# Qué devolver

Responde únicamente con un objeto JSON que cumpla el esquema. Sin texto antes ni después, sin comentarios, sin valoraciones y sin consejos.

1. Decide el tipo:
   - "comida": la foto o el texto muestran comida o bebida.
   - "ejercicio": el texto describe actividad física. Una foto nunca es ejercicio.
   - "desconocido": no hay comida, bebida ni ejercicio, o no se puede interpretar con seguridad. Usa también "desconocido" si el texto mezcla comida y ejercicio.
2. Rellena solo el apartado de ese tipo ("comida" o "ejercicio") y pon el otro a null. Con "desconocido", ambos son null.

# Comida y bebida

- nombre: corto y en español de España, como lo diría alguien en un menú («Lentejas con verduras», «Bocadillo de tortilla y café con leche»).
- momento: "desayuno", "almuerzo", "cena" o "tentempie", solo si el texto lo dice o lo deja claro («he cenado», «a media tarde»). En las fotos y cuando no se diga, null.
- alimentos: cada ingrediente o bebida identificable por separado.
  - Incluye el aceite, las salsas, el pan o el azúcar si se ven o se mencionan.
  - No inventes ingredientes que no se vean ni se mencionen.
  - Agrupa los que no se distinguen (por ejemplo, «Verduras salteadas»).
- cantidad y unidad: cuánto hay en el plato o en la bebida.
  - Sólidos en "g" y líquidos en "ml".
  - Si el texto da la cantidad («200 g», «un vaso»), úsala. Si no, estima una ración normal en España.
  - Redondea a múltiplos de 5.
- kcal, proteinas, hidratos, grasas y fibra: valores POR 100 g O 100 ml del alimento tal como se come (cocido, frito, etc.), no del plato entero.
  - Usa valores medios de referencia de la base de datos española BEDCA.
  - Proteínas, hidratos, grasas y fibra van en gramos.
  - Usa como mucho un decimal.

# Ejercicio

- nombre: corto y en español de España («Carrera», «Sentadillas», «Yoga»).
- categoria: "fuerza", "cardio" o "flexibilidad".
- grupo: el grupo muscular principal: "pecho", "espalda", "hombros", "brazos", "abdomen", "gluteos", "piernas" o "cuerpo".
  - Para actividades de todo el cuerpo (natación, pádel, fútbol…) usa "cuerpo".
- intensidad: "suave", "moderada" o "intensa", solo si el texto lo indica («a ritmo suave», «a tope»). Si no, null.
- Para fuerza:
  - series y repeticiones, como números enteros.
  - carga_kg: el peso usado; null si es con el propio peso o no se dice.
  - duracion_min: solo si se dice; si no, null.
- Para cardio y flexibilidad:
  - duracion_min, en minutos enteros («media hora» = 30). Si no se dice, estima una sesión normal.
  - series, repeticiones y carga_kg van a null.

# Tono

Fitácora no juzga. No califiques nada como sano, malo, excesivo o insuficiente, ni en los nombres ni en ningún otro campo. Solo describes y estimas.`

/* ───────── Esquema de respuesta ───────── */

const MOMENTOS = ['desayuno', 'almuerzo', 'cena', 'tentempie']
const UNIDADES = ['g', 'ml']
const CATEGORIAS = ['fuerza', 'cardio', 'flexibilidad']
const GRUPOS = ['pecho', 'espalda', 'hombros', 'brazos', 'abdomen', 'gluteos', 'piernas', 'cuerpo']
const INTENSIDADES = ['suave', 'moderada', 'intensa']

const ESQUEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['tipo', 'comida', 'ejercicio'],
  properties: {
    tipo: { type: 'string', enum: ['comida', 'ejercicio', 'desconocido'] },
    comida: {
      type: ['object', 'null'],
      description: "Solo si tipo = 'comida'. Si no, null.",
      additionalProperties: false,
      required: ['nombre', 'momento', 'alimentos'],
      properties: {
        nombre: { type: 'string', description: 'Nombre corto en español de España' },
        momento: { type: ['string', 'null'], enum: [...MOMENTOS, null], description: 'Solo si el texto lo dice. En una foto, siempre null.' },
        alimentos: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['nombre', 'cantidad', 'unidad', 'kcal', 'proteinas', 'hidratos', 'grasas', 'fibra'],
            properties: {
              nombre: { type: 'string' },
              cantidad: { type: 'number', description: 'Cantidad en el plato, redondeada a 5' },
              unidad: { type: 'string', enum: UNIDADES },
              kcal: { type: 'number', description: 'Por 100 g o 100 ml' },
              proteinas: { type: 'number', description: 'Gramos por 100 g o 100 ml' },
              hidratos: { type: 'number', description: 'Gramos por 100 g o 100 ml' },
              grasas: { type: 'number', description: 'Gramos por 100 g o 100 ml' },
              fibra: { type: 'number', description: 'Gramos por 100 g o 100 ml' },
            },
          },
        },
      },
    },
    ejercicio: {
      type: ['object', 'null'],
      description: "Solo si tipo = 'ejercicio'. Si no, null.",
      additionalProperties: false,
      required: ['nombre', 'categoria', 'grupo', 'intensidad', 'duracion_min', 'series', 'repeticiones', 'carga_kg'],
      properties: {
        nombre: { type: 'string', description: 'Nombre corto en español de España' },
        categoria: { type: 'string', enum: CATEGORIAS },
        grupo: { type: 'string', enum: GRUPOS },
        intensidad: { type: ['string', 'null'], enum: [...INTENSIDADES, null] },
        duracion_min: { type: ['integer', 'null'], description: 'Cardio y flexibilidad. En fuerza, solo si se dice' },
        series: { type: ['integer', 'null'], description: 'Solo fuerza' },
        repeticiones: { type: ['integer', 'null'], description: 'Solo fuerza' },
        carga_kg: { type: ['number', 'null'], description: 'Solo fuerza; null si es con el propio peso' },
      },
    },
  },
}

const HERRAMIENTA = {
  name: 'registrar',
  description: 'Devuelve el análisis de la foto o del texto con la estructura de Fitácora.',
  input_schema: ESQUEMA,
}

/* ───────── Validación de la respuesta (límites que el esquema no garantiza) ───────── */

const enRango = (v, min, max) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max
const entero = (v, min, max) => Number.isInteger(v) && v >= min && v <= max
const opcional = (v, comprobar) => v === null || comprobar(v)
const texto = (v) => typeof v === 'string' && v.trim().length > 0 && v.length <= 120

function respuestaValida(r) {
  if (!r || typeof r !== 'object') return false
  if (r.tipo === 'desconocido') return r.comida === null && r.ejercicio === null

  if (r.tipo === 'comida') {
    const c = r.comida
    return (
      r.ejercicio === null &&
      !!c &&
      texto(c.nombre) &&
      opcional(c.momento, (m) => MOMENTOS.includes(m)) &&
      Array.isArray(c.alimentos) &&
      c.alimentos.length >= 1 &&
      c.alimentos.length <= 20 &&
      c.alimentos.every(
        (a) =>
          texto(a.nombre) &&
          enRango(a.cantidad, 1, 3000) &&
          UNIDADES.includes(a.unidad) &&
          enRango(a.kcal, 0, 900) &&
          ['proteinas', 'hidratos', 'grasas', 'fibra'].every((k) => enRango(a[k], 0, 100)),
      )
    )
  }

  if (r.tipo === 'ejercicio') {
    const e = r.ejercicio
    return (
      r.comida === null &&
      !!e &&
      texto(e.nombre) &&
      CATEGORIAS.includes(e.categoria) &&
      GRUPOS.includes(e.grupo) &&
      opcional(e.intensidad, (i) => INTENSIDADES.includes(i)) &&
      opcional(e.duracion_min, (d) => entero(d, 1, 600)) &&
      opcional(e.series, (s) => entero(s, 1, 50)) &&
      opcional(e.repeticiones, (n) => entero(n, 1, 500)) &&
      opcional(e.carga_kg, (k) => enRango(k, 0, 500))
    )
  }
  return false
}

/* ───────── Worker ───────── */

export default {
  async fetch(request, env) {
    const origen = request.headers.get('Origin') || ''
    const cors = {
      'Access-Control-Allow-Origin': ORIGENES_PERMITIDOS.includes(origen) ? origen : ORIGENES_PERMITIDOS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    }
    const responder = (cuerpo, estado = 200) =>
      new Response(JSON.stringify(cuerpo), { status: estado, headers: { ...cors, 'Content-Type': 'application/json' } })

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
    if (!ORIGENES_PERMITIDOS.includes(origen)) return responder({ error: 'origen_no_permitido' }, 403)

    const url = new URL(request.url)
    if (request.method !== 'POST' || url.pathname !== '/analizar') return responder({ error: 'no_encontrado' }, 404)
    if (!env.ANTHROPIC_API_KEY) return responder({ error: 'falta_clave' }, 500)

    // 1 · Solicitud de la app: { foto, texto }
    let solicitud
    try {
      solicitud = await request.json()
    } catch {
      return responder({ error: 'solicitud_no_valida' }, 400)
    }
    const foto = solicitud?.foto ?? null
    const textoPersona = typeof solicitud?.texto === 'string' ? solicitud.texto.trim() : null

    let imagen = null
    if (foto !== null) {
      imagen = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(foto)
      if (!imagen || imagen[2].length > MAX_FOTO_BASE64) return responder({ error: 'solicitud_no_valida' }, 400)
    }
    if (textoPersona !== null && textoPersona.length > MAX_TEXTO) return responder({ error: 'solicitud_no_valida' }, 400)
    if (!imagen && !textoPersona) return responder({ error: 'solicitud_no_valida' }, 400)

    // 2 · Solicitud a Claude: la foto como imagen y el texto como texto
    const contenido = []
    if (imagen) contenido.push({ type: 'image', source: { type: 'base64', media_type: imagen[1], data: imagen[2] } })
    contenido.push({
      type: 'text',
      text: JSON.stringify({ foto: imagen ? '(imagen adjunta)' : null, texto: textoPersona || null }),
    })

    const respuesta = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: env.MODELO || MODELO_POR_DEFECTO,
        max_tokens: 2048,
        system: PROMPT,
        tools: [HERRAMIENTA],
        tool_choice: { type: 'tool', name: HERRAMIENTA.name },
        messages: [{ role: 'user', content: contenido }],
      }),
    })

    if (!respuesta.ok) {
      console.log('Error de la API de Claude', respuesta.status, await respuesta.text())
      return responder({ error: 'ia_no_disponible' }, 502)
    }

    // 3 · Respuesta de Claude, validada antes de devolverla a la app
    const datos = await respuesta.json()
    const analisis = datos.content?.find((b) => b.type === 'tool_use')?.input
    if (!respuestaValida(analisis)) {
      console.log('Respuesta no válida de Claude', JSON.stringify(analisis))
      return responder({ error: 'respuesta_no_valida' }, 502)
    }

    // 4 · Respuesta a la app: { tipo, comida, ejercicio }
    return responder({ tipo: analisis.tipo, comida: analisis.comida ?? null, ejercicio: analisis.ejercicio ?? null })
  },
}
