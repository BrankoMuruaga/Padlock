import { useState, useCallback, useEffect, useRef } from "react";
import { DIAL_DIGITS } from "../constants/constants.js";

export function useCombinationLock(availableChars, lockId) {
  const [dials, setDials] = useState(
    Array.from({ length: DIAL_DIGITS }, () => 0),
  );
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // NUEVA FUNCIÓN: Para reiniciar el candado después de la pantalla negra
  const resetLock = useCallback(() => {
    setAttempts(0);
    setIsLockedOut(false);
    setDials(Array.from({ length: DIAL_DIGITS }, () => 0));
  }, []);

  const rotateDial = useCallback(
    (dialIndex, direction) => {
      if (isUnlocked || isLockedOut) return;
      setDials((prev) => {
        const newDials = [...prev];
        let newValue = newDials[dialIndex] + direction;
        if (newValue < 0) newValue = availableChars.length - 1;
        if (newValue >= availableChars.length) newValue = 0;
        newDials[dialIndex] = newValue;
        return newDials;
      });
    },
    [availableChars.length, isUnlocked, isLockedOut],
  );

  const verifyCombination = useCallback(async () => {
    if (isUnlocked || isVerifying || isLockedOut) return;
    const currentPass = dials.map((index) => availableChars[index]).join("");
    setIsVerifying(true);

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lockId, combination: currentPass }),
      });
      const result = await response.json();

      if (result.success) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          setIsLockedOut(true);
        } else {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
        }
      }
    } catch (error) {
      console.error("Error al validar:", error);
    } finally {
      setIsVerifying(false);
    }
  }, [
    dials,
    availableChars,
    isUnlocked,
    isVerifying,
    lockId,
    attempts,
    isLockedOut,
  ]);

  return {
    dials,
    isUnlocked,
    isVerifying,
    rotateDial,
    verifyCombination,
    attempts,
    isShaking,
    isLockedOut,
    resetLock,
  };
}
