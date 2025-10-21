// @/components/layout/Footer.tsx
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white shadow-md mt-8">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} EduRecicla. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/about" className="text-sm text-gray-600 hover:text-orange-DEFAULT">
              About Us
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-orange-DEFAULT">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-orange-DEFAULT">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
