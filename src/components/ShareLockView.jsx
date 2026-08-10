import { Check, Copy, Share2, SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";

export default function ShareLockView({ createdLink, onReset }) {
  const [copied, setCopied] = useState(false);

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Candado Secreto",
          text: "¡He creado un candado secreto! ¿Serás capaz de abrirlo? 🔒",
          url: createdLink,
        });
      } catch (err) {
        console.log("Error o cancelación al compartir", err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center animate-in fade-in zoom-in duration-500">
      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
        <Check size={32} strokeWidth={3} />
      </div>

      <p className="text-center font-medium">¡Tu candado está listo!</p>

      <div className="flex flex-col gap-3">
        {/* Contenedor del enlace con botón de copiar integrado */}
        <div className="flex gap-2 w-full">
          <div className="relative flex items-center  border border-slate-600 rounded-lg overflow-hidden p-1">
            <input
              type="text"
              readOnly
              value={createdLink}
              className="w-full bg-transparent  font-mono text-sm px-3 focus:outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2 rounded-full hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
              title="Copiar enlace"
            >
              {copied ? (
                <Check size={18} className="text-emerald-400" />
              ) : (
                <Copy size={18} />
              )}
            </button>
            <button
              onClick={() => (window.location.href = createdLink)}
              className="p-2 rounded-full hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
              title="Abrir candado"
            >
              <SquareArrowOutUpRight size={18} />
            </button>
          </div>
          <button
            onClick={shareNative}
            className="p-2 size-10 rounded-full hover:bg-slate-200 flex items-center justify-center gap-2 py-2.5   transition-colors cursor-pointer"
          >
            <Share2 size={24} />
          </button>
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-2 text-sm  transition-colors cursor-pointer underline underline-offset-4"
      >
        Forjar otro candado
      </button>
    </div>
  );
}
