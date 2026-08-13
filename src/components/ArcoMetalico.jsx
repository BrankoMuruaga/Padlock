export default function ArcoMetalico({ unlocked }) {
  return (
    <svg
      width="200"
      height="150"
      viewBox="0 -15 150 115"
      className={`relative z-10 translate-x-4 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
        unlocked ? "-translate-y-8 -rotate-12 origin-bottom-right" : ""
      }`}
    >
      {/* Contorno negro grueso (dibujado detrás) */}
      <path
        d="M 24 95 L 24 48 A 41 41 0 0 1 106 48 L 106 95"
        fill="none"
        stroke="#000000"
        strokeWidth="24"
        strokeLinecap="round"
      />
      {/* Color principal del arco (Azul vibrante) */}
      <path
        d="M 24 95 L 24 48 A 41 41 0 0 1 106 48 L 106 95"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Brillo estilo plástico CGI antiguo */}
      <path
        d="M 24 85 L 24 48 A 37 37 0 0 1 102 48"
        fill="none"
        stroke="#93c5fd"
        strokeWidth="4"
        strokeLinecap="round"
        className="opacity-80"
      />
    </svg>
  );
}
