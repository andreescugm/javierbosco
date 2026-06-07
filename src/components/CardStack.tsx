import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  springStiffness?: number;
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  dotColor?: string;
  dotActiveColor?: string;
  borderColor?: string;
  className?: string;
  onChangeIndex?: (index: number, item: T) => void;
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,
  cardWidth = 420,
  cardHeight = 520,
  overlap = 0.48,
  spreadDeg = 48,
  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,
  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,
  showDots = true,
  dotColor = "rgba(160,140,91,0.3)",
  dotActiveColor = "#A08C5B",
  borderColor = "rgba(160,140,91,0.15)",
  className,
  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = React.useState(false);

  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len) return;
    if (pauseOnHover && hovering) return;
    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));
    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next]);

  if (!len) return null;

  return (
    <div
      className={className}
      style={{ width: "100%" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        style={{ position: "relative", width: "100%", height: Math.max(440, cardHeight + 80) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Ambient shadows */}
        <div style={{
          position: "absolute", inset: "0 15%", top: 24, height: 192,
          borderRadius: "50%", background: "rgba(0,0,0,0.04)", filter: "blur(48px)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: "0 12%", bottom: 0, height: 160,
          borderRadius: "50%", background: "rgba(0,0,0,0.08)", filter: "blur(48px)",
          pointerEvents: "none",
        }} />

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          perspective: `${perspectivePx}px`,
        }}>
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              if (abs > maxOffset) return null;

              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 10;
              const z = -abs * depthPx;
              const isActive = off === 0;
              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;

              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (
                      _e: any,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return;
                      const threshold = Math.min(160, cardWidth * 0.22);
                      if (info.offset.x > threshold || info.velocity.x > 650) prev();
                      else if (info.offset.x < -threshold || info.velocity.x < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  style={{
                    position: "absolute", bottom: 0,
                    width: cardWidth, height: cardHeight,
                    borderRadius: 4, border: `2px solid ${borderColor}`,
                    overflow: "hidden",
                    boxShadow: isActive
                      ? "0 25px 60px rgba(0,0,0,0.2), 0 8px 20px rgba(0,0,0,0.1)"
                      : "0 12px 40px rgba(0,0,0,0.15)",
                    zIndex,
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                    userSelect: "none",
                    cursor: isActive ? "grab" : "pointer",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: y + 40, x, rotateZ, rotateX, scale }
                  }
                  animate={{
                    opacity: 1, x, y: y + lift, rotateZ, rotateX, scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  onClick={() => setActive(i)}
                  whileTap={isActive ? { cursor: "grabbing" } : undefined}
                  {...dragProps}
                >
                  <div style={{
                    height: "100%", width: "100%",
                    transform: `translateZ(${z}px)`,
                    transformStyle: "preserve-3d",
                  }}>
                    {renderCard ? (
                      renderCard(item, { active: isActive })
                    ) : (
                      <DefaultCard item={item} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {showDots && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, marginTop: 28,
        }}>
          {items.map((it, idx) => (
            <button
              key={it.id}
              onClick={() => setActive(idx)}
              style={{
                width: idx === active ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                background: idx === active ? dotActiveColor : dotColor,
                transition: "all 0.4s cubic-bezier(0.25,0.1,0.25,1)",
              }}
              aria-label={`Go to ${it.title}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DefaultCard({ item }: { item: CardStackItem }) {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {item.imageSrc && (
        <img
          src={item.imageSrc}
          alt={item.title}
          draggable={false}
          loading="eager"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
          }}
        />
      )}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(3,3,3,0.75) 0%, rgba(3,3,3,0.1) 40%, transparent 100%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        height: "100%", padding: "28px 24px",
      }}>
        {item.tag && (
          <span style={{
            fontFamily: "'Inter','Helvetica Neue',sans-serif",
            fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
            color: "#A08C5B", marginBottom: 8,
          }}>
            {item.tag}
          </span>
        )}
        <div style={{
          fontFamily: "'Playfair Display','Georgia',serif",
          fontSize: "clamp(22px, 2.2vw, 32px)",
          fontWeight: 400, color: "#F5F2EB",
          letterSpacing: "0.08em",
        }}>
          {item.title}
        </div>
        {item.description && (
          <div style={{
            marginTop: 6,
            fontFamily: "'Cormorant Garamond','Georgia',serif",
            fontSize: 14, color: "rgba(245,242,235,0.7)",
            letterSpacing: "0.03em", fontWeight: 300, fontStyle: "italic",
          }}>
            {item.description}
          </div>
        )}
      </div>
    </div>
  );
}
