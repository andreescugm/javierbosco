import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface SpotlightProps {
  children: ReactNode;
  className?: string;
}

export function Spotlight({ children, className = '' }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsActive(true);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsActive(false)}
      className={`relative ${className}`}
    >
      {isActive && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(180,147,76,0.06), transparent 70%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
