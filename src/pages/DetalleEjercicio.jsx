import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { supabase } from "../supabase"

const coloresGrupo = {
  supino:    "bg-emerald-900 text-emerald-300",
  sentado:   "bg-purple-900 text-purple-300",
  prono:     "bg-orange-900 text-orange-300",
  lateral:   "bg-amber-900 text-amber-300",
  avanzados: "bg-blue-900 text-blue-300",
}

function DetalleEjercicio() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ejercicio, setEjercicio] = useState(null)
  const [progreso, setProgreso] = useState(null)
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)

  useEffect(() => {
    // Cargar ejercicio
    supabase
      .from('ejercicios')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => setEjercicio(data))

    // Cargar usuario y su progreso en este ejercicio
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUsuario(data.user)
        supabase
          .from('progreso_usuario')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('ejercicio_id', id)
          .single()
          .then(({ data: prog }) => setProgreso(prog))
      }
    })
  }, [id])

  async function handleCompletar() {
    if (!usuario) {
      navigate("/login")
      return
    }
    setCargando(true)
    if (progreso) {
      // Ya existe — actualizar
      await supabase
        .from('progreso_usuario')
        .update({
          veces_practicado: progreso.veces_practicado + 1,
          ultima_vez: new Date().toISOString(),
          dominado: progreso.veces_practicado + 1 >= 5
        })
        .eq('id', progreso.id)
      setProgreso(p => ({
        ...p,
        veces_practicado: p.veces_practicado + 1,
        dominado: p.veces_practicado + 1 >= 5
      }))
    } else {
      // Primera vez
      const { data } = await supabase
        .from('progreso_usuario')
        .insert({
          user_id: usuario.id,
          ejercicio_id: parseInt(id),
          veces_practicado: 1,
          ultima_vez: new Date().toISOString(),
          dominado: false
        })
        .select()
        .single()
      setProgreso(data)
    }
    setCargando(false)
    setExito(true)
    setTimeout(() => setExito(false), 2000)
  }

  if (!ejercicio) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Cargando...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Cabecera */}
      <div className="px-4 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors text-xl">‹</button>
        <h1 className="text-xl font-bold text-white">Detalle</h1>
      </div>

      {/* Hero */}
      <div className="mx-4 bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center mb-4">
        <img 
          src={`/ejercicios/${ejercicio.nombre.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}.jpg`}
          alt={ejercicio.nombre}
          className="w-full max-w-xs mx-auto rounded-xl mb-4 object-contain"
          onError={(e) => { e.target.style.display = 'none' }}/>
        <h2 className="text-2xl font-bold text-emerald-400 mb-2">{ejercicio.nombre}</h2>
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          <span className={`text-xs px-3 py-1 rounded-full ${coloresGrupo[ejercicio.grupo]}`}>
            {ejercicio.grupo}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300">
            {ejercicio.dificultad}
          </span>
          {ejercicio.es_premium && (
            <span className="text-xs px-3 py-1 rounded-full bg-purple-900 text-purple-300">premium</span>
          )}
          {progreso?.dominado && (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-900 text-emerald-300">✓ dominado</span>
          )}
        </div>
      </div>

      {/* Progreso personal */}
      {progreso && (
        <div className="mx-4 bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
          <h3 className="text-sm font-semibold text-emerald-400 mb-2">Tu progreso</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Veces practicado</span>
            <span className="text-white font-medium">{progreso.veces_practicado}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Estado</span>
            <span className={progreso.dominado ? "text-emerald-400" : "text-yellow-400"}>
              {progreso.dominado ? "Dominado ✓" : `${progreso.veces_practicado}/5 para dominar`}
            </span>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="mx-4 grid grid-cols-2 gap-3 mb-4">
        <button className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-gray-300 hover:border-emerald-700 transition-colors">
          🔊 Escuchar guía
        </button>
        <button className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-gray-300 hover:border-emerald-700 transition-colors">
          ▶ Ver animación
        </button>
      </div>

      {/* Descripción */}
      <div className="mx-4 bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
        <h3 className="text-sm font-semibold text-emerald-400 mb-2">Descripción</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          {ejercicio.descripcion || "Próximamente añadiremos la descripción completa de este ejercicio con instrucciones paso a paso."}
        </p>
      </div>

      {/* Músculos */}
      <div className="mx-4 bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
        <h3 className="text-sm font-semibold text-emerald-400 mb-2">Músculos trabajados</h3>
        <div className="flex flex-wrap gap-2">
          {(ejercicio.musculos ? ejercicio.musculos.split(",") : ["Core", "Abdomen", "Espalda"]).map(m => (
            <span key={m} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">{m.trim()}</span>
          ))}
        </div>
      </div>

      {/* Botón completar */}
      <div className="mx-4 mb-8">
        <button
          onClick={handleCompletar}
          disabled={cargando}
          className={`w-full font-medium py-4 rounded-xl transition-all ${
            exito
              ? "bg-emerald-500 text-white"
              : "bg-emerald-700 hover:bg-emerald-600 text-white"
          } disabled:opacity-50`}
        >
          {exito ? "¡Completado! ✓" : cargando ? "Guardando..." : "Marcar como completado ✓"}
        </button>
      </div>

    </div>
  )
}

export default DetalleEjercicio