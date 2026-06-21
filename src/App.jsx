import { BrowserRouter, Routes, Route } from "react-router-dom"
import Bienvenida from "./pages/Bienvenida"
import Login from "./pages/Login"
import Registro from "./pages/Registro"
import Biblioteca from "./pages/Biblioteca"
import DetalleEjercicio from "./pages/DetalleEjercicio"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/ejercicios" element={<Biblioteca />} />
        <Route path="/ejercicios/:id" element={<DetalleEjercicio />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App