import ArcoMetalico from "./ArcoMetalico";

export function Padlock({
  children,
  unlocked = false,
  isShaking = false,
  isLockedOut = false,
}) {
  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Halo de luz: Rojo agresivo si se bloquea */}
      <div
        className={`absolute top-28 w-80 h-80 rounded-full blur-3xl transition-colors duration-700 ${
          unlocked
            ? "bg-circus-green"
            : isLockedOut
              ? "bg-red-600/80"
              : "bg-circus-yellow/50"
        }`}
      />

      <ArcoMetalico unlocked={unlocked} />

      {/* Aplicamos las animaciones dependiendo del estado */}
      <div
        className={`relative z-10 -mt-2 rounded-3xl p-6 pb-8 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          border-[6px] border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]
          bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_20px,#facc15_20px,#facc15_40px)]
          ${unlocked ? "scale-105 rotate-3" : "scale-100"}
          ${isShaking ? "animate-shake" : ""}
          ${isLockedOut ? "animate-glitch border-red-500" : ""}
        `}
      >
        {/* Tornillos */}
        {[
          "top-3 left-3",
          "top-3 right-3",
          "bottom-3 left-3",
          "bottom-3 right-3",
        ].map((pos) => (
          <div
            key={pos}
            className={`absolute ${pos} w-4 h-4 rounded-full bg-blue-500 border-2 border-black
              shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4)]`}
          />
        ))}

        <div className="relative bg-zinc-900 border-4 border-black rounded-xl p-2 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]">
          {children}
        </div>
      </div>
    </div>
  );
}
