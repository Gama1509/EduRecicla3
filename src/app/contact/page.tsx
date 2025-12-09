// @/app/contact/page.tsx
export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">Contáctanos</h1>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
        ¿Tienes preguntas o comentarios? Nos encantaría saber de ti.
      </p>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-4">
        Envíanos un correo a: <a href="mailto:contact@edurecicla.com" className="text-secondary hover:underline">contact@edurecicla.com</a>
      </p>
    </div>
  );
}
