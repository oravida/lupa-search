import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logoUrl from "@assets/LUPA_001_1771857307394.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (location !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Pesquisa Eleitoral", id: "eleitoral" },
    { name: "Pesquisa Empresarial", id: "empresarial" },
    { name: "Pesquisa Ambiental", id: "ambiental" },
    { name: "Contato", id: "contato" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/">
            <a className="flex items-center gap-3" data-testid="link-home">
              <img 
                src={logoUrl} 
                alt="Lupa Logo" 
                className="h-12 w-auto"
                onError={(e) => { 
                  const t = e.target as HTMLImageElement;
                  t.onerror = null; 
                  t.src = "https://placehold.co/200x80?text=Lupa"; 
                }} 
              />
            </a>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-lupa-graphite hover:text-lupa-orange transition-colors"
                data-testid={`link-${link.id}`}
              >
                {link.name}
              </button>
            ))}
            <Link href="/sobre">
              <a className="text-sm font-medium text-lupa-graphite hover:text-lupa-orange transition-colors" data-testid="link-sobre">
                Sobre a Lupa
              </a>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-lupa-graphite hover:text-lupa-orange focus:outline-none"
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 w-full bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-left text-base font-medium text-lupa-graphite hover:text-lupa-orange transition-colors py-2"
              >
                {link.name}
              </button>
            ))}
            <Link href="/sobre">
              <a onClick={() => setIsOpen(false)} className="text-base font-medium text-lupa-graphite hover:text-lupa-orange transition-colors py-2 block">
                Sobre a Lupa
              </a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
