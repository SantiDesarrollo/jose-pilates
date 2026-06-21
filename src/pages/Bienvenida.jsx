
function Bienvenida() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-emerald-700 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🧘</span>
        </div>
        <h1 className="text-3xl font-bold text-emerald-400">José Pilates</h1>
        <p className="text-gray-400 mt-2 text-sm">Aprende el método clásico paso a paso</p>
      </div>

      {/* Puntos clave */}
      <div className="w-full max-w-sm mb-8 flex flex-col gap-3">
        {[
          { icono: "📚", texto: "34 ejercicios clásicos de Joseph Pilates" },
          { icono: "🎯", texto: "Sesiones guiadas por nivel" },
          { icono: "📈", texto: "Seguimiento de tu progreso" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
            <span className="text-xl">{item.icono}</span>
            <p className="text-sm text-gray-300">{item.texto}</p>
          </div>
        ))}
      </div>

      {/* Botones */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={() => window.location.href = "/registro"}
          className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium py-4 rounded-xl transition-colors"
        >
          Crear cuenta gratis
        </button>
        <button
          onClick={() => window.location.href = "/login"}
          className="w-full border border-gray-700 hover:border-gray-500 text-gray-300 font-medium py-4 rounded-xl transition-colors"
        >
          Ya tengo cuenta · Iniciar sesión
        </button>
        <button
          onClick={() => window.location.href = "/ejercicios"}
          className="w-full text-gray-500 text-sm py-2 hover:text-gray-300 transition-colors"
        >
          Explorar sin registrarse →
        </button>
      </div>

    </div>
  )
}

export default Bienvenida