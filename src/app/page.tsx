'use client';
import Link from 'next/link';
import Carousel from '@/components/common/Carousel';
import { getGlowColor } from '@/utils/getGlowColor';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/utils/api';

// ✅ Fuerza renderizado estático para evitar diferencias SSR/CSR
export const dynamic = "force-static";

interface TopProduct {
  id: string;
  imageUrl: string;
}

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [carouselItems, setCarouselItems] = useState<TopProduct[]>([]);

  const heroButtons = [
    { text: "Explorar catálogo", href: "/buy" },
    { text: "Donar Ahora", href: "/donate" },
  ];

  const ctaButtons = [
    { text: "Donar Ahora", href: "/donate" },
  ];

  const handleDonateClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/");
    } else {
      router.push(href);
    }
  };
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        // Usando api.get como en tu ejemplo
        const res = await api.get<{ data: TopProduct[] }>("/products/top-selling");
        console.log(res.data);
        setCarouselItems(res.data.data); // actualizamos el state
      } catch (err) {
        console.error("Error fetching top products:", err);
      }
    };

    fetchTopProducts();
  }, []);

  // Transformamos carouselItems en el formato que tu Carousel espera
  const formattedCarouselItems = carouselItems.map(p => ({
    id: p.id,
    image: p.imageUrl,
    onClick: () => router.push(`/buy/${p.id}`),
  }));


  return (
    <div className="bg-background-light dark:bg-background-dark transition-colors duration-300 mt-8">

      {/* Sección del Carrusel */}
      <section className="mb-12">
        <Carousel items={formattedCarouselItems} />
      </section>

      {/* Sección Principal */}
      <section className="text-center py-12 md:py-20">
        <h1
          className="text-4xl sm:text-5xl font-bold text-secondary dark:text-secondary-dark"
          suppressHydrationWarning
        >
          EduRecicla
        </h1>
        <p
          className="text-lg sm:text-xl mt-4 text-text-secondary-light dark:text-text-secondary-dark px-4"
          suppressHydrationWarning
        >
          Tu plataforma integral para comprar, vender y donar tecnología reciclada para estudiantes que la necesitan.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 px-4">
          {heroButtons.map((btn, i) => {
            const glow = getGlowColor(i);
            return (
              <Link
                key={btn.text}
                href={btn.href}
                onClick={(e) => btn.text === "Donate Now" && handleDonateClick(e, btn.href)}
                className="
                w-full sm:w-auto bg-primary text-text-button-light dark:text-white font-bold
                border border-gray-500 dark:border-white
                py-3 px-6 rounded-lg shadow-md
                transition-all duration-300 ease-in-out
                hover:scale-105 hover:text-lg text-center
              "
                style={{ boxShadow: "0 0 0 transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 transparent";
                }}
              >
                {btn.text === "Donate Now" ? "Donar Ahora" : btn.text}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sección Cómo Funciona */}
      <section className="py-12 md:py-20 bg-card-light dark:bg-card-dark transition-colors duration-300">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center text-text-primary-light dark:text-text-primary-dark"
          suppressHydrationWarning
        >
          Cómo Funciona
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {[
            {
              title: "1. Dona o Vende",
              desc: "Muestra fácilmente tus equipos tecnológicos usados para donación o venta. Dale una segunda vida a tus dispositivos y ayuda a un estudiante.",
              colorIndex: 0,
              textColor: "text-primary dark:text-primary-dark",
            },
            {
              title: "2. Beneficio para Estudiantes",
              desc: "Los estudiantes obtienen acceso a tecnología de calidad y asequible, potenciando su educación.",
              colorIndex: 2,
              textColor: "text-secondary dark:text-secondary-dark",
            },
          ].map((card, i) => {
            const glow = getGlowColor(card.colorIndex);
            return (
              <div
                key={i}
                className="
                p-6 sm:p-8 border border-gray-400 dark:border-white
                bg-white dark:bg-white/10
                rounded-lg shadow-md backdrop-blur-sm
                transition-all duration-300 ease-in-out
                hover:scale-105 text-center
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

      {/* Sección Llamado a la Acción */}
      <section className="py-12 md:py-20 text-center">
        <h2
          className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark"
          suppressHydrationWarning
        >
          ¿Listo para Hacer la Diferencia?
        </h2>
        <p
          className="text-lg sm:text-xl mt-4 text-text-secondary-light dark:text-text-secondary-dark px-4"
          suppressHydrationWarning
        >
          Únete a nuestra comunidad y contribuye a un futuro sostenible para la educación.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 px-4">
          {ctaButtons.map((btn, i) => {
            const glow = getGlowColor(i);
            return (
              <Link
                key={btn.text}
                href={btn.href}
                onClick={(e) => btn.text === "Donate Now" && handleDonateClick(e, btn.href)}
                className="
                w-full sm:w-auto bg-primary text-text-button-light dark:text-white font-bold
                border border-gray-500 dark:border-white
                py-3 px-6 rounded-lg shadow-md
                transition-all duration-300 ease-in-out
                hover:scale-105 hover:text-lg text-center
              "
                style={{ boxShadow: "0 0 0 transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 transparent";
                }}
              >
                {btn.text === "Donate Now" ? "Donar Ahora" : btn.text}
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );

}
