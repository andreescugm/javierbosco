import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;

const vp = { once: false, amount: 0.3 as const };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease } },
};

export function Filosofia() {
  return (
    <section
      id="filosofia"
      className="bg-deep px-6 md:px-16 lg:px-24"
      style={{ paddingTop: 200, paddingBottom: 200 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-0 items-start">
          {/* Left — declaración */}
          <div className="lg:col-span-7 lg:pr-24">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              className="mb-14"
            >
              <span className="font-inter text-[9px] tracking-[0.55em] text-gold uppercase">
                Filosofía
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              className="font-playfair font-normal leading-[1.15] tracking-[0.01em] text-warm-white mb-12"
              style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}
            >
              No trabajo con portales.
              <br />
              Trabajo con confianza.
            </motion.h2>

            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              className="space-y-6"
            >
              <p className="font-lora font-light text-[15px] leading-[1.95] text-ash">
                Más de 300 operaciones cerradas. Nunca una en un portal. Cada
                transacción ocurre en el silencio de una conversación privada,
                entre partes que saben exactamente lo que buscan.
              </p>
              <p className="font-lora font-light text-[15px] leading-[1.95] text-ash">
                El mercado off-market no es una estrategia. Es una forma de
                entender el valor. Las propiedades que realmente importan no se
                anuncian — se ofrecen. A las personas correctas. En el momento
                correcto.
              </p>
            </motion.div>
          </div>

          {/* Right — dato destacado */}
          <div className="lg:col-span-5 lg:pl-16 lg:border-l border-elevated">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              className="space-y-16"
            >
              {/* Stat */}
              <div>
                <div
                  className="font-playfair font-normal text-gold leading-none mb-3"
                  style={{ fontSize: 'clamp(48px, 6vw, 72px)' }}
                >
                  +300
                </div>
                <p className="font-inter font-light text-[9px] tracking-[0.4em] uppercase text-smoke">
                  Operaciones cerradas
                </p>
              </div>

              {/* Divider */}
              <motion.div
                variants={{
                  hidden: { scaleX: 0, opacity: 0 },
                  visible: {
                    scaleX: 1,
                    opacity: 1,
                    transition: { duration: 1, ease, delay: 0.3 },
                  },
                }}
                style={{ originX: 0 }}
                className="h-px bg-elevated"
              />

              {/* Quote */}
              <div>
                <p className="font-playfair font-light italic text-[18px] leading-[1.7] text-warm-white/60">
                  &ldquo;Si estás aquí, ya sabes por qué.&rdquo;
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-elevated" />

              {/* Range */}
              <div>
                <div className="font-inter font-light text-[11px] tracking-[0.3em] uppercase text-smoke mb-4">
                  Rango de operaciones
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-playfair text-[22px] text-warm-white/50">7M€</span>
                  <div className="flex-1 h-px bg-elevated" />
                  <span className="font-playfair text-[22px] text-warm-white/80">120M€</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
