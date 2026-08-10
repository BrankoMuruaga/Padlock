import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Dial } from "@/components/Dial";
import { Padlock } from "@/components/Padlock";
import { useCombinationLock } from "@/hooks/useCombinationLock";
import { CHARS, ITEM_HEIGHT } from "@/constants/constants";

export default function LockIsland({ lockId }) {
  const { dials, isUnlocked, isVerifying, rotateDial } = useCombinationLock(
    CHARS,
    lockId,
  );

  // Efecto que dispara el confeti cuando se abre el candado
  useEffect(() => {
    if (isUnlocked) {
      // Disparamos el confeti con una configuración vistosa
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }, // Ajustamos el origen para que salga cerca del candado
        colors: ["#fbbf24", "#34d399", "#f87171", "#60a5fa"], // Colores que combinan con tu diseño
      });
    }
  }, [isUnlocked]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans pointer-events-none">
      <div className="relative flex flex-col items-center mt-12 mb-16 pointer-events-auto">
        <Padlock unlocked={isUnlocked}>
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

        <div className="absolute -bottom-20 text-center w-full text-xl">
          {isUnlocked ? (
            <span className="text-green-700 font-bold drop-shadow-md text-xl">
              ¡Candado Abierto!
              <br />
              <a className="text-black font-light underline text-sm" href="/">
                Forjar nuevo candado
              </a>
            </span>
          ) : isVerifying ? (
            <span className="text-amber-500 font-medium animate-pulse">
              Comprobando...
            </span>
          ) : (
            <span className="text-gray-500 font-medium">Bloqueado</span>
          )}
        </div>
      </div>
    </div>
  );
}
