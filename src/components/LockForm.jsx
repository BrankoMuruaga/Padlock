import { useState } from "react";
import { CHARS } from "@/constants/constants";

export default function LockForm({ setCreatedLink, user }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const upperPass = input.toUpperCase().slice(0, 4);
    const isValid = upperPass.split("").every((char) => CHARS.includes(char));

    if (!isValid || upperPass.length !== 4) {
      alert("Usa 4 caracteres válidos.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/create-lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          combination: upperPass,
          owner_id: user ? user.id : null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setCreatedLink(`${window.location.origin}/lock/${result.lockId}`);
      } else {
        alert("Hubo un error al crear el candado.");
      }
    } catch (error) {
      console.error("Error al crear:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm mb-4 text-center ">
        Ingresa una combinación de 4 dígitos para tu candado secreto.
      </p>

      <input
        type="text"
        maxLength={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full rounded-xl border-2 border-slate-600  px-4 py-4 text-center font-mono text-2xl uppercase tracking-[0.5em]  focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder-slate-500 transition-all"
        placeholder="A1B2"
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading || input.length !== 4}
        className="mt-2 rounded-xl bg-linear-to-b from-amber-400 to-amber-600 px-6 py-3 font-bold text-amber-950 shadow-[0_4px_12px_rgba(251,191,36,0.4)] hover:from-amber-300 hover:to-amber-500 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Forjando..." : "Crear Candado"}
      </button>
    </form>
  );
}
