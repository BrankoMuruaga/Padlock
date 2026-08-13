import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Dial } from "@/components/Dial";
import { Padlock } from "@/components/Padlock";
import { useCombinationLock } from "@/hooks/useCombinationLock";
import { CHARS, ITEM_HEIGHT } from "@/constants/constants";
import PurgeAIPopup from "@/components/PurgeAIPopup";
import DoorTransition from "@/components/DoorTransition";

export default function LockIsland({ lockId }) {
  const {
    dials,
    isUnlocked,
    isVerifying,
    rotateDial,
    verifyCombination,
    attempts,
    isShaking,
    isLockedOut,
    resetLock,
  } = useCombinationLock(CHARS, lockId);

  // Estados para la secuencia de fallo y victoria
  const [purgeProgress, setPurgeProgress] = useState(0);
  const [isBlackout, setIsBlackout] = useState(false);
  const [showLoseText, setShowLoseText] = useState(false); // <- Nuevo estado para el texto de perder
  const [startDoorTransition, setStartDoorTransition] = useState(false);

  // Efecto 1: Manejar la carga de la barra de progreso al fallar
  useEffect(() => {
    let interval;
    if (isLockedOut && !isBlackout) {
      setPurgeProgress(0);
      interval = setInterval(() => {
        setPurgeProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isLockedOut, isBlackout]);

  // Efecto 2: Pantalla negra, YOU LOSE y reinicio al llegar al 100% de la purga
  useEffect(() => {
    if (purgeProgress === 100) {
      setIsBlackout(true);

      // 1. Mostrar el "YOU LOSE" después de 1 segundo en negro
      const textTimer = setTimeout(() => {
        setShowLoseText(true);
      }, 1000);

      return () => {
        clearTimeout(textTimer);
      };
    }
  }, [purgeProgress]);

  // Efecto 3: Lógica de Victoria (2 segundos en negro, luego abre la puerta)
  useEffect(() => {
    if (isUnlocked) {
      setIsBlackout(true);
      const timer = setTimeout(() => {
        setIsBlackout(false);
        setStartDoorTransition(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);

  // --- PANTALLA NEGRA Y "YOU LOSE" ---
  if (isBlackout && !isUnlocked) {
    // Agregamos la condición !isUnlocked para que no pise los 2 segs negros de la victoria
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
        <h1
          className="text-6xl md:text-8xl font-black text-center drop-shadow-2xl"
          style={{
            color: "#ef4444", // Rojo Circo
            WebkitTextStroke: "2px black",
            textShadow: "6px 6px 0px #7f1d1d", // Sombra roja oscura
            opacity: showLoseText ? 1 : 0,
            transform: showLoseText
              ? "translateY(0) scale(1)"
              : "translateY(40px) scale(0.5)",
            transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          YOU LOSE
        </h1>
      </div>
    );
  }

  // --- PANTALLA NEGRA (Solo para la transición de victoria) ---
  if (isBlackout && isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" />
    );
  }

  // --- PANTALLA DE ERROR CAÓTICA ---
  if (isLockedOut) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
        <div className="relative z-30 drop-shadow-2xl scale-70 md:scale-100 mx-auto p-4 ">
          <PurgeAIPopup percentage={purgeProgress} />
        </div>
        <img
          src="/caine.webp"
          alt="Caine"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-96 rotate-0 animate-float-3 drop-shadow-2xl z-20 animate-swing"
        />
        <img
          src="/bubble.webp"
          alt="Bubble"
          className="absolute top-[62%] left-[8%] -translate-x-1/2 -rotate-24 w-34 md:w-32 animate-float-2 drop-shadow-2xl z-20 animate-swing"
        />
        <img
          src="/bubble.webp"
          alt="Bubble"
          className="absolute top-[62%] right-[8%] translate-x-1/2 w-44 md:w-32 animate-float-1 drop-shadow-2xl z-20 animate-swing"
        />
        <img
          src="/caine.webp"
          alt="Caine"
          className="absolute top-[76%] left-1/2 -translate-x-1/2 rotate-24 w-46 md:w-48 animate-float-2 drop-shadow-2xl z-20 animate-swing"
        />
        <img
          src="/caine.webp"
          alt="Caine"
          className="absolute top-10 -left-10 w-42 -rotate-24 md:w-48 animate-float-1 drop-shadow-2xl z-50 animate-swing"
        />
        <img
          src="/bubble.webp"
          alt="Bubble"
          className="absolute top-5 left-[65%] w-30 md:w-28 animate-float-1 drop-shadow-2xl z-20 animate-swing"
        />
      </div>
    );
  }

  // --- PANTALLA NORMAL DEL CANDADO ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans pointer-events-none">
      <div className="relative flex flex-col items-center mb-40 pointer-events-auto">
        <Padlock
          unlocked={isUnlocked}
          isShaking={isShaking}
          isLockedOut={isLockedOut}
        >
          <div className="flex gap-3">
            {dials.map((dialValue, index) => (
              <Dial
                key={index}
                value={dialValue}
                chars={CHARS}
                itemHeight={ITEM_HEIGHT}
                onRotateUp={() => rotateDial(index, -1)}
                onRotateDown={() => rotateDial(index, 1)}
              />
            ))}
          </div>
        </Padlock>

        <div className="absolute -bottom-32 text-center w-full flex flex-col items-center gap-4">
          {!isUnlocked && (
            <button
              onClick={verifyCombination}
              disabled={isVerifying}
              className="mt-4 rounded-xl bg-circus-blue px-6 py-3 font-bold text-white border-4 border-black shadow-[4px_4px_0px_#000] hover:bg-blue-400 active:translate-y-1 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? "PROCESANDO..." : "COMPROBAR"}
            </button>
          )}

          {/* Animación de Puerta controlada por el nuevo estado */}
          {startDoorTransition && <DoorTransition isOpen={true} duration={5} />}

          {/* Ocultamos los intentos si el candado ya se abrió */}
          {!isUnlocked && (
            <span className="text-white font-mono text-lg bg-black/50 px-4 py-1 rounded-full border-2 border-white/20">
              Intentos restantes:{" "}
              <span className="text-circus-yellow font-bold">
                {3 - attempts}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
