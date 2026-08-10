import { useState, useRef } from "react";

export function Dial({ value, chars, itemHeight, onRotateUp, onRotateDown }) {
  // 1. Ampliamos el "buffer" para evitar los huecos negros al scrollear
  const BUFFER_SIZE = 6; // Tendremos 6 números de reserva arriba y abajo
  const strip = [];

  // Rellenamos la tira calculando el bucle hacia atrás y hacia adelante
  for (let i = -BUFFER_SIZE; i < chars.length + BUFFER_SIZE; i++) {
    let index = i % chars.length;
    if (index < 0) index += chars.length; // Asegura que los índices negativos den la vuelta
    strip.push(chars[index]);
  }

  // 2. Calculamos dónde debe empezar a renderizarse.
  // Restamos 1 al buffer para que el número "activo" quede justo en el centro
  // de nuestra ventana (que tiene espacio para 3 números visibles).
  const baseOffset = (value + BUFFER_SIZE - 1) * itemHeight;

  // Estados para la física del scroll
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startY = useRef(0);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const currentY = e.clientY;
    let deltaY = currentY - startY.current;

    // Lógica de scroll infinito: al pasar el umbral, cambiamos lógicamente
    // pero desplazamos el inicio físico para que el arrastre no pegue un salto.
    while (deltaY >= itemHeight) {
      onRotateUp();
      startY.current += itemHeight;
      deltaY -= itemHeight;
    }

    while (deltaY <= -itemHeight) {
      onRotateDown();
      startY.current -= itemHeight;
      deltaY += itemHeight;
    }

    setDragOffset(deltaY);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap: Si soltamos a mitad de camino, completamos el giro hacia donde corresponda
    if (dragOffset > itemHeight * 0.5) {
      onRotateUp();
    } else if (dragOffset < -itemHeight * 0.5) {
      onRotateDown();
    }

    setDragOffset(0);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none py-3">
      {/* Botón superior */}

      {/* Ventana de ruedas */}
      <div
        className="relative w-14 overflow-hidden rounded-xl bg-zinc-900 cursor-grab active:cursor-grabbing touch-none"
        style={{ height: `${itemHeight * 3}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Tira móvil corrigiendo el translateY con el baseOffset */}
        <div
          className={`flex flex-col ${isDragging ? "transition-none" : "transition-transform duration-300 ease-out"}`}
          style={{
            transform: `translateY(calc(-${baseOffset}px + ${dragOffset}px))`,
          }}
        >
          {strip.map((char, index) => (
            <div
              key={index}
              className="relative flex items-center justify-center"
              style={{ height: `${itemHeight}px` }}
            >
              <div className="absolute inset-0 bg-linear-to-l from-zinc-500 via-zinc-200 to-zinc-500" />
              <div className="absolute inset-y-0 left-0 w-2 opacity-60 bg-[repeating-linear-gradient(180deg,#3f3f46_0px,#3f3f46_2px,transparent_2px,transparent_5px)]" />
              <div className="absolute inset-y-0 right-0 w-2 opacity-60 bg-[repeating-linear-gradient(180deg,#3f3f46_0px,#3f3f46_2px,transparent_2px,transparent_5px)]" />

              <span className="relative z-0 font-mono text-xl font-bold text-zinc-800 pointer-events-none">
                {char}
              </span>
            </div>
          ))}
        </div>

        {/* Capas de Sombreado 3D Estático */}
        <div className="absolute inset-x-0 top-0 h-12 pointer-events-none bg-linear-to-b from-black/90 via-black/40 to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-12 pointer-events-none bg-linear-to-t from-black/90 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-white/15 to-transparent z-10 mix-blend-overlay" />
        <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-black/40 via-transparent to-black/40 z-10" />
      </div>
    </div>
  );
}
