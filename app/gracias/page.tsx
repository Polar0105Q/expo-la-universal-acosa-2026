import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registro recibido | EXPO La Universal ACOSA 2026",
  description: "Confirmación de registro para EXPO La Universal ACOSA 2026.",
};

export default function GraciasPage() {
  return (
    <main className="thanks-page">
      <section className="thanks-card">
        <img src="/logos-form.png" alt="La Universal | ACOSA" />
        <h1>Registro recibido</h1>
        <p>
          Gracias por registrarte a EXPO La Universal ACOSA 2026. Hemos recibido
          tus datos correctamente.
        </p>
        <Link href="/">Volver al formulario</Link>
      </section>
    </main>
  );
}
