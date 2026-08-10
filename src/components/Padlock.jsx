import ArcoMetalico from "./ArcoMetalico";

export function Padlock({ children, unlocked = false }) {
  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Halo de luz ambiental */}
      <div
        className={`absolute top-28 w-72 h-72 rounded-full blur-3xl transition-colors duration-700 ${
          unlocked ? "bg-emerald-400/30" : "bg-amber-400/20"
        }`}
      />

      {/* Arco metálico */}
      <ArcoMetalico unlocked={unlocked} />

      {/* Cuerpo dorado */}
      <div
        className={`relative z-10 -mt-2 rounded-3xl p-6 pb-8 transition-colors duration-500
          bg-linear-to-b ${
            unlocked
              ? "from-emerald-400 via-emerald-500 to-emerald-700"
              : "from-amber-300 via-amber-500 to-amber-700"
          }
          shadow-[0_25px_50px_rgba(0,0,0,0.55),inset_0_2px_6px_rgba(255,255,255,0.5),inset_0_-8px_16px_rgba(0,0,0,0.3)]`}
      >
        {/* Tornillos decorativos */}
        {[
          "top-3 left-3",
          "top-3 right-3",
          "bottom-3 left-3",
          "bottom-3 right-3",
        ].map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos} w-2.5 h-2.5 rounded-full bg-black/40
              shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.4)]`}
          />
        ))}

        {/* Brillo superior */}
        <div className="absolute inset-x-4 top-1.5 h-6 rounded-full bg-white/30 blur-md pointer-events-none" />

        {children}
      </div>
    </div>
  );
}
