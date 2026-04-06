import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface LineSeparatorProps {
  className?: string;
  maxWidth?: string;
}

export function LineSeparator({ className = '', maxWidth = '100%' }: LineSeparatorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <div ref={ref} className={`flex justify-center ${className}`} style={{ maxWidth }}>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: '100%' } : { width: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="h-px bg-gradient-to-r from-transparent via-gold to-transparent"
      />
    </div>
  );
}
