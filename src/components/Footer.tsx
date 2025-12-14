export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-lg py-12 px-6">
      <div className="container mx-auto text-center">
        <div className="flex justify-center gap-8 mb-6">
          {/* Twitter Icon */}
          <a
            href="https://x.com/BaseCulture_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white inline-flex items-center justify-center cursor-pointer transform transition-colors transition-transform duration-300 hover:scale-110 hover:text-cyan-400 active:text-cyan-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.627l-5.1-6.694-5.867 6.694h-3.306l7.73-8.835L.424 2.25h6.8l4.613 6.107L17.75 2.25zM17.2 20.445h1.828L6.63 3.97H4.7l12.5 16.475z" />
            </svg>
          </a>

          {/* Instagram Icon */}
          <a
            href="https://www.instagram.com/cultr.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white inline-flex items-center justify-center cursor-pointer transform transition-colors transition-transform duration-300 hover:scale-110 hover:text-cyan-400 active:text-cyan-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="5"
                ry="5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M12 9a3 3 0 100 6 3 3 0 000-6z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
            </svg>
          </a>
        </div>

        <p className="text-gray-500 text-sm">
          © 2025 CULTR. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
