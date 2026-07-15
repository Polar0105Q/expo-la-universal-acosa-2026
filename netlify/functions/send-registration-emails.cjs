const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

function field(data, name) {
  const value = data[name];
  if (Array.isArray(value)) return value.join(", ");
  return typeof value === "string" ? value : "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function rows(data) {
  const labels = [
    "Nombre y Apellido",
    "Nombre de Empresa",
    "email",
    "Teléfono / WhatsApp",
    "Ubicación de Negocio",
    "Fecha de asistencia",
    "Cantidad de asistentes",
    "Categoría de interés",
  ];

  return labels
    .map((label) => {
      const value = escapeHtml(field(data, label));
      const displayLabel = label === "email" ? "Correo electrónico" : label;
      return `<tr><th align="left" style="padding:10px;border-bottom:1px solid #eee;">${escapeHtml(displayLabel)}</th><td style="padding:10px;border-bottom:1px solid #eee;">${value || "-"}</td></tr>`;
    })
    .join("");
}

async function sendBrevoEmail(payload) {
  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo error ${response.status}: ${errorText}`);
  }

  return response.json();
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  if (!process.env.BREVO_API_KEY) {
    return { statusCode: 500, body: "Missing BREVO_API_KEY" };
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) {
    return { statusCode: 500, body: "Missing BREVO_SENDER_EMAIL" };
  }

  const senderName = process.env.BREVO_SENDER_NAME || "EXPO La Universal ACOSA 2026";
  const internalRecipients = (process.env.INTERNAL_RECIPIENTS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  try {
    const data = JSON.parse(event.body || "{}");
    const customerEmail = field(data, "email");
    const customerName = field(data, "Nombre y Apellido") || "Cliente";

    if (!customerEmail) {
      return { statusCode: 400, body: "Missing customer email" };
    }

    const sender = { name: senderName, email: senderEmail };

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;color:#101828;line-height:1.5;">
        <h2 style="margin:0 0 12px;">Registro recibido</h2>
        <p>Hola ${escapeHtml(customerName)}, gracias por registrarte a <strong>EXPO La Universal ACOSA 2026</strong>.</p>
        <p>Hemos recibido tus datos correctamente. Pronto nos pondremos en contacto contigo.</p>
        <p style="margin-top:24px;">La Universal | ACOSA</p>
      </div>
    `;

    await sendBrevoEmail({
      sender,
      to: [{ email: customerEmail, name: customerName }],
      subject: "Confirmación de registro | EXPO La Universal ACOSA 2026",
      htmlContent: customerHtml,
      replyTo: sender,
      tags: ["expo-2026", "registro-cliente"],
    });

    if (internalRecipients.length > 0) {
      const internalHtml = `
        <div style="font-family:Arial,sans-serif;color:#101828;line-height:1.5;">
          <h2 style="margin:0 0 12px;">Nuevo registro EXPO La Universal ACOSA 2026</h2>
          <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:720px;">
            ${rows(data)}
          </table>
        </div>
      `;

      await sendBrevoEmail({
        sender,
        to: internalRecipients.map((email) => ({ email })),
        subject: "Nuevo registro | EXPO La Universal ACOSA 2026",
        htmlContent: internalHtml,
        replyTo: { email: customerEmail, name: customerName },
        tags: ["expo-2026", "registro-interno"],
      });
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Email delivery failed" };
  }
};
