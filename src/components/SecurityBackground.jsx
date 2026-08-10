import {
  Binary,
  Code,
  Fingerprint,
  Key,
  KeyRound,
  Lock,
  ShieldCheck,
  Unlock,
} from "lucide-react";

const ICONS = [
  Lock,
  Key,
  Code,
  Unlock,
  ShieldCheck,
  KeyRound,
  Binary,
  Fingerprint,
];

export function SecurityBackground({ lockId = "" }) {
  const patternItems = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex flex-wrap justify-center items-center gap-12 p-8">
      {patternItems.map((_, index) => {
        const IconComponent = ICONS[index % ICONS.length];

        if (index === 0 && lockId) {
          return (
            <a
              key={index}
              href={`/reset-password/${lockId}`}
              title="Acceso restringido"
              className="inline-block relative z-20 transform -rotate-12 pointer-events-auto cursor-pointer opacity-10 hover:opacity-100 transition-opacity duration-300"
            >
              <Unlock size={46} strokeWidth={1.5} className="text-slate-900" />
            </a>
          );
        }

        return (
          <div key={index} className="transform -rotate-12 opacity-10">
            <IconComponent
              size={46}
              strokeWidth={1.5}
              className="text-slate-900"
            />
          </div>
        );
      })}
    </div>
  );
}
