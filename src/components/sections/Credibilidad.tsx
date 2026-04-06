import { AnimatedCounter } from '../ui/animated-counter';
import { FadeIn } from '../FadeIn';

const stats = [
  { value: 300, prefix: '+', suffix: '', label: 'OPERACIONES CERRADAS' },
  { value: 5, prefix: '+', suffix: '', label: 'AÑOS EN OFF-MARKET' },
  { value: 120, prefix: '', suffix: 'M€', label: 'MAYOR OPERACIÓN HOTELERA' },
  { value: 100, prefix: '', suffix: '%', label: 'DISCRECIÓN GARANTIZADA' },
];

export function Credibilidad() {
  return (
    <section id="credibilidad" className="py-32 bg-black px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.04] border border-white/[0.04]">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.12} className="py-16 px-8 text-center">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
              <span className="block text-[10px] tracking-[0.25em] uppercase text-white/30 font-inter mt-4">
                {stat.label}
              </span>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
