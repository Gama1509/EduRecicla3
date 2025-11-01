'use client';
import Link from 'next/link';
import Carousel from '@/components/common/Carousel';
import { carouselItems } from '@/data/carouselItems';
import { getGlowColor } from '@/utils/getGlowColor';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const heroButtons = [
    { text: "Explore Catalog", href: "/buy" },
    { text: "Donate Now", href: "/donate" },
  ];

  const ctaButtons = [
    { text: "Donate Now", href: "/donate" },
  ];

  const handleDonateClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push(href);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark transition-colors duration-300">

      {/* Carousel Section */}
      <section className="mb-12">
        <Carousel items={carouselItems} />
      </section>

      {/* Hero Section */}
      <section className="text-center py-20">
        <h1
          className="text-5xl font-bold text-secondary dark:text-secondary-dark"
          suppressHydrationWarning
        >
          feauRecicla
        </h1>
        <p className="text-xl mt-4 text-text-secondary-light dark:text-text-secondary-dark" suppressHydrationWarning>
          Your one-stop platform for buying, selling, and donating recycled tech for students in need.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          {heroButtons.map((btn, i) => {
            const glow = getGlowColor(i);
            return (
              <Link
                key={btn.text}
                href={btn.href}
                onClick={(e) => btn.text === "Donate Now" && handleDonateClick(e, btn.href)}
                className="
                  bg-primary text-text-button-light dark:text-white font-bold
                  border border-gray-500 dark:border-white
                  py-3 px-6 rounded-lg shadow-md
                  transition-all duration-300 ease-in-out
                  hover:scale-105 hover:text-lg
                "
                style={{ boxShadow: "0 0 0 transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 transparent";
                }}
              >
                {btn.text}
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card-light dark:bg-card-dark transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-text-primary-light dark:text-text-primary-dark" suppressHydrationWarning>
          How It Works
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "1. Donate or Sell",
              desc: "Easily list your used tech equipment for donation or sale. Give your devices a second life and help a student.",
              colorIndex: 0,
              textColor: "text-primary dark:text-primary-dark",
            },
            {
              title: "2. We Refurbish",
              desc: "Our team ensures every device is in good working condition, ready for its new owner.",
              colorIndex: 1,
              textColor: "text-secondary dark:text-secondary-dark",
            },
            {
              title: "3. Students Benefit",
              desc: "Students get access to affordable, quality technology, empowering their education.",
              colorIndex: 2,
              textColor: "text-secondary dark:text-secondary-dark",
            },
          ].map((card, i) => {
            const glow = getGlowColor(card.colorIndex);
            return (
              <div
                key={i}
                className="
                  p-8 border border-gray-400 dark:border-white
                  bg-white dark:bg-white/10
                  rounded-lg shadow-md backdrop-blur-sm
                  transition-all duration-300 ease-in-out
                  hover:scale-105
                "
                style={{ boxShadow: "0 0 0 transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 transparent";
                }}
              >
                <h3 className={`text-2xl font-semibold ${card.textColor}`}>
                  {card.title}
                </h3>
                <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                  {card.desc}
                </p>
              </div>
            );
          })}
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
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          {ctaButtons.map((btn, i) => {
            const glow = getGlowColor(i);
            return (
              <Link
                key={btn.text}
                href={btn.href}
                onClick={(e) => btn.text === "Donate Now" && handleDonateClick(e, btn.href)}
                className="
                  bg-primary text-text-button-light dark:text-white font-bold
                  border border-gray-500 dark:border-white
                  py-3 px-6 rounded-lg shadow-md
                  transition-all duration-300 ease-in-out
                  hover:scale-105 hover:text-lg
                "
                style={{ boxShadow: "0 0 0 transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 transparent";
                }}
              >
                {btn.text}
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
