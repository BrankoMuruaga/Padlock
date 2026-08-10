import { supabase } from "@/utils/supabase";

export const POST = async ({ request }) => {
  try {
    // Leemos los datos que envía el cliente (React)
    const body = await request.json();
    const { lockId, combination } = body;

    if (!lockId || !combination) {
      return new Response(JSON.stringify({ error: "Faltan datos" }), {
        status: 400,
      });
    }

    // Consultamos la combinación real en Supabase para este candado
    const { data, error } = await supabase
      .from("locks")
      .select("combination")
      .eq("id", lockId)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: "Candado no encontrado" }), {
        status: 404,
      });
    }

    // Validamos en el servidor
    const isCorrect = data.combination === combination;

    // Solo respondemos si fue exitoso o no
    return new Response(JSON.stringify({ success: isCorrect }), {
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
