import { useState, useCallback, useEffect, useRef } from "react";
import { DIAL_DIGITS } from "../constants/constants.js";

export function useCombinationLock(availableChars, lockId) {
  const [dials, setDials] = useState(
    Array.from({ length: DIAL_DIGITS }, () => 0),
  );
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Usamos una referencia para evitar que se valide automáticamente al cargar la página por primera vez
  const isFirstRender = useRef(true);

  const rotateDial = useCallback(
    (dialIndex, direction) => {
      if (isUnlocked) return;
      setDials((prev) => {
        const newDials = [...prev];
        let newValue = newDials[dialIndex] + direction;
        if (newValue < 0) newValue = availableChars.length - 1;
        if (newValue >= availableChars.length) newValue = 0;
        newDials[dialIndex] = newValue;
        return newDials;
      });
    },
    [availableChars.length, isUnlocked],
  );

  const verifyCombination = useCallback(async () => {
    if (isUnlocked || isVerifying) return;
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
      }
    } catch (error) {
      console.error("Error al validar:", error);
    } finally {
      setIsVerifying(false);
    }
  }, [dials, availableChars, isUnlocked, isVerifying, lockId]);

  // Lógica de validación automática (Debounce)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isUnlocked) return;

    // Espera 800ms después del último movimiento para validar
    const timer = setTimeout(() => {
      verifyCombination();
    }, 800);

    // Limpiamos el temporizador si el usuario vuelve a mover el dial antes de los 800ms
    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dials]);

  return {
    dials,
    isUnlocked,
    isVerifying,
    rotateDial,
  };
}
