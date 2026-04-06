import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;
const vp = { once: false, amount: 0.3 as const };

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, delay, ease } },
});

const tiposOperacion = [
  'Compra de activo',
  'Venta de activo',
  'Operación hotelera',
  'Advisory',
  'Otra consulta',
];

export function Contacto() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="contacto"
      className="bg-obsidian px-6 md:px-16 lg:px-24"
      style={{ paddingTop: 200, paddingBottom: 200 }}
    >
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="mb-20 text-center"
        >
          <span className="font-inter text-[9px] tracking-[0.55em] text-gold uppercase block mb-8">
            Contacto
          </span>
          <h2
            className="font-playfair font-normal text-warm-white leading-[1.15] mb-8"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            Hábleme de lo que necesita.
          </h2>
          {/* Thin gold line */}
          <motion.div
            variants={{
              hidden: { scaleX: 0, opacity: 0 },
              visible: {
                scaleX: 1,
                opacity: 0.35,
                transition: { duration: 0.9, ease, delay: 0.3 },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            style={{ originX: 0.5 }}
            className="w-12 h-px bg-gold mx-auto mb-8"
          />
          <p className="font-inter font-light text-[13px] text-smoke leading-[1.9]">
            Sin formularios eternos. Sin intermediarios.
            <br />
            Respondo personalmente.
          </p>
        </motion.div>

        {/* Form / Confirmation */}
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="py-24 text-center"
            >
              <div className="w-px h-16 bg-gold/30 mx-auto mb-12" />
              <h3
                className="font-playfair font-normal text-warm-white mb-6"
                style={{ fontSize: '26px' }}
              >
                Mensaje recibido.
              </h3>
              <p className="font-inter font-light text-[13px] text-smoke leading-[1.9]">
                Le contacto personalmente en menos de 24 horas.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              variants={fadeUp(0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
            >
              {/* Nombre */}
              <Field label="Nombre">
                <input
                  type="text"
                  placeholder="Su nombre"
                  required
                  className="input-luxury"
                />
              </Field>

              {/* Tipo de operación */}
              <Field label="Operación">
                <select
                  required
                  defaultValue=""
                  className="input-luxury appearance-none cursor-pointer"
                >
                  <option value="" disabled hidden>
                    Seleccione
                  </option>
                  {tiposOperacion.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Mensaje libre */}
              <Field label="Rango y detalles">
                <textarea
                  placeholder="Importe aproximado, ubicación, cualquier contexto relevante."
                  rows={4}
                  className="input-luxury resize-none"
                />
              </Field>

              {/* Submit */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="font-inter font-light text-[9px] tracking-[0.45em] uppercase text-gold border border-gold/40 bg-transparent px-14 py-5 w-full sm:w-auto transition-all duration-700 hover:border-gold/70 hover:bg-gold/[0.07] cursor-pointer"
                  style={{ borderRadius: '2px' }}
                >
                  Enviar
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Contact details */}
        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="mt-24 pt-16 border-t border-elevated grid grid-cols-3 gap-8"
        >
          {[
            { label: 'Email', value: 'jb@javierbosco.com' },
            { label: 'Base', value: 'Madrid' },
            { label: 'Alcance', value: 'Global' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <span className="block font-inter text-[8px] tracking-[0.35em] uppercase text-gold/35 mb-3">
                {label}
              </span>
              <span className="block font-inter font-light text-[12px] text-ash leading-[1.6]">
                {value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-inter text-[8px] tracking-[0.4em] uppercase text-smoke">
        {label}
      </label>
      {children}
    </div>
  );
}
