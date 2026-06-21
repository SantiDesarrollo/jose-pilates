import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabase"

const grupos = ["supino", "sentado", "prono", "lateral", "avanzados"]

const coloresGrupo = {
  supino:    "bg-emerald-900 text-emerald-300",
  sentado:   "bg-purple-900 text-purple-300",
  prono:     "bg-orange-900 text-orange-300",
  lateral:   "bg-amber-900 text-amber-300",
  avanzados: "bg-blue-900 text-blue-300",
}

function Biblioteca() {
  const navigate = useNavigate()
  const [ejercicios, setEjercicios] = useState([])
  const [grupoActivo, setGrupoActivo] = useState("todos")
  const [dificultadActiva, setDificultadActiva] = useState("todas")

  useEffect(() => {
    supabase
      .from('ejercicios')
      .select('*')
      .order('orden')
      .then(({ data }) => {
        if (data) setEjercicios(data)
      })
  }, [])

  const ejerciciosFiltrados = ejercicios.filter(ej => {
    const porGrupo = grupoActivo === "todos" || ej.grupo === grupoActivo
    const porDificultad = dificultadActiva === "todas" || ej.dificultad === dificultadActiva
    return porGrupo && porDificultad
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">

      <div className="px-4 pt-10 pb-4">
        <h1 className="text-2xl font-bold text-emerald-400">Ejercicios</h1>
        <p className="text-gray-400 text-sm mt-1">{ejerciciosFiltrados.length} de {ejercicios.length} ejercicios</p>
      </div>

      <div className="px-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setGrupoActivo("todos")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${grupoActivo === "todos" ? "bg-emerald-700 border-emerald-600 text-white" : "border-gray-700 text-gray-400"}`}
        >
          Todos
        </button>
        {grupos.map(g => (
          <button
            key={g}
            onClick={() => setGrupoActivo(g)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${grupoActivo === g ? "bg-emerald-700 border-emerald-600 text-white" : "border-gray-700 text-gray-400"}`}
          >
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
      </div>

      <div className="px-4 flex gap-2 mt-2 pb-4">
        {["todas", "principiante", "intermedio", "avanzado"].map(d => (
          <button
            key={d}
            onClick={() => setDificultadActiva(d)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${dificultadActiva === d ? "bg-gray-700 border-gray-500 text-white" : "border-gray-800 text-gray-500"}`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-3">
        {ejerciciosFiltrados.map(ej => (
          <div
            key={ej.id}
            onClick={() => navigate(`/ejercicios/${ej.id}`)}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-emerald-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm w-6">{ej.orden}</span>
              <div>
                <p className="font-medium text-white">{ej.nombre}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${coloresGrupo[ej.grupo]}`}>
                  {ej.grupo}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {ej.es_premium && (
                <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">premium</span>
              )}
              <span className="text-gray-600">›</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Biblioteca