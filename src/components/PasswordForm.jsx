import { useState } from "react";

export function PasswordForm({ onSave, validChars, isLoading }) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const upperCurrent = currentPass.toUpperCase().slice(0, 4);
    const upperNew = newPass.toUpperCase().slice(0, 4);

    const isValidCurrent = upperCurrent
      .split("")
      .every((char) => validChars.includes(char));
    const isValidNew = upperNew
      .split("")
      .every((char) => validChars.includes(char));

    if (
      isValidCurrent &&
      upperCurrent.length === 4 &&
      isValidNew &&
      upperNew.length === 4
    ) {
      onSave(upperCurrent, upperNew);
    } else {
      alert("Por favor, usa 4 caracteres permitidos para ambas contraseñas.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 w-full max-w-sm rounded-2xl backdrop-blur-md p-6 shadow-2xl flex flex-col gap-4"
    >
      <h3 className="flex items-center gap-2 text-lg font-bold tracking-wide ">
        Modificar Contraseña Secreta
      </h3>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 uppercase tracking-wider">
          Contraseña Actual
        </label>
        <input
          type="text"
          maxLength={4}
          value={currentPass}
          onChange={(e) => setCurrentPass(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border-2 border-slate-600  px-3 py-2 font-mono uppercase tracking-[0.4em]  focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 focus:outline-none"
          placeholder="A1B2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 uppercase tracking-wider">
          Nueva Contraseña
        </label>
        <input
          type="text"
          maxLength={4}
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border-2 border-slate-600  px-3 py-2 font-mono uppercase tracking-[0.4em]  focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 focus:outline-none"
          placeholder="C3D4"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || currentPass.length !== 4 || newPass.length !== 4}
        className="mt-2 rounded-lg bg-linear-to-b from-amber-400 to-amber-600 px-5 py-3 font-bold text-amber-950 shadow-[0_4px_12px_rgba(251,191,36,0.4)] hover:from-amber-300 hover:to-amber-500 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
      >
        {isLoading ? "Validando..." : "Modificar contraseña"}
      </button>
    </form>
  );
}
