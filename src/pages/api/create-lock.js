import { supabase } from "@/utils/supabase";

export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { combination, owner_id } = body;

    // Validación básica de seguridad en el backend
    if (!combination || combination.length !== 4) {
      return new Response(JSON.stringify({ error: "Combinación inválida" }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("locks")
      .insert([{ combination, owner_id }])
      .select("id")
      .single();

    if (error) {
      console.log("Error de Supabase al insertar:", error);
      return new Response(JSON.stringify({ error: "Error de base de datos" }), {
        status: 500,
      });
    }

    // Devolvemos el ID generado al frontend
    return new Response(JSON.stringify({ success: true, lockId: data.id }), {
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
