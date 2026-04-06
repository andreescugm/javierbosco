import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;
const vp = { once: false, amount: 0.3 as const };

function AnimatedNumber({
  end,
  prefix = '',
  suffix = '',
}: {
  end: number;
  prefix?: string;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-80px' });

  useEffect(() => {
    if (!isInView) {
      const id = setTimeout(() => setValue(0), 0);
      return () => clearTimeout(id);
    }
    const duration = 1800;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += end / steps;
      if (current >= end) { setValue(end); clearInterval(interval); return; }
      setValue(Math.floor(current));
    }, stepDuration);
    return () => clearInterval(interval);
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {prefix}{value}{suffix}
    </span>
  );
}

const stats = [
  {
    display: 'counter',
    end: 300,
    prefix: '+',
    suffix: '',
    label: 'Operaciones cerradas',
  },
  {
    display: 'counter',
    end: 5,
    prefix: '',
    suffix: '+',
    label: 'Años en off-market',
  },
  {
    display: 'counter',
    end: 120,
    prefix: '',
    suffix: 'M€',
    label: 'Mayor operación',
  },
  {
    display: 'static',
    value: '7–120M€',
    label: 'Rango de activos',
  },
];

export function TrackRecord() {
  return (
    <section
      id="track-record"
      className="w-full bg-obsidian px-6 md:px-16 lg:px-24"
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
          className="mb-24 text-center"
        >
          <span className="font-inter text-[9px] tracking-[0.55em] text-gold uppercase mb-8 block">
            Track Record
          </span>
          <h2
            className="font-playfair font-normal text-warm-white leading-[1.1] mb-6"
            style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}
          >
            Resultados que hablan
          </h2>
          <p className="font-inter font-light text-[13px] leading-[1.9] text-smoke max-w-xs mx-auto">
            Operaciones cerradas con discreción absoluta.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-elevated overflow-hidden">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.9, delay: i * 0.12, ease },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              className={[
                'flex flex-col items-center justify-center py-16 px-8',
                'border-r border-elevated last:border-r-0',
                i < 2 ? 'border-b border-b-elevated lg:border-b-0' : '',
              ].join(' ')}
            >
              <div
                className="font-playfair font-normal text-gold leading-none mb-5 tabular-nums"
                style={{ fontSize: 'clamp(36px, 3.5vw, 52px)' }}
              >
                {'display' in stat && stat.display === 'counter' ? (
                  <AnimatedNumber
                    end={(stat as { end: number }).end}
                    prefix={(stat as { prefix: string }).prefix}
                    suffix={(stat as { suffix: string }).suffix}
                  />
                ) : (
                  (stat as { value: string }).value
                )}
              </div>
              <p className="font-inter font-light text-[9px] uppercase tracking-[0.35em] text-smoke text-center leading-[1.8]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.8, delay: 0.5 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="mt-10 flex justify-end"
        >
          <p className="font-inter text-[8px] text-smoke/50 tracking-[0.2em] uppercase">
            Datos acumulados · 2019–2024
          </p>
        </motion.div>
      </div>
    </section>
  );
}
