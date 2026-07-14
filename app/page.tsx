import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro | EXPO La Universal ACOSA 2026",
  description:
    "Formulario de registro para asistir a EXPO La Universal ACOSA 2026.",
};

const formEmail = "callcenter14@acosa.com.hn";
const formAction = `https://formsubmit.co/${formEmail}`;

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
          <div className="grain" />
          <div className="promo-content">
            <div className="expo-mark">
              <span className="ring" aria-hidden="true" />
              <span>expo</span>
              <strong>2026</strong>
            </div>
            <div className="icon-row" aria-hidden="true">
              <span>+</span>
              <span>[]</span>
              <span>o</span>
            </div>
            <div className="surprise-copy">
              <span>¡NUEVAS</span>
              <strong>SORPRESAS!</strong>
            </div>
            <div className="divider-row" aria-hidden="true">
              <span>+</span>
              <span>[]</span>
              <span>o</span>
              <i />
            </div>
            <p>¡NO TE LO PIERDAS!</p>
            <img
              className="side-logo"
              src="/brand-lockup.png"
              alt="La Universal | ACOSA"
            />
          </div>
        </aside>

        <section className="form-panel">
          <img
            className="top-logo"
            src="/brand-lockup.png"
            alt="La Universal | ACOSA"
          />
          <h1 id="expo-title">EXPO La Universal ACOSA 2026</h1>

          <form action={formAction} method="POST" className="expo-form">
            <input
              type="hidden"
              name="_subject"
              value="Nuevo registro EXPO La Universal ACOSA 2026"
            />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />

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
