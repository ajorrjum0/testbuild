import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ArtCarousel } from "./ArtCarousel";
import TokenPrice, { TokenTrendBadge } from "./components/TokenPrice";
import ClickableImage from "./components/ClickableImage";
import ZoraData from "./ZoraData";
import Footer from "./components/Footer";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqVisible, setFaqVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // Toggle FAQ visibility when FAQ button is clicked
    if (id === "faq") {
      setFaqVisible((v) => {
        const next = !v;
        if (menuOpen) setMenuOpen(false);
        if (next) {
          setActiveSection("faq");
          // allow expansion animation then scroll
          setTimeout(() => {
            const el = document.getElementById("faq");
            el?.scrollIntoView({ behavior: "smooth" });
          }, 120);
        } else {
          setActiveSection("home");
        }
        return next;
      });
      return;
    }

    setActiveSection(id);
    setMenuOpen(false);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-black text-white min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      {/* === HEADER === */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-lg border-b border-white/5" : ""
        }`}
      >
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="text-2xl font-bold tracking-wider cursor-pointer hover:text-cyan-400 transition-colors"
            onClick={() => scrollToSection("home")}
          >
            CULTR
          </div>

          <div className="hidden">
            {["home", "art", "faq"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`capitalize font-medium transition-all hover:text-cyan-400 ${
                  activeSection === section
                    ? "text-cyan-400"
                    : "text-gray-400"
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          <button
            className="text-white bg-black/30 p-2 rounded-md hover:bg-black/50 hover:text-cyan-400 active:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        <div
          className={`absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ${
            menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
          style={{ zIndex: 60 }}
        >
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {["home", "art", "faq"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="capitalize text-lg font-medium text-left hover:text-cyan-400 transition-colors"
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* === MAIN === */}
      <main className="relative">
        {/* === HOME SECTION === */}
        <section
          id="home"
          className="min-h-screen flex flex-col items-center justify-center px-6 pt-20"
        >
          <div className="relative group">
            <div className="absolute -inset-1 pointer-events-none bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <ClickableImage
              src="/logo.png"
              alt="CULTR logo"
              className="relative w-40 h-40 rounded-full object-cover border-4 border-white/10"
            />
          </div>

          <h1 className="mt-8 text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            CULTR
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mt-4 font-light">
            The Future of Base Culture
          </p>

          <div className="mt-16 w-full max-w-2xl space-y-6">
            <div className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300"></div>
              <div className="relative flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2 whitespace-nowrap">
                    <span className="text-base md:text-lg text-gray-300 font-medium">CULTR Market Cap:</span>
                    <span className="text-base md:text-lg"><ZoraData inline /></span>
                  </div>
                  <div className="mt-1">
                    <TokenPrice showPrice={true} showTrend={false} className="text-lg md:text-xl" />
                  </div>
                </div>
                <div className="ml-4">
                  <TokenTrendBadge className="text-base md:text-lg font-bold inline-flex items-center bg-black/40 px-2 py-1 rounded-full" />
                </div>
              </div>
                <h2 className="relative text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                <TokenPrice showTrend={false} />
              </h2>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Top Market Cap Art
              </h3>
              <div className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all duration-300"></div>
                <ClickableImage
                  src="/images/top-market.png"
                  alt="Top Art"
                  className="relative w-full rounded-xl shadow-2xl transform transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* === ART SECTION === */}
        <section
          id="art"
          className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            The Future of Base Culture
          </h2>
          <p className="text-gray-400 text-lg mb-16 text-center max-w-2xl">
            Exploring digital identity and cultural evolution through on-chain art
          </p>

          <div className="w-full max-w-7xl">
            <ArtCarousel items={[1, 2, 3, 4]} />
          </div>
        </section>

        {/* === FAQ SECTION === */}
        <section
          id="faq"
          className={`transition-all duration-500 overflow-hidden ${faqVisible ? 'min-h-screen flex flex-col items-center justify-center px-6 py-20 opacity-100' : 'max-h-0 px-6 py-0 opacity-0'}`}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-16 text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>

          <div className="w-full max-w-3xl space-y-4">
            {[
              {
                q: "What is CULTR?",
                a: "CULTR is a digital-native collective building culture on Base and Zora through on-chain art.",
              },
              {
                q: "How can I support the project?",
                a: "You can collect or share our art, join discussions, and follow us across social platforms.",
              },
              {
                q: "Who creates the art?",
                a: "The art is generated and curated by the CULTR collective — exploring digital identity and cultural evolution.",
              },
              { q: "CULTR Utility?", a: "👀" },
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between text-gray-200 group-hover:text-cyan-400 transition-colors">
                  {faq.q}
                  <span className="ml-4 transform group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-gray-400 mt-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* === FOOTER === */}
      <Footer />
    </div>
  );
}

export default App;

