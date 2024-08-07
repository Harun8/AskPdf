const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
import { headers } from "next/headers";
import { userAgent } from "next/server";

export default async function handler(req, res) {
  const user = await req.json(); // Assuming text data if not form data

  try {
    const { data, error } = await supabase
      .from("profile")
      .select("price")
      .eq("user_id", user.user_id);

    const { data: pdfUpload, error: err } = await supabase.storage
      .from("pdfs")
      .list(user.user_id);

    const limits = {
      fileSize: data.length > 0 ? data[0].price : null,
      upload: pdfUpload.length,
    };

    return new Response(JSON.stringify(limits), {
      status: 200, // Set the status code to 200 (OK)
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header to 'application/json'
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ msg: error }), {
      status: 404, // Set the status code to 200 (OK)
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header to 'application/json'
      },
    });
  }
}

export { handler as POST };
