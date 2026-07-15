"use client";

import { useState } from "react";

const categories = [
  "Tecnología",
  "Escolares",
  "Oficina",
  "Sublimación",
  "Gaming",
  "Mobiliario",
  "Todos",
];

const businessLocations = [
  "Managua",
  "Masaya",
  "Granada",
  "Carazo",
  "Rivas",
  "León",
  "Chinandega",
  "Matagalpa",
  "Estelí",
  "Jinotega",
  "Nueva Segovia",
  "Madriz",
  "Boaco",
  "Chontales",
  "Río San Juan",
  "Costa Caribe Norte",
  "Costa Caribe Sur",
  "Otra ubicación",
];

const fieldIcons = {
  user: (
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2.5 1h-5A3.5 3.5 0 0 0 2 12.5V14h12v-1.5A3.5 3.5 0 0 0 10.5 9Z" />
  ),
  building: (
    <path d="M2 15h12v-1H3V2h8v3h2v8h1V5.5L10.5 1H2v14Zm3-2h1v-2H5v2Zm0-4h1V7H5v2Zm0-4h1V3H5v2Zm3 8h1v-2H8v2Zm0-4h1V7H8v2Zm0-4h1V3H8v2Zm3 8h1v-2h-1v2Zm0-4h1V7h-1v2Z" />
  ),
  mail: (
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-.5a.5.5 0 0 0-.5.5v.22l6.5 3.9 6.5-3.9V4a.5.5 0 0 0-.5-.5H2Zm12.5 2.47-6.24 3.74a.5.5 0 0 1-.52 0L1.5 5.97V12a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V5.97Z" />
  ),
  phone: (
    <path d="M3.65 1.15a1.6 1.6 0 0 1 2.28.14l1.1 1.34c.35.43.46 1 .29 1.52l-.44 1.32a.45.45 0 0 0 .1.45l3.1 3.1c.12.12.3.16.45.1l1.32-.44a1.6 1.6 0 0 1 1.52.29l1.34 1.1a1.6 1.6 0 0 1 .14 2.28l-.64.64c-.7.7-1.77 1-2.77.73C5.79 12.22 1.78 8.21.28 2.56A2.83 2.83 0 0 1 1 0l.65.65 2 2Z" />
  ),
  geo: (
    <path d="M8 16s6-5.69 6-10A6 6 0 1 0 2 6c0 4.31 6 10 6 10Zm0-7.75A2.25 2.25 0 1 1 8 3.75a2.25 2.25 0 0 1 0 4.5Z" />
  ),
  calendar: (
    <path d="M4 1v2H2.5A1.5 1.5 0 0 0 1 4.5v9A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 13.5 3H12V1h-1v2H5V1H4Zm9.5 5H2.5v7.5h11V6Z" />
  ),
  people: (
    <path d="M7 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4.5 7a4.5 4.5 0 0 1 9 0v1h-9v-1Zm10-6.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm.5 7.5h2.5v-1a3.5 3.5 0 0 0-3.9-3.48A5.46 5.46 0 0 1 13 14v1Z" />
  ),
};

function FieldIcon({ name }: { name: keyof typeof fieldIcons }) {
  return (
    <svg
      className="field-icon"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      {fieldIcons[name]}
    </svg>
  );
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 4 ? `${digits.slice(0, 4)} ${digits.slice(4)}` : digits;
}

export function RegistrationForm() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 8) {
      setPhoneError("Escribe los 8 dígitos del número. Ejemplo: 8888 8888.");
      return;
    }

    setPhoneError("");

    const formData = new FormData(event.currentTarget);
    formData.set("Teléfono / WhatsApp", `+505 ${formatPhone(phoneDigits)}`);

    await fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as unknown as URLSearchParams).toString(),
    });

    await fetch("/.netlify/functions/send-registration-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    window.location.href = "/gracias";
  }

  return (
    <form
      name="registro-expo"
      method="POST"
      className="expo-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <input type="hidden" name="form-name" value="registro-expo" />
      <p className="hidden-field">
        <label>
          No llenar
          <input name="bot-field" />
        </label>
      </p>

      <label className="form-field">
        <span className="field-label">
          <FieldIcon name="user" />
          Nombre y Apellido <b>*</b>
        </span>
        <input name="Nombre y Apellido" type="text" required />
      </label>

      <label className="form-field">
        <span className="field-label">
          <FieldIcon name="building" />
          Nombre de Empresa <b>*</b>
        </span>
        <input name="Nombre de Empresa" type="text" required />
      </label>

      <label className="form-field">
        <span className="field-label">
          <FieldIcon name="mail" />
          Correo electrónico <b>*</b>
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="correo@empresa.com"
          required
        />
      </label>

      <label className="form-field phone-field">
        <span className="field-label">
          <FieldIcon name="phone" />
          Teléfono / WhatsApp <b>*</b>
        </span>
        <div className="phone-input">
          <strong>+505</strong>
          <input
            name="Teléfono / WhatsApp"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="8888 8888"
            value={phone}
            onChange={(event) => {
              setPhone(formatPhone(event.target.value));
              if (phoneError) setPhoneError("");
            }}
            aria-describedby="phone-help"
            aria-invalid={phoneError ? "true" : "false"}
            required
          />
        </div>
        <small id="phone-help" className={phoneError ? "field-error" : "field-help"}>
          {phoneError || "Escribe solo los 8 dígitos de Nicaragua."}
        </small>
      </label>

      <label className="form-field">
        <span className="field-label">
          <FieldIcon name="geo" />
          Ubicación de Negocio
        </span>
        <select name="Ubicación de Negocio" defaultValue="">
          <option value="" disabled>
            Selecciona una de las opciones disponibles
          </option>
          {businessLocations.map((location) => (
            <option key={location}>{location}</option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span className="field-label">
          <FieldIcon name="calendar" />
          Selecciona la fecha que deseas asistir <b>*</b>
        </span>
        <select name="Fecha de asistencia" defaultValue="" required>
          <option value="" disabled>
            Selecciona una de las opciones disponibles
          </option>
          <option>Día 1 - EXPO La Universal ACOSA 2026</option>
          <option>Día 2 - EXPO La Universal ACOSA 2026</option>
          <option>Ambos días</option>
        </select>
      </label>

      <label className="form-field">
        <span className="field-label">
          <FieldIcon name="people" />
          ¿Cuántas personas asistirán?
        </span>
        <select name="Cantidad de asistentes" defaultValue="">
          <option value="" disabled>
            Selecciona una de las opciones disponibles
          </option>
          <option>1 persona</option>
          <option>2 personas</option>
          <option>3 personas</option>
          <option>4 personas</option>
          <option>5 o más personas</option>
        </select>
      </label>

      <fieldset className="categories">
        <legend>
          <span>Categoría de interés</span>
          <small>Selecciona una o varias áreas</small>
        </legend>
        {categories.map((category) => (
          <label key={category} className="check-option">
            <input
              type="checkbox"
              name="Categoría de interés"
              value={category}
            />
            <span>{category}</span>
          </label>
        ))}
      </fieldset>

      <button type="submit">
        <span>ENVIAR REGISTRO</span>
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M1 8h11.2L8.6 4.4 10 3l6 5-6 5-1.4-1.4 3.6-3.6H1V8Z" />
        </svg>
      </button>
    </form>
  );
}
