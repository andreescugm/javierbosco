import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;
const vp = { once: false, amount: 0.2 as const };

const services = [
  {
    number: '01',
    title: 'Compra y venta off-market',
    description:
      'Cada activo que representamos es una oportunidad única. No se lista — se posiciona. La estrategia determina a qué comprador llega y en qué condiciones.',
  },
  {
    number: '02',
    title: 'Hoteles y cadenas hoteleras',
    description:
      'Desde un hotel boutique hasta cadenas en expansión. Las grandes operaciones ocurren tras puertas cerradas. Operamos donde otros no llegan.',
  },
  {
    number: '03',
    title: 'Edificios y activos singulares',
    description:
      'Edificios completos, el Viso, solares estratégicos, activos que generan rendimientos. Sabemos a quién ofrecer cada operación, cuándo y en qué términos.',
  },
  {
    number: '04',
    title: 'Advisory confidencial',
    description:
      'Para el capital que necesita orientación discreta. Valoración independiente, estructuración de operaciones y acceso a una red que no aparece en ningún directorio público.',
  },
];

export function Servicios() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="servicios"
      className="bg-deep px-6 md:px-16 lg:px-24"
      style={{ paddingTop: 200, paddingBottom: 200 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="mb-24"
        >
          <span className="font-inter text-[9px] tracking-[0.55em] text-gold uppercase block mb-8">
            Servicios
          </span>
          <h2
            className="font-playfair font-normal text-warm-white leading-[1.1]"
            style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}
          >
            Lo que hacemos
          </h2>
        </motion.div>

        {/* List */}
        <div>
          {services.map((service, i) => (
            <motion.div
              key={service.number}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.9, delay: i * 0.08, ease },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="border-t border-elevated last:border-b last:border-elevated cursor-default"
            >
              <div className="py-12 md:py-14 grid grid-cols-12 gap-6 items-start">
                {/* Number */}
                <div className="col-span-2 md:col-span-1 pt-1">
                  <span
                    className="font-playfair font-normal text-gold/60 transition-colors duration-500"
                    style={{
                      fontSize: 'clamp(20px, 2.5vw, 32px)',
                      color: hovered === i ? '#A08C5B' : undefined,
                      opacity: hovered === i ? 1 : undefined,
                    }}
                  >
                    {service.number}
                  </span>
                </div>

                {/* Content */}
                <div className="col-span-10 md:col-span-11">
                  <div className="relative inline-block">
                    <h3
                      className="font-playfair font-normal text-warm-white/80 leading-[1.2] transition-colors duration-500"
                      style={{
                        fontSize: 'clamp(20px, 2.8vw, 36px)',
                        color: hovered === i ? '#E8E4DD' : undefined,
                      }}
                    >
                      {service.title}
                    </h3>
                    {/* Underline draws in on hover */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-px bg-gold"
                      animate={{ width: hovered === i ? '100%' : '0%' }}
                      transition={{ duration: 0.6, ease }}
                    />
                  </div>

                  {/* Description — expands on hover */}
                  <AnimatePresence>
                    {hovered === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.45, ease: 'easeInOut' }}
                        className="font-lora font-light text-[14px] leading-[1.9] text-ash mt-6 overflow-hidden max-w-2xl"
                      >
                        {service.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
