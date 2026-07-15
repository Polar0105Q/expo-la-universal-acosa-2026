import { NextResponse } from "next/server";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const SITE_URL =
  process.env.SITE_URL || "https://expo-la-universal-acosa-2026.acosa.online";

type RegistrationData = Record<string, string | string[] | undefined>;

function field(data: RegistrationData, name: string) {
  const value = data[name];
  if (Array.isArray(value)) return value.join(", ");
  return typeof value === "string" ? value : "";
}

function escapeHtml(value: string) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function envValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }

  return "";
}

function splitEmails(value: string) {
  return value
    .split(/[,\n;]+/)
    .map((email) => email.trim())
    .filter(Boolean);
}

function brandedShell({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#f4f1ed;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ed;padding:28px 14px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 18px 45px rgba(17,24,39,.12);">
                <tr>
                  <td style="background:#ff5a13;padding:26px 28px;text-align:center;">
                    <table role="presentation" cellspacing="0" cellpadding="0" style="width:220px;margin:0 auto;background:#ffffff;border-radius:8px;">
                      <tr>
                        <td style="padding:7px 9px;text-align:center;">
                          <img src="${SITE_URL}/logos-web.png" alt="La Universal | ACOSA" width="202" style="display:block;width:202px;max-width:202px;height:auto;margin:0 auto;border:0;" />
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

function dataRows(data: RegistrationData) {
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

function customerTemplate(customerName: string) {
  return brandedShell({
    eyebrow: "Registro confirmado",
    title: "Gracias por registrarte",
    body: `
      <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.55;">
        Hola <strong>${escapeHtml(customerName)}</strong>, hemos recibido tus datos correctamente para
        <strong>EXPO La Universal ACOSA 2026</strong>.
      </p>
      <p style="margin:0 0 22px;color:#374151;font-size:16px;line-height:1.55;">
        Nuestro equipo revisará tu registro y pronto se pondrá en contacto contigo si necesitamos confirmar información adicional.
      </p>
      <div style="border-left:5px solid #ff5a13;background:#fff7ed;border-radius:10px;padding:16px 18px;">
        <p style="margin:0;color:#111827;font-size:15px;line-height:1.45;font-weight:700;">No te lo pierdas</p>
        <p style="margin:6px 0 0;color:#4b5563;font-size:14px;line-height:1.45;">Te esperamos para conocer nuevas sorpresas y soluciones para tu negocio.</p>
      </div>
    `,
  });
}

function internalTemplate(data: RegistrationData) {
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
        Puedes responder este correo para contactar al cliente directamente.
      </p>
    `,
  });
}

async function sendBrevoEmail(payload: unknown) {
  const brevoApiKey = envValue("BREVO_API_KEY", "CLAVE_API_BREVO");

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": brevoApiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo error ${response.status}: ${errorText}`);
  }
}

export async function POST(request: Request) {
  const brevoApiKey = envValue("BREVO_API_KEY", "CLAVE_API_BREVO");
  if (!brevoApiKey) {
    return NextResponse.json(
      { error: "Missing BREVO_API_KEY / CLAVE_API_BREVO" },
      { status: 500 },
    );
  }

  const senderEmail = envValue(
    "BREVO_SENDER_EMAIL",
    "CORREO_REMITENTE_BREVO",
    "CORREO_ELECTRONICO_DEL_REMITENTE_DE_BREVO",
  );
  if (!senderEmail) {
    return NextResponse.json(
      { error: "Missing BREVO_SENDER_EMAIL / CORREO_REMITENTE_BREVO" },
      { status: 500 },
    );
  }

  const senderName =
    envValue("BREVO_SENDER_NAME", "NOMBRE_DEL_REMITENTE_BREVO") ||
    "EXPO La Universal ACOSA 2026";
  const internalRecipients = splitEmails(
    envValue("INTERNAL_RECIPIENTS", "DESTINATARIOS_INTERNOS"),
  );

  try {
    const data = (await request.json()) as RegistrationData;
    const customerEmail = field(data, "email");
    const customerName = field(data, "Nombre y Apellido") || "Cliente";

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Missing customer email" },
        { status: 400 },
      );
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
      try {
        await sendBrevoEmail({
          sender,
          to: internalRecipients.map((email) => ({ email })),
          subject: "Nuevo registro | EXPO La Universal ACOSA 2026",
          htmlContent: internalTemplate(data),
          tags: ["expo-2026", "registro-interno"],
        });
      } catch (error) {
        console.error("Internal notification failed", {
          recipients: internalRecipients,
          error,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Email delivery failed" },
      { status: 500 },
    );
  }
}
