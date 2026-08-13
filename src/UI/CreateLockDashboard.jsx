import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import ShareLockView from "@/components/ShareLockView";
import LockForm from "@/components/LockForm";
import AuthWarning from "@/components/AuthWarning";
import UserLocksList from "@/components/UserLocksList";
import { LogOut } from "lucide-react";

export default function CreateLockDashboard() {
  const [createdLink, setCreatedLink] = useState(null);
  const [user, setUser] = useState(null);

  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);

      setIsAuthLoading(false);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setIsAuthLoading(false);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleReset = () => {
    setCreatedLink(null);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="w-full rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-8 shadow-lg transition-all ">
        <h2 className="mb-6 flex justify-center items-center text-2xl font-bold tracking-wide text-white ">
          {!createdLink ? "Forjar Candado" : "Candado Forjado"}
        </h2>

        {!createdLink ? (
          <LockForm setCreatedLink={setCreatedLink} user={user} />
        ) : (
          <ShareLockView createdLink={createdLink} onReset={handleReset} />
        )}
      </div>

      {!isAuthLoading && !user && !createdLink && <AuthWarning />}

      {/* Lista de candados del usuario */}
      {user && <UserLocksList user={user} />}

      {user && (
        <button
          onClick={handleLogout}
          className="top-5 right-10 absolute flex items-center justify-center gap-2 text-sm font-medium text-white hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      )}
    </div>
  );
}
