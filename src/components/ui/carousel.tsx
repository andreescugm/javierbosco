import { useState, useRef, useEffect } from "react";

const C = {
  gold: "#A08C5B",
  goldLine: "rgba(160,140,91,0.25)",
  goldDim: "rgba(160,140,91,0.12)",
  black: "#030303",
  blackDeep: "#0A0A0A",
  blackBorder: "#1A1A1A",
  white: "#F5F2EB",
  whiteDim: "#DDD8CE",
  grey: "#9B958C",
  greyDark: "#6B6560",
};

const HEADING = "'Playfair Display', 'Georgia', serif";
const UI = "'Inter', 'Helvetica Neue', sans-serif";

export interface CarouselItem {
  image: string;
  title: string;
  tag: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: `1px solid ${hover ? C.gold : C.blackBorder}`,
        background: hover ? "rgba(160,140,91,0.08)" : "transparent",
        color: hover ? C.gold : C.greyDark,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.4s cubic-bezier(0.25,0.1,0.25,1)",
        flexShrink: 0,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        {direction === "prev" ? (
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

function InfoButton({ onClick }: { onClick?: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 20px",
        fontFamily: UI,
        fontSize: 9,
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        color: hover ? C.gold : C.greyDark,
        background: "transparent",
        border: `1px solid ${hover ? C.goldLine : C.blackBorder}`,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.25,0.1,0.25,1)",
        marginTop: 16,
      }}
    >
      Solicitar información
    </button>
  );
}

export function Carousel({ items }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = (dir: "next" | "prev") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent(c => dir === "next" ? (c + 1) % items.length : (c - 1 + items.length) % items.length);
      setAnimating(false);
    }, 600);
  };

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const prev = (current - 1 + items.length) % items.length;
  const next = (current + 1) % items.length;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Main viewport */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 20, alignItems: "end" }}>
        {/* Prev card (dimmed) */}
        <div
          style={{
            opacity: 0.35,
            transform: "scale(0.92)",
            transition: "all 0.6s cubic-bezier(0.25,0.1,0.25,1)",
            cursor: "pointer",
            filter: "grayscale(0.8)",
          }}
          onClick={() => go("prev")}
        >
          <div style={{ aspectRatio: "4/3", overflow: "hidden", borderRadius: 2 }}>
            <img
              src={items[prev].image}
              alt={items[prev].title}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.5)" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        </div>

        {/* Active card */}
        <div
          style={{
            opacity: animating ? 0.7 : 1,
            transform: animating
              ? `translateX(${direction === "next" ? "-20px" : "20px"}) scale(0.98)`
              : "translateX(0) scale(1)",
            transition: "all 0.6s cubic-bezier(0.25,0.1,0.25,1)",
          }}
        >
          <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", borderRadius: 2 }}>
            <img
              src={items[current].image}
              alt={items[current].title}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(0.4) brightness(0.75)" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(3,3,3,0.7) 0%, transparent 60%)",
            }} />
          </div>
          <div style={{ paddingTop: 20 }}>
            <h3 style={{
              fontFamily: HEADING,
              fontSize: "clamp(20px, 2vw, 28px)",
              fontWeight: 400,
              color: C.white,
              letterSpacing: "0.02em",
              marginBottom: 8,
              lineHeight: 1.2,
            }}>
              {items[current].title}
            </h3>
            <div style={{
              fontFamily: UI,
              fontSize: 9,
              letterSpacing: "0.25em",
              color: C.greyDark,
              textTransform: "uppercase",
            }}>
              {items[current].tag}
            </div>
            <InfoButton />
          </div>
        </div>

        {/* Next card (dimmed) */}
        <div
          style={{
            opacity: 0.35,
            transform: "scale(0.92)",
            transition: "all 0.6s cubic-bezier(0.25,0.1,0.25,1)",
            cursor: "pointer",
            filter: "grayscale(0.8)",
          }}
          onClick={() => go("next")}
        >
          <div style={{ aspectRatio: "4/3", overflow: "hidden", borderRadius: 2 }}>
            <img
              src={items[next].image}
              alt={items[next].title}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.5)" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 32 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <ArrowButton direction="prev" onClick={() => go("prev")} />
          <ArrowButton direction="next" onClick={() => go("next")} />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? "next" : "prev"); setCurrent(i); }}
              style={{
                width: i === current ? 24 : 6,
                height: 1,
                background: i === current ? C.gold : C.blackBorder,
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.4s cubic-bezier(0.25,0.1,0.25,1)",
              }}
            />
          ))}
        </div>
        <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark }}>
          {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
