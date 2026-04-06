import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, suffix = '', prefix = '', duration = 2 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = prefix + Math.round(latest) + suffix;
      }
    });
    return unsubscribe;
  }, [spring, prefix, suffix]);

  return (
    <motion.span
      ref={ref}
      className="font-playfair text-5xl md:text-6xl font-medium bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent inline-block"
    >
      {prefix}0{suffix}
    </motion.span>
  );
}
