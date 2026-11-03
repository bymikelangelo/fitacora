import { Route, Routes } from 'react-router'

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<h1>Fitácora</h1>} />
    </Routes>
  )
}
