import { supabase } from "@/utils/supabase";

export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { lockId, currentPassword, newPassword } = body;

    if (!lockId || !currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: "Faltan datos" }), {
        status: 400,
      });
    }

    // 1. Obtener el candado de la base de datos
    const { data: lock, error: fetchError } = await supabase
      .from("locks")
      .select("combination, owner_id")
      .eq("id", lockId)
      .single();

    if (fetchError || !lock) {
      return new Response(JSON.stringify({ error: "Candado no encontrado." }), {
        status: 404,
      });
    }

    // 2. Verificar que el candado NO tenga dueño (Easter Egg solo para anónimos)
    if (lock.owner_id !== null) {
      return new Response(
        JSON.stringify({
          error:
            "Este candado está vinculado a una cuenta de usuario y no puede modificarse por aquí.",
        }),
        { status: 403 },
      );
    }

    // 3. Verificar que la contraseña actual ingresada sea correcta
    if (lock.combination !== currentPassword) {
      return new Response(
        JSON.stringify({ error: "La contraseña actual es incorrecta." }),
        { status: 401 },
      );
    }

    // 4. Actualizar a la nueva contraseña
    const { error: updateError } = await supabase
      .from("locks")
      .update({ combination: newPassword })
      .eq("id", lockId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Error de base de datos al guardar." }),
        { status: 500 },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 },
    );
  }
};
