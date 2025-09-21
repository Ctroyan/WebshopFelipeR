export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Campos que vienen del form
  const { Nombre, nombre, Email, email, Telefono, telefono } = req.body || {};
  const fields = {
    Nombre: Nombre ?? nombre ?? "",
    Email: Email ?? email ?? "",
    Telefono: Telefono ?? telefono ?? "",
  };

  try {
    const airtableRes = await fetch(
      "https://api.airtable.com/v0/appnaFlfYdTWT5Lus/tbllk3WJAkxXmhc7B", // tu Base y Table
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`, // 🔑 mejor con variable de entorno
        },
        body: JSON.stringify({
          records: [{ fields }],
        }),
      }
    );

    const data = await airtableRes.json();
    return res.status(airtableRes.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Error al enviar a Airtable" });
  }
}
>