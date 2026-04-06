import { FadeIn } from '../FadeIn';

const pasos = [
  {
    num: 'I',
    title: 'Conversación',
    desc: 'Nos cuenta qué busca o qué desea vender. Sin compromiso, sin formularios. Una llamada, un mensaje.',
    border: true,
  },
  {
    num: 'II',
    title: 'Estrategia',
    desc: 'Analizamos el mercado, activamos nuestra red y diseñamos la operación. Sin ruido. Sin intermediarios innecesarios.',
    border: true,
  },
  {
    num: 'III',
    title: 'Ejecución',
    desc: 'Conectamos las partes, negociamos y cerramos. Usted decide. Nosotros nos ocupamos de todo lo demás.',
    border: false,
  },
];

export function Proceso() {
  return (
    <section id="proceso" className="py-32 bg-black px-6">
      <div className="max-w-5xl mx-auto text-center">
        <FadeIn>
          <span className="inline-block text-[11px] tracking-[0.4em] text-gold uppercase font-inter mb-20">
            Cómo trabajamos
          </span>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {pasos.map((paso, i) => (
            <FadeIn
              key={paso.num}
              delay={0.15 * i}
              className={paso.border ? 'md:border-r md:border-white/[0.04]' : ''}
            >
              <div className="flex flex-col items-center px-4">
                <span className="font-playfair text-[64px] text-gold/15 leading-none mb-6">
                  {paso.num}
                </span>
                <h3 className="font-playfair text-xl text-white mb-4">
                  {paso.title}
                </h3>
                <p className="font-inter text-[14px] text-white/35 leading-relaxed max-w-xs mx-auto">
                  {paso.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
