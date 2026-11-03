/** Cálculos de nutrientes y del balance diario. */

/** 1234.4 → «1.234» */
export const miles = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

/**
 * Suma los nutrientes de una lista de alimentos con valores por 100 g.
 * @param {Array<{ kcal: number, p: number, h: number, g: number, f: number, gramos: number|string }>} alimentos
 */
export function sumarNutrientes(alimentos) {
  const t = { kcal: 0, proteinas: 0, hidratos: 0, grasas: 0, fibra: 0 }
  for (const a of alimentos) {
    const k = (Number(a.gramos) || 0) / 100
    t.kcal += a.kcal * k
    t.proteinas += a.p * k
    t.hidratos += a.h * k
    t.grasas += a.g * k
    t.fibra += a.f * k
  }
  return t
}

/** Las cinco casillas de nutrientes del lienzo. `aprox` añade «≈» (estimaciones de la IA). */
export function casillasNutrientes(t, aprox) {
  const a = aprox ? '≈ ' : ''
  return [
    { icon: 'energia', label: 'Energía', valor: `${a}${miles(t.kcal)} kcal` },
    { icon: 'proteinas', label: 'Proteínas', valor: `${a}${miles(t.proteinas)} g` },
    { icon: 'hidratos', label: 'Hidratos', valor: `${a}${miles(t.hidratos)} g` },
    { icon: 'grasas', label: 'Grasas', valor: `${a}${miles(t.grasas)} g` },
    { icon: 'fibra', label: 'Fibra', valor: `${a}${miles(t.fibra)} g` },
  ]
}

/** Balance de un día frente al rango recomendado (EFSA y OMS). */
export function balanceDelDia(registros) {
  const comidas = registros.filter((r) => r.tipo === 'comida')
  const ejercicios = registros.filter((r) => r.tipo === 'ejercicio')
  const kcal = comidas.reduce((s, c) => s + (c.nutrientes?.kcal || 0), 0)
  const prot = comidas.reduce((s, c) => s + (c.nutrientes?.proteinas || 0), 0)
  const min = ejercicios.reduce((s, e) => s + (e.minutos || 0), 0)
  return [
    { icon: 'energia', label: 'Energía', valor: `≈ ${miles(kcal)} kcal`, rango: '≈ 1.800–2.300' },
    { icon: 'proteinas', label: 'Proteínas', valor: `≈ ${Math.round(prot)} g`, rango: '≈ 50–70 g' },
    { icon: 'duracion', label: 'Actividad', valor: `≈ ${Math.round(min)} min`, rango: '≈ 30–60 min' },
  ]
}
