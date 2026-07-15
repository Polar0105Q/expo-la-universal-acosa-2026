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

      <label>
        <span>
          Nombre y Apellido <b>*</b>
        </span>
        <input name="Nombre y Apellido" type="text" required />
      </label>

      <label>
        <span>
          Nombre de Empresa <b>*</b>
        </span>
        <input name="Nombre de Empresa" type="text" required />
      </label>

      <label>
        <span>
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

      <label className="phone-field">
        <span>
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

      <label>
        <span>Ubicación de Negocio</span>
        <select name="Ubicación de Negocio" defaultValue="">
          <option value="" disabled>
            Selecciona una de las opciones disponibles
          </option>
          <option>Xela / Quetzaltenango</option>
          <option>Guatemala</option>
          <option>Huehuetenango</option>
          <option>San Marcos</option>
          <option>Retalhuleu</option>
          <option>Otra ubicación</option>
        </select>
      </label>

      <label>
        <span>
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

      <label>
        <span>¿Cuántas personas asistirán?</span>
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
        <legend>Categoría de interés:</legend>
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

      <button type="submit">ENVIAR</button>
    </form>
  );
}
