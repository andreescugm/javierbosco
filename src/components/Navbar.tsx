import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeSection: string;
}

const links = [
  { label: 'Filosofía', target: 'filosofia' },
  { label: 'Track Record', target: 'track-record' },
  { label: 'Servicios', target: 'servicios' },
  { label: 'Contacto', target: 'contacto' },
];

export function Navbar({ activeSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }),
      menuOpen ? 300 : 0
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-[68px] z-50 flex items-center justify-between px-6 md:px-16 transition-all duration-700 ${
          scrolled
            ? 'bg-obsidian/95 backdrop-blur-md border-b border-elevated'
            : 'bg-transparent'
        }`}
      >
        <button
          onClick={() => scrollTo('hero')}
          className="font-playfair text-[11px] tracking-[0.35em] text-warm-white/60 hover:text-warm-white transition-colors duration-500 cursor-pointer border-none bg-transparent p-0 uppercase"
        >
          Javier Bosco
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <button
              key={link.target}
              onClick={() => scrollTo(link.target)}
              className={`relative font-inter font-light text-[9px] tracking-[0.3em] uppercase bg-transparent border-none cursor-pointer transition-colors duration-500 ${
                activeSection === link.target
                  ? 'text-gold'
                  : 'text-warm-white/25 hover:text-warm-white/50'
              }`}
            >
              {link.label}
              {activeSection === link.target && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gold/50"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden flex-col justify-center items-center w-8 h-8 gap-[5px] bg-transparent border-none cursor-pointer p-0 z-[60]"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
        >
          <motion.span
            className="block w-5 h-px bg-warm-white/60 origin-center"
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.span
            className="block w-5 h-px bg-warm-white/60"
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4 }}
          />
          <motion.span
            className="block w-5 h-px bg-warm-white/60 origin-center"
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.4 }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-obsidian flex flex-col items-center justify-center gap-12 md:hidden"
          >
            {links.map((link, i) => (
              <motion.button
                key={link.target}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.05 + i * 0.08,
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                onClick={() => scrollTo(link.target)}
                className={`font-playfair text-[28px] bg-transparent border-none cursor-pointer transition-colors duration-300 ${
                  activeSection === link.target
                    ? 'text-gold'
                    : 'text-warm-white/40 hover:text-warm-white/70'
                }`}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              onClick={() => scrollTo('contacto')}
              className="font-inter font-light text-[9px] tracking-[0.4em] uppercase text-gold border border-gold/35 px-10 py-4 bg-transparent mt-4 cursor-pointer hover:border-gold/60 transition-colors duration-500"
              style={{ borderRadius: '2px' }}
            >
              Solicitar Acceso
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
