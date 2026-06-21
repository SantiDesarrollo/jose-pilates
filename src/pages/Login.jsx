import { useState } from "react"
import { supabase } from "../supabase"
import { useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  async function handleLogin() {
    setCargando(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("Email o contraseña incorrectos")
    } else {
      navigate("/dashboard")
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">

      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🧘</span>
        </div>
        <h1 className="text-2xl font-bold text-emerald-400">Iniciar sesión</h1>
        <p className="text-gray-400 text-sm mt-1">Bienvenido de vuelta</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

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
            placeholder="••••••••"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={cargando}
          className="w-full bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
        >
          {cargando ? "Entrando..." : "Iniciar sesión"}
        </button>

        <button
          onClick={() => navigate("/registro")}
          className="w-full text-gray-400 text-sm hover:text-white transition-colors"
        >
          ¿No tienes cuenta? Regístrate gratis
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

export default Login