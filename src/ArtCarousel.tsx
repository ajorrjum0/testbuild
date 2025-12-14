import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ClickableImage from './components/ClickableImage';

interface ArtCarouselProps {
  items: number[];
}

export function ArtCarousel({ items }: ArtCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full group">
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((num) => (
          <div
            key={num}
            className="flex-shrink-0 w-96 group/card relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl"
          >
            <ClickableImage
              src={`/images/art${num}.png`}
              alt={`Art ${num}`}
              className="relative w-full rounded-xl transform transition-transform duration-500 aspect-square object-cover"
            />
            <p className="relative text-gray-400 mt-4 text-center font-medium">Art #{num}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 duration-300 hover:scale-110"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 duration-300 hover:scale-110"
        aria-label="Scroll right"
      >
        <ChevronRight size={24} />
      </button>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
