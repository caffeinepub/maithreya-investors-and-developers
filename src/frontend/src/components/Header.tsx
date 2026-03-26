import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/#" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Investment MLM", href: "/#investment-mlm" },
  { label: "Properties", href: "/#services" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy/95 backdrop-blur-md shadow-lg shadow-navy-dark/30"
          : "bg-navy"
      }`}
    >
      {/* Top gold accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <a
          href="/"
          className="flex items-center gap-3 group"
          data-ocid="nav.link"
        >
          <div className="relative w-10 h-10 rounded-full bg-gold flex items-center justify-center font-black text-navy text-lg shadow-gold group-hover:scale-105 transition-transform">
            M
            <div className="absolute inset-0 rounded-full ring-2 ring-gold/40 ring-offset-1 ring-offset-navy opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-white">
            <div className="font-black text-sm tracking-[0.2em] uppercase leading-none">
              MAITHREYA
            </div>
            <div className="text-[10px] text-gold/90 tracking-[0.15em] uppercase mt-0.5">
              Investors &amp; Developers
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-3 py-2 text-[13px] text-white/75 hover:text-white font-medium tracking-wide transition-colors group"
              data-ocid="nav.link"
            >
              {link.label}
              <span className="absolute bottom-1 left-3 right-3 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <a href="/#contact" className="hidden sm:block">
            <Button
              className="bg-gold text-navy font-bold text-sm px-5 h-9 rounded-md shadow-gold hover:brightness-110 hover:shadow-none transition-all"
              data-ocid="nav.primary_button"
            >
              Get Started
            </Button>
          </a>
          <Link to="/admin" className="hidden sm:block">
            <Button
              variant="outline"
              className="h-9 px-4 border-white/20 text-white/70 hover:border-gold/60 hover:text-gold text-sm rounded-md transition-all"
              data-ocid="nav.link"
            >
              Admin
            </Button>
          </Link>
          <button
            type="button"
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden bg-navy-dark border-t border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white/75 hover:text-white py-2.5 border-b border-white/8 text-sm font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.link"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/admin"
                className="text-gold/80 hover:text-gold py-2.5 border-b border-white/8 text-sm font-medium transition-colors flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                Admin
              </Link>
              <div className="pt-3">
                <Button
                  className="w-full bg-gold text-navy font-bold h-11 rounded-md shadow-gold"
                  data-ocid="nav.primary_button"
                  onClick={() => {
                    setMobileOpen(false);
                    window.location.hash = "contact";
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
