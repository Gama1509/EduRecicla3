// @/app/page.tsx
import Link from 'next/link';
import Carousel from '@/components/common/Carousel';
import { carouselItems } from '@/data/carouselItems';

export default function HomePage() {
  return (
    <div>
      {/* Carousel Section */}
      <section className="mb-12">
        <Carousel items={carouselItems} />
      </section>

      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-blue-DEFAULT">Welcome to EduRecicla</h1>
        <p className="text-xl text-gray-600 mt-4">
          Your one-stop platform for buying, selling, and donating recycled tech for students in need.
        </p>
        <div className="mt-8">
          <Link href="/buy" className="bg-orange-DEFAULT text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors">
            Explore Catalog
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-800">How It Works</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8 border rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-green-DEFAULT">1. Donate or Sell</h3>
            <p className="mt-2 text-gray-600">
              Easily list your used tech equipment for donation or sale. Give your devices a second life and help a student.
            </p>
          </div>
          <div className="p-8 border rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-DEFAULT">2. We Refurbish</h3>
            <p className="mt-2 text-gray-600">
              Our team ensures every device is in good working condition, ready for its new owner.
            </p>
          </div>
          <div className="p-8 border rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-orange-DEFAULT">3. Students Benefit</h3>
            <p className="mt-2 text-gray-600">
              Students get access to affordable, quality technology, empowering their education.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Ready to Make a Difference?</h2>
        <p className="text-xl text-gray-600 mt-4">
          Join our community and contribute to a sustainable future for education.
        </p>
        <div className="mt-8">
          <Link href="/donate" className="bg-green-DEFAULT text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
            Donate Now
          </Link>
        </div>
      </section>
    </div>
  );
}
