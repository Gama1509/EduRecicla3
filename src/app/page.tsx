// @/app/page.tsx
import Link from 'next/link';
import Carousel from '@/components/common/Carousel';
import { carouselItems } from '@/data/carouselItems';

export default function HomePage() {
  return (
    <div className="bg-background-light dark:bg-background-dark transition-colors duration-300">

      {/* Carousel Section */}
      <section className="mb-12">
        <Carousel items={carouselItems} />
      </section>

      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-secondary dark:text-secondary-dark">
          Welcome to EduRecicla
        </h1>
        <p className="text-xl mt-4 text-text-secondary-light dark:text-text-secondary-dark">
          Your one-stop platform for buying, selling, and donating recycled tech for students in need.
        </p>
        <div className="mt-8">
          <Link
            href="/buy"
            className="bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary-hover dark:bg-secondary-dark dark:hover:bg-secondary-dark-hover transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card-light dark:bg-card-dark transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-text-primary-light dark:text-text-primary-dark">
          How It Works
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8 border border-border-light dark:border-border-dark bg-white dark:bg-white/10 rounded-lg shadow-md backdrop-blur-sm transition-all duration-300">
            <h3 className="text-2xl font-semibold text-primary dark:text-primary-dark">1. Donate or Sell</h3>
            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
              Easily list your used tech equipment for donation or sale. Give your devices a second life and help a student.
            </p>
          </div>
          <div className="p-8 border border-border-light dark:border-border-dark bg-white dark:bg-white/10 rounded-lg shadow-md backdrop-blur-sm transition-all duration-300">
            <h3 className="text-2xl font-semibold text-secondary dark:text-secondary-dark">2. We Refurbish</h3>
            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
              Our team ensures every device is in good working condition, ready for its new owner.
            </p>
          </div>
          <div className="p-8 border border-border-light dark:border-border-dark bg-white dark:bg-white/10 rounded-lg shadow-md backdrop-blur-sm transition-all duration-300">
            <h3 className="text-2xl font-semibold text-secondary dark:text-secondary-dark">3. Students Benefit</h3>
            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
              Students get access to affordable, quality technology, empowering their education.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl mt-4 text-text-secondary-light dark:text-text-secondary-dark">
          Join our community and contribute to a sustainable future for education.
        </p>
        <div className="mt-8">
          <Link
            href="/donate"
            className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover transition-colors"
          >
            Donate Now
          </Link>
        </div>
      </section>

    </div>
  );
}
