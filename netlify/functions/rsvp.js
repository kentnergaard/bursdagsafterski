import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = "https://lbmzdetaobrgqnevlmwi.supabase.co";
const supabase = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    body: JSON.stringify(body)
  };
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  // Safety: ensure env var is present
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: "Missing SUPABASE_SERVICE_ROLE_KEY in Netlify environment variables." });
  }

  try {
    const data = JSON.parse(event.body || "{}");
    if (data.company) return json(200, { ok: true }); // honeypot

    const name = String(data.name || "").trim();
    const coming = String(data.coming || "").trim();

    if (!name || name.length < 2) return json(400, { error: "Navn mangler." });
    if (!["ja", "nei"].includes(coming)) return json(400, { error: "Ugyldig svar." });

    const ip = event.headers["x-nf-client-connection-ip"] ||
               event.headers["x-forwarded-for"] ||
               "unknown";
    const ip_hash = crypto.createHash("sha256").update(String(ip)).digest("hex");

    const { error } = await supabase.from("rsvps").insert([{
      name,
      coming: coming === "ja",
      source: "netlify",
      ip_hash
    }]);

    if (error) return json(500, { error: "Kunne ikke lagre." });
    return json(200, { ok: true });
  } catch (e) {
    return json(400, { error: "Ugyldig payload." });
  }
}
