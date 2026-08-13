import React from "react";
// 1. Importamos el icono específico
import { Trash2 } from "lucide-react";

/**
 * Componente de React que renderiza la ventana emergente de purga
 * utilizando Lucide React para el icono de basura.
 * Rediseñado para ser más fino (menos alto).
 *
 * @param {number} props.percentage - Un número del 0 al 100 para la barra de progreso.
 */
const PurgeAIPopup = ({ percentage }) => {
  // Asegurarse de que el porcentaje esté entre 0 y 100
  const validPercentage = Math.max(0, Math.min(100, percentage));

  // Calcular el ancho de la barra de carga (total_width es 400 en el viewBox)
  const progressWidth = (validPercentage / 100) * 400;

  // Nuevo ViewBox ajustado para un diseño más fino (landscape)
  return (
    <svg
      width="600"
      height="200" // Altura externa reducida
      viewBox="0 0 600 200" // ViewBox reducido en altura
      xmlns="http://www.w3.org/2000/svg"
      // Ayuda a la accesibilidad
      role="img"
      aria-label={`Ventana de purga al ${validPercentage}%`}
    >
      {/* Fondo y Borde de la ventana emergente, ajustado en altura y posición y */}
      <rect
        x="50"
        y="20"
        width="500"
        height="160"
        rx="4"
        ry="4"
        fill="#E8E8E8"
        stroke="#1D2E7F"
        stroke-width="3"
      />

      {/* Barra de título azul, reducida en altura */}
      <rect
        x="53"
        y="23"
        width="494"
        height="30"
        rx="2"
        ry="2"
        fill="#1D2E7F"
      />

      {/* Texto de la barra de título, ajustado tamaño y posición y */}
      <text
        x="300"
        y="43"
        textAnchor="middle"
        fontFamily="'Monaco', 'Courier New', monospace"
        fontSize="16"
        fontWeight="bold"
        fill="white"
      >
        Purge Program
      </text>

      {/* --- SECCIÓN DEL ICONO Y ESTADO --- */}
      {/* Círculo rojo de fondo para el icono, reducido en tamaño y centrado verticalmente en el nuevo espacio */}
      <circle
        cx="90"
        cy="90"
        r="20"
        fill="#E75D5A"
        stroke="#9A9A9A"
        stroke-width="2"
      />

      {/* Icono Trash2 centrado en el círculo (r=20 en 90,90), foreignObject 24x24 */}
      <foreignObject x="78" y="78" width="24" height="24">
        {/*
          Contenedor HTML intermedio (div) para centrar
          el icono de Lucide usando Flexbox.
        */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            color: "white",
          }}
        >
          <Trash2
            size={18} // Tamaño del icono reducido
            strokeWidth={2}
            color="white"
          />
        </div>
      </foreignObject>

      {/* Texto de estado "Deleting...", ajustado x/y y tamaño */}
      <text
        x="125"
        y="95"
        textAnchor="start"
        fontFamily="'Monaco', 'Courier New', monospace"
        fontSize="16"
        fill="black"
      >
        Deleting...
      </text>

      {/* --- SECCIÓN BARRA DE PROGRESO --- */}

      {/* Definición del clip-path para la barra de carga dinámica, ajustado y/height */}
      <defs>
        <clipPath id="progressClipLucideFino">
          <rect x="100" y="130" width={progressWidth} height="20" />
        </clipPath>
      </defs>

      {/* Barra de progreso (Fondo gris), ajustado y/height */}
      <rect
        x="100"
        y="130"
        width="400"
        height="20"
        rx="3"
        ry="3"
        fill="#D5D5D5"
        stroke="#9A9A9A"
        stroke-width="1"
      />

      {/* Barra de progreso (Carga azul), ajustado y/height, y eliminados los offsets negativos del original */}
      <rect
        x="100"
        y="130"
        width="400"
        height="20"
        rx="3"
        ry="3"
        fill="#1D2E7F"
        clipPath="url(#progressClipLucideFino)"
        // Mantenemos la lógica de transición si el entorno soporta Tailwind o CSS custom properties
        className="transition-all duration-500 ease-in-out"
      />
    </svg>
  );
};

export default PurgeAIPopup;
