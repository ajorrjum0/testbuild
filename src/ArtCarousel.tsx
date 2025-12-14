import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
            className="flex-shrink-0 w-96 group/card relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover/card:from-cyan-500/5 group-hover/card:to-purple-500/5 rounded-2xl transition-all duration-500"></div>
            <img
              src={`/images/art${num}.png`}
              alt={`Art ${num}`}
              className="relative w-full rounded-xl shadow-xl transform group-hover/card:scale-105 transition-transform duration-500 aspect-square object-cover"
            />
            <p className="relative text-gray-400 mt-4 text-center font-medium">Art #{num}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-6 z-10 p-3 rounded-full bg-white/10 hover:bg-cyan-500/30 border border-white/20 hover:border-cyan-500/50 transition-all opacity-0 group-hover:opacity-100 duration-300 hover:scale-110"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-6 z-10 p-3 rounded-full bg-white/10 hover:bg-cyan-500/30 border border-white/20 hover:border-cyan-500/50 transition-all opacity-0 group-hover:opacity-100 duration-300 hover:scale-110"
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
