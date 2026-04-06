import { TextReveal } from '../ui/text-reveal';

export function TextRevealSection() {
  return (
    <section className="py-24 md:py-40 bg-black px-6">
      <div className="max-w-4xl mx-auto">
        <TextReveal text="No vendemos propiedades. Conectamos patrimonios con oportunidades que nunca llegan a un portal. Lo que hacemos no aparece en Google. Aparece cuando usted nos llama." />
      </div>
    </section>
  );
}
