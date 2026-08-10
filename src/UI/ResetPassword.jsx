import { useState } from "react";
import { PasswordForm } from "@/components/PasswordForm";
import { CHARS } from "@/constants/constants";

const ResetPassword = ({ lockId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChangePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lockId, currentPassword, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`¡Contraseña actualizada con éxito a: ${newPassword}!`);
        // Redirigimos al usuario de vuelta a probar su candado actualizado
        window.location.href = `/lock/${lockId}`;
      } else {
        setMessage(result.error || "Error al actualizar la contraseña");
      }
    } catch (error) {
      setMessage("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <PasswordForm
        onSave={handleChangePassword}
        validChars={CHARS}
        isLoading={isLoading}
      />
      {message && (
        <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded border border-red-400/20 max-w-sm text-center">
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
