import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
}

function Word({ text, range, progress }: { text: string; range: [number, number]; progress: import('framer-motion').MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {text}{' '}
    </motion.span>
  );
}

export function TextReveal({ text, className = '' }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  });

  const words = text.split(' ');

  return (
    <div ref={ref} className={`min-h-[40vh] flex items-center ${className}`}>
      <p className="font-playfair text-2xl md:text-4xl leading-relaxed text-white">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          return <Word key={`${word}-${i}`} text={word} range={[start, end]} progress={scrollYProgress} />;
        })}
      </p>
    </div>
  );
}
