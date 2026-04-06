import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.5 },
  },
};

const line = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease } },
};

export function Hero() {
  const scrollToContacto = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      id="hero"
      className="relative w-full min-h-screen overflow-hidden bg-obsidian"
    >
      {/* Architectural texture — barely perceptible */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M80 0 L0 0 L0 80' stroke='%23E8E4DD' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Depth gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 50% 30%, #0A0A0A 0%, #050505 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 md:px-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Pre-label */}
          <motion.div variants={line} className="mb-12">
            <span className="font-inter text-[9px] tracking-[0.55em] text-ash uppercase">
              Madrid · Real Estate · Off-Market
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={line}
            className="font-playfair font-normal leading-[1] tracking-[0.05em] text-warm-white mb-8"
            style={{ fontSize: 'clamp(52px, 8vw, 104px)' }}
          >
            Javier Bosco
          </motion.h1>

          {/* Divider line draws in */}
          <motion.div
            variants={{
              hidden: { scaleY: 0, opacity: 0 },
              visible: {
                scaleY: 1,
                opacity: 0.5,
                transition: { duration: 0.9, ease },
              },
            }}
            style={{ originY: 0 }}
            className="w-px h-10 bg-gold mx-auto mb-8"
          />

          {/* Tagline */}
          <motion.p
            variants={line}
            className="font-playfair text-[17px] md:text-[20px] tracking-[0.1em] text-gold mb-10"
          >
            Off-market. On-point.
          </motion.p>

          {/* Subtexto */}
          <motion.p
            variants={line}
            className="font-inter font-light text-[13px] md:text-[14px] leading-[1.95] tracking-[0.02em] text-ash mb-16 max-w-[280px] mx-auto"
          >
            Las propiedades que valen de verdad
            <br />
            no están en ningún portal.
          </motion.p>

          {/* CTA */}
          <motion.div variants={line}>
            <button
              onClick={scrollToContacto}
              className="font-inter font-light text-[9px] tracking-[0.45em] uppercase text-gold border border-gold/40 bg-transparent px-12 py-5 transition-all duration-700 hover:border-gold/70 hover:bg-gold/[0.07] cursor-pointer"
              style={{ borderRadius: '2px' }}
            >
              Solicitar Acceso
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1.2, ease: 'easeOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="font-inter text-[8px] tracking-[0.45em] uppercase text-smoke">
          Scroll
        </span>
        <div className="relative w-px h-14 overflow-hidden bg-elevated">
          <motion.div
            className="absolute inset-x-0 top-0 bg-gold/50"
            animate={{ height: ['0%', '100%'], top: ['0%', '0%'] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
