import { useEffect, useState } from "react";

/**
 * @param {boolean} isOpen - Controla si la transición debe abrirse.
 * @param {number} duration - Tiempo en segundos que dura la apertura (configurable).
 * @param {function} onComplete - Callback cuando termina la animación.
 */
export default function DoorTransition({ isOpen, duration = 5, onComplete }) {
  const [startOpening, setStartOpening] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [revealImage, setRevealImage] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setStartOpening(true);
      }, 50);

      const totalMs = duration * 1000;

      // 1. Aparece la imagen en blanco
      const showImageTimer = setTimeout(() => {
        setShowImage(true);
      }, totalMs);

      // 2. La imagen empieza a recuperar su color
      const revealImageTimer = setTimeout(() => {
        setRevealImage(true);
      }, totalMs + 50);

      const buttonTimer = setTimeout(() => {
        setShowButton(true);
      }, totalMs + 5050);

      // 4. Retrasamos el cierre automático para dar tiempo de ver todo y hacer clic
      const endTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, totalMs + 15000);

      return () => {
        clearTimeout(timer);
        clearTimeout(showImageTimer);
        clearTimeout(revealImageTimer);
        clearTimeout(buttonTimer);
        clearTimeout(endTimer);
      };
    } else {
      setStartOpening(false);
      setShowImage(false);
      setRevealImage(false);
      setShowButton(false);
    }
  }, [isOpen, duration, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none flex items-center justify-center bg-black">
      {/* Fondo blanco expansivo */}
      <div
        className="absolute h-full bg-white transition-all linear"
        style={{
          transitionDuration: `${duration}s`,
          width: startOpening ? "100%" : "0px",
          boxShadow: startOpening
            ? "0 0 40px 20px rgba(255, 255, 255, 1), 0 0 90px 45px rgba(255, 255, 255, 0.9), 0 0 180px 90px rgba(255, 255, 255, 0.6)"
            : "0 0 0px 0px rgba(0, 0, 0, 1)",
        }}
      />

      {/* Contenedor Principal (Texto + Imagen) */}
      {showImage && (
        <div className="absolute z-10 flex flex-col items-center justify-center gap-6 w-full h-full">
          {/* TEXTO DE VICTORIA */}
          <h1
            className="text-6xl md:text-8xl font-black text-center drop-shadow-2xl"
            style={{
              color: "var(--color-circus-yellow, #facc15)",
              WebkitTextStroke: "2px black",
              textShadow: "6px 6px 0px #ef4444",
              opacity: revealImage ? 1 : 0,
              transform: revealImage
                ? "translateY(0) scale(1)"
                : "translateY(40px) scale(0.5)",
              // El texto tarda 1s en animarse, pero espera 3s para arrancar
              transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1) 3s",
            }}
          >
            YOU WIN!!
          </h1>

          {/* Contenedor de la Imagen */}
          <div
            className="relative flex"
            style={{
              transform: revealImage ? "scale(1)" : "scale(0.4)",
              transition: "transform 4s ease-out",
              width: "350px",
              maxWidth: "80vw",
            }}
          >
            {/* Filtro SVG */}
            <svg
              width="0"
              height="0"
              style={{ position: "absolute" }}
              aria-hidden="true"
            >
              <filter
                id="innerRimGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feMorphology
                  in="SourceAlpha"
                  operator="erode"
                  radius="3"
                  result="eroded"
                />
                <feComposite
                  in="SourceAlpha"
                  in2="eroded"
                  operator="out"
                  result="rim"
                />
                <feGaussianBlur in="rim" stdDeviation="5" result="rimBlur" />
                <feFlood floodColor="#ffffff" floodOpacity="1" result="white" />
                <feComposite in="white" in2="rimBlur" operator="in" />
              </filter>
            </svg>

            {/* 1. IMAGEN BASE */}
            <img
              src="/caine2.webp"
              alt="Caine"
              className="relative z-10 w-full h-auto drop-shadow-xl"
              style={{
                filter: revealImage
                  ? "brightness(1) invert(0)"
                  : "brightness(0) invert(1)",
                transition: "filter 1.5s ease-out",
              }}
            />

            {/* 2. LUZ DE CONTORNO HACIA ADENTRO */}
            <img
              src="/caine2.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 z-20 w-full h-auto pointer-events-none"
              style={{
                filter: "url(#innerRimGlow)",
                opacity: revealImage ? 1 : 0,
                transition: "opacity 1.5s ease-out",
              }}
            />
          </div>

          {/* BOTÓN REINICIAR (Aparece 2 segundos después del YOU WIN) */}
          <a
            className="absolute bottom-22 underline hover:bg-zinc-800 transition-all cursor-pointer pointer-events-auto text-center"
            href="/"
            style={{
              opacity: showButton ? 1 : 0,
              transform: showButton ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease-out",
              // Previene que se le pueda hacer clic mientras está invisible
              visibility: showButton ? "visible" : "hidden",
            }}
          >
            Forjar nuevo candado
          </a>
        </div>
      )}
    </div>
  );
}
