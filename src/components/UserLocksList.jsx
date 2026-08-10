import { CHARS } from "@/constants/constants";
import { supabase } from "@/utils/supabase";
import {
  Check,
  Copy,
  Edit2,
  KeyRound,
  Link,
  Save,
  SquareArrowOutUpRight,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function UserLocksList({ user }) {
  const [locks, setLocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [copied, setCopied] = useState(false);

  // Cargar los candados del usuario
  useEffect(() => {
    const fetchLocks = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("locks")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      console.log("Locks fetched:", data, error, user.id);
      if (!error && data) setLocks(data);
      setLoading(false);
    };

    fetchLocks();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres destruir este candado?")) return;

    // Gracias al RLS, esto solo funcionará si el usuario es el dueño
    const { error } = await supabase.from("locks").delete().eq("id", id);
    if (!error) {
      setLocks(locks.filter((lock) => lock.id !== id));
    }
  };

  const startEdit = (lock) => {
    setEditingId(lock.id);
    setEditValue(lock.combination);
  };

  const handleUpdate = async (id) => {
    const upperPass = editValue.toUpperCase();
    const isValid = upperPass.split("").every((char) => CHARS.includes(char));

    if (!isValid || upperPass.length !== 4) {
      alert("Usa 4 caracteres válidos.");
      return;
    }

    const { error } = await supabase
      .from("locks")
      .update({ combination: upperPass })
      .eq("id", id);

    if (!error) {
      setLocks(
        locks.map((lock) =>
          lock.id === id ? { ...lock, combination: upperPass } : lock,
        ),
      );
      setEditingId(null);
    }
  };

  if (loading)
    return (
      <div className="text-slate-400 text-sm mt-8 animate-pulse">
        Cargando tus candados...
      </div>
    );

  if (locks.length === 0) return null;

  return (
    <div className="w-full max-w-sm mt-8 flex flex-col gap-3">
      <h3 className=" font-bold text-sm tracking-widest uppercase mb-2">
        Tus Candados Forjados
      </h3>

      {locks.map((lock) => (
        <div
          key={lock.id}
          className="flex flex-col gap-3 shadow-lg p-4 rounded-xl bg-white/10 backdrop-blur-md transition-all"
        >
          {/* Combinación y Botones de acción */}
          <div className="flex items-center justify-between">
            {editingId === lock.id ? (
              <input
                type="text"
                maxLength={4}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-24 select-auto font-mono text-center tracking-widest border  rounded focus:outline-none"
              />
            ) : (
              <div className="flex items-center gap-2  font-mono text-lg tracking-widest">
                <KeyRound size={16} className="text-amber-500" />
                {lock.combination}
              </div>
            )}

            <div className="flex gap-2">
              {editingId === lock.id ? (
                <>
                  <button
                    onClick={() => handleUpdate(lock.id)}
                    className=" cursor-pointer p-1"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                  >
                    <X size={18} className="text-red-600" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(lock)}
                    className=" hover:text-amber-800 transition-colors cursor-pointer p-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(lock.id)}
                    className=" hover:text-red-600 transition-colors cursor-pointer p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Enlace para compartir */}
          <div className="flex items-center gap-2 text-xs border p-2 rounded-lg">
            <Link size={12} className="shrink-0" />
            <span className="truncate selection:bg-amber-500/30">
              {window.location.origin}/lock/{lock.id}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/lock/${lock.id}`,
                );
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
              onClick={() => (window.location.href = `/lock/${lock.id}`)}
              className="p-2 rounded-full hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
              title="Abrir candado"
            >
              <SquareArrowOutUpRight size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
