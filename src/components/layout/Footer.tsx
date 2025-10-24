// @/components/layout/Footer.tsx
import Link from 'next/link';

const Footer = () => {
  return (
<footer className="bg-card-light dark:bg-card-dark shadow-md mt-8 border-t border-border-light dark:border-border-dark">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            &copy; {new Date().getFullYear()} EduRecicla. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/about" className="text-sm text-text-secondary-light hover:text-secondary dark:text-text-secondary-dark dark:hover:text-secondary-dark">
              About Us
            </Link>
            <Link href="/contact" className="text-sm text-text-secondary-light hover:text-secondary dark:text-text-secondary-dark dark:hover:text-secondary-dark">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-text-secondary-light hover:text-secondary dark:text-text-secondary-dark dark:hover:text-secondary-dark">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
