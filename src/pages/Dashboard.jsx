import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabase"

function Dashboard() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [progreso, setProgreso] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/login")
        return
      }
      setUsuario(data.user)

      // Cargar progreso real del usuario
      supabase
        .from('progreso_usuario')
        .select('*')
        .eq('user_id', data.user.id)
        .then(({ data: prog }) => {
          setProgreso(prog || [])
          setCargando(false)
        })
    })
  }, [])

  async function handleCerrarSesion() {
    await supabase.auth.signOut()
    navigate("/")
  }

  const ejerciciosDominados = progreso.filter(p => p.dominado).length
  const ejerciciosPracticados = progreso.length
  const porcentaje = Math.round((ejerciciosDominados / 34) * 100)

  if (cargando) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Cargando...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">

      {/* Cabecera */}
      <div className="px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-emerald-400">José Pilates</h1>
          <button
            onClick={handleCerrarSesion}
            className="text-xs text-gray-500 hover:text-gray-300 border border-gray-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
        <p className="text-gray-400 text-sm">
          Bienvenido, {usuario.user_metadata?.nombre || usuario.email}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-emerald-400">{ejerciciosPracticados}</div>
          <div className="text-xs text-gray-400 mt-1">Ejercicios practicados</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-emerald-400">{ejerciciosDominados} ⭐</div>
          <div className="text-xs text-gray-400 mt-1">Ejercicios dominados</div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="px-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Progreso total</span>
            <span className="text-emerald-400">{ejerciciosDominados} / 34 · {porcentaje}%</span>
          </div>
          <div className="bg-gray-800 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${porcentaje}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Acciones rápidas</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/ejercicios")}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium py-4 rounded-xl transition-colors"
          >
            📚 Ver todos los ejercicios
          </button>
          <button
            className="bg-gray-900 border border-gray-800 hover:border-emerald-700 text-white font-medium py-4 rounded-xl transition-colors"
          >
            ▶ Iniciar sesión de hoy
          </button>
        </div>
      </div>

      {/* Últimos ejercicios practicados */}
      {progreso.length > 0 && (
        <div className="px-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Últimos practicados</h2>
          <div className="flex flex-col gap-2">
            {progreso.slice(-3).reverse().map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/ejercicios/${p.ejercicio_id}`)}
                className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer hover:border-emerald-700 transition-colors"
              >
                <span className="text-sm text-gray-300">Ejercicio #{p.ejercicio_id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.dominado ? "bg-emerald-900 text-emerald-300" : "bg-gray-800 text-gray-400"}`}>
                  {p.dominado ? "✓ dominado" : `${p.veces_practicado} veces`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard