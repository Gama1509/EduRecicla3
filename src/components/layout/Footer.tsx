// @/components/layout/Footer.tsx
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-card-light dark:bg-card-dark shadow-md mt-8 border-t border-border-light dark:border-border-dark">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} EduRecicla. Todos los derechos reservados.
          </p>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <Link href="/about" className="text-sm text-text-secondary-light hover:text-secondary dark:text-text-secondary-dark dark:hover:text-secondary-dark">
              Acerca de nosotros
            </Link>
            <Link href="/contact" className="text-sm text-text-secondary-light hover:text-secondary dark:text-text-secondary-dark dark:hover:text-secondary-dark">
              Contacto
            </Link>
            <Link href="/privacy" className="text-sm text-text-secondary-light hover:text-secondary dark:text-text-secondary-dark dark:hover:text-secondary-dark">
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
