export function ArcoMetalico({ unlocked }) {
  return (
    <svg
      width="130"
      height="95"
      viewBox="0 0 130 95"
      className={`relative z-10 transition-all duration-500 ease-out ${
        unlocked
          ? "-translate-y-7 -rotate-12 origin-bottom-right drop-shadow-[0_0_14px_rgba(52,211,153,0.6)]"
          : "drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
      }`}
    >
      <defs>
        <linearGradient id="shackleGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="45%" stopColor="#f1f5f9" />
          <stop offset="60%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <path
        d="M 24 95 L 24 48 A 41 41 0 0 1 106 48 L 106 95"
        fill="none"
        stroke="url(#shackleGrad)"
        strokeWidth="17"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ArcoMetalico;
