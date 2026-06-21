import { useState } from "react"
import { supabase } from "../supabase"
import { useNavigate } from "react-router-dom"

function Registro() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)

  async function handleRegistro() {
    setCargando(true)
    setError("")

    if (!nombre || !email || !password) {
      setError("Por favor rellena todos los campos")
      setCargando(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setCargando(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } }
    })

    if (error) {
      setError("Error al crear la cuenta. Prueba con otro email.")
    } else {
      setExito(true)
    }
    setCargando(false)
  }

  if (exito) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✉️</span>
        </div>
        <h1 className="text-2xl font-bold text-emerald-400 mb-2">¡Casi listo!</h1>
        <p className="text-gray-400 text-center text-sm mb-6">
          Te hemos enviado un email de confirmación a <strong className="text-white">{email}</strong>. Haz clic en el enlace para activar tu cuenta.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full max-w-sm bg-emerald-700 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Ir a iniciar sesión
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">

      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🧘</span>
        </div>
        <h1 className="text-2xl font-bold text-emerald-400">Crear cuenta</h1>
        <p className="text-gray-400 text-sm mt-1">Empieza gratis hoy</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Tu nombre"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <button
          onClick={handleRegistro}
          disabled={cargando}
          className="w-full bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
        >
          {cargando ? "Creando cuenta..." : "Crear cuenta gratis"}
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full text-gray-400 text-sm hover:text-white transition-colors"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full text-gray-600 text-sm hover:text-gray-400 transition-colors"
        >
          ← Volver al inicio
        </button>

      </div>
    </div>
  )
}

export default Registro