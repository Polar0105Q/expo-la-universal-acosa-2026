const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const SITE_URL =
  process.env.SITE_URL || "https://expo-la-universal-acosa-2026.acosa.online";

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

function brandedShell({ eyebrow, title, body }) {
  return `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#f4f1ed;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ed;padding:28px 14px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 18px 45px rgba(17,24,39,.12);">
                <tr>
                  <td style="background:#ff5a13;padding:22px 28px;text-align:center;">
                    <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width:500px;margin:0 auto;background:#ffffff;border-radius:10px;">
                      <tr>
                        <td style="padding:14px 18px;text-align:center;">
                          <img src="${SITE_URL}/logos-web.png" alt="La Universal | ACOSA" width="460" style="display:block;width:100%;max-width:460px;height:auto;margin:0 auto;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:34px 34px 10px;">
                    <p style="margin:0 0 10px;color:#ff5a13;font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
                    <h1 style="margin:0;color:#071226;font-size:28px;line-height:1.15;font-weight:900;">${escapeHtml(title)}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 34px 34px;">
                    ${body}
                  </td>
                </tr>
                <tr>
                  <td style="background:#111827;padding:18px 28px;text-align:center;">
                    <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">EXPO La Universal ACOSA 2026</p>
                    <p style="margin:6px 0 0;color:#d1d5db;font-size:12px;">Tecnología, escolares, oficina, sublimación, gaming y más.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function dataRows(data) {
  const labels = [
    ["Nombre y Apellido", "Nombre y Apellido"],
    ["Nombre de Empresa", "Nombre de Empresa"],
    ["email", "Correo electrónico"],
    ["Teléfono / WhatsApp", "Teléfono / WhatsApp"],
    ["Ubicación de Negocio", "Ubicación de Negocio"],
    ["Fecha de asistencia", "Fecha de asistencia"],
    ["Cantidad de asistentes", "Cantidad de asistentes"],
    ["Categoría de interés", "Categoría de interés"],
  ];

  return labels
    .map(([key, label]) => {
      const value = escapeHtml(field(data, key)) || "-";
      return `
        <tr>
          <th align="left" style="width:42%;padding:12px 14px;background:#fff7ed;border-bottom:1px solid #f1e4dc;color:#374151;font-size:13px;line-height:1.35;">${escapeHtml(label)}</th>
          <td style="padding:12px 14px;border-bottom:1px solid #f1e4dc;color:#111827;font-size:14px;line-height:1.35;">${value}</td>
        </tr>
      `;
    })
    .join("");
}

function customerTemplate(customerName) {
  return brandedShell({
    eyebrow: "Registro confirmado",
    title: "¡Gracias por registrarte!",
    body: `
      <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.55;">
        Hola <strong>${escapeHtml(customerName)}</strong>, hemos recibido tus datos correctamente para
        <strong>EXPO La Universal ACOSA 2026</strong>.
      </p>
      <p style="margin:0 0 22px;color:#374151;font-size:16px;line-height:1.55;">
        Nuestro equipo revisará tu registro y pronto se pondrá en contacto contigo si necesitamos confirmar información adicional.
      </p>
      <div style="border-left:5px solid #ff5a13;background:#fff7ed;border-radius:10px;padding:16px 18px;">
        <p style="margin:0;color:#111827;font-size:15px;line-height:1.45;font-weight:700;">¡No te lo pierdas!</p>
        <p style="margin:6px 0 0;color:#4b5563;font-size:14px;line-height:1.45;">Te esperamos para conocer nuevas sorpresas y soluciones para tu negocio.</p>
      </div>
    `,
  });
}

function internalTemplate(data) {
  return brandedShell({
    eyebrow: "Nuevo lead recibido",
    title: "Nuevo registro para EXPO La Universal ACOSA 2026",
    body: `
      <p style="margin:0 0 18px;color:#374151;font-size:15px;line-height:1.5;">
        Se recibió un nuevo registro desde la landing. Estos son los datos capturados:
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;border:1px solid #f1e4dc;border-radius:12px;overflow:hidden;">
        ${dataRows(data)}
      </table>
      <p style="margin:18px 0 0;color:#6b7280;font-size:13px;line-height:1.45;">
        Tip: puedes responder este correo para contactar al cliente directamente.
      </p>
    `,
  });
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

  const senderName =
    process.env.BREVO_SENDER_NAME || "EXPO La Universal ACOSA 2026";
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

    await sendBrevoEmail({
      sender,
      to: [{ email: customerEmail, name: customerName }],
      subject: "Confirmación de registro | EXPO La Universal ACOSA 2026",
      htmlContent: customerTemplate(customerName),
      replyTo: sender,
      tags: ["expo-2026", "registro-cliente"],
    });

    if (internalRecipients.length > 0) {
      await sendBrevoEmail({
        sender,
        to: internalRecipients.map((email) => ({ email })),
        subject: "Nuevo registro | EXPO La Universal ACOSA 2026",
        htmlContent: internalTemplate(data),
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
