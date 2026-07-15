import type { Metadata } from "next";
import { RegistrationForm } from "./RegistrationForm";

export const metadata: Metadata = {
  title: "Registro | EXPO La Universal ACOSA 2026",
  description:
    "Formulario de registro para asistir a EXPO La Universal ACOSA 2026.",
};

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
          <div className="form-heading">
            <p>Registro oficial</p>
            <h1 id="expo-title">EXPO La Universal ACOSA 2026</h1>
            <span>
              Completa tus datos y recibe la confirmación en tu correo.
            </span>
          </div>
          <div className="form-badges" aria-label="Categorías principales">
            <span>Tecnología</span>
            <span>Escolares</span>
            <span>Oficina</span>
          </div>

          <RegistrationForm />
        </section>
      </section>
    </main>
  );
}
