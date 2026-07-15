import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro | EXPO La Universal ACOSA 2026",
  description:
    "Formulario de registro para asistir a EXPO La Universal ACOSA 2026.",
};

const categories = [
  "Tecnología",
  "Escolares",
  "Oficina",
  "Sublimación",
  "Gaming",
  "Mobiliario",
  "Todos",
];

export default function Home() {
  return (
    <main className="expo-page">
      <section className="registration-shell" aria-labelledby="expo-title">
        <aside className="promo-panel" aria-label="EXPO La Universal ACOSA 2026">
          <div className="promo-content">
            <img
              className="expo-naming"
              src="/expo-naming-pc.webp"
              alt="Expo 2026"
            />
            <img
              className="expo-copy"
              src="/expo-copy-pc.webp"
              alt="Nuevas sorpresas"
            />
            <img
              className="side-logo"
              src="/logos-web.png"
              alt="La Universal | ACOSA"
            />
          </div>
        </aside>

        <section className="form-panel">
          <img
            className="mobile-expo-title"
            src="/expo-title-mobile.webp"
            alt="Expo 2026"
          />
          <img
            className="top-logo"
            src="/logos-form.png"
            alt="La Universal | ACOSA"
          />
          <h1 id="expo-title">EXPO La Universal ACOSA 2026</h1>

          <form
            name="registro-expo"
            action="/gracias"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="expo-form"
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

            <label>
              <span>
                Teléfono / WhatsApp Nicaragua <b>*</b>
              </span>
              <input
                name="Teléfono / WhatsApp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+505 8888 8888"
                pattern="^(\\+505\\s?)?\\d{4}\\s?\\d{4}$"
                title="Ingresa un número de Nicaragua de 8 dígitos, con o sin +505."
                required
              />
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
        </section>
      </section>
    </main>
  );
}
