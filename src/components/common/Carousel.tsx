// @/components/common/Carousel.tsx
"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselProps {
  items: {
    src: string;
    alt: string;
  }[];
}

const Carousel = ({ items }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(interval);
  }, [items.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
      {items.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            style={{objectFit:"cover"}}
            className="w-full h-full"
          />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-card-light/50 text-text-primary-light p-2 rounded-full hover:bg-card-light/75 dark:bg-card-dark/50 dark:text-text-primary-dark dark:hover:bg-card-dark/75"
      >
        &#10094;
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-card-light/50 text-text-primary-light p-2 rounded-full hover:bg-card-light/75 dark:bg-card-dark/50 dark:text-text-primary-dark dark:hover:bg-card-dark/75"
      >
        &#10095;
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex
                ? 'bg-primary dark:bg-primary-dark'
                : 'bg-primary/50 dark:bg-primary-dark/50'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
