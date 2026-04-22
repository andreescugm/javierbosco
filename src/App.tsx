import { useState, useEffect, useRef, Children, ReactNode, createContext, useContext } from "react";
import { motion, Transition, useMotionValue, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, MapPin, Euro, Home } from "lucide-react";

// ============================================
// JAVIER BOSCO PROPERTIES — KRETZ × BOSCO FUSION
// Solo componentes 21st.dev: smoke shader, liquid glass, nav animated,
// investment slider, carousel de motion-primitives (21st.dev)
// ============================================

const C = {
  gold: "#A08C5B",
  goldHover: "#BFA36D",
  goldDim: "rgba(160,140,91,0.12)",
  goldLine: "rgba(160,140,91,0.25)",
  black: "#030303",
  blackDeep: "#080808",
  blackBorder: "#1A1A1A",
  blackBorderHover: "#2A2520",
  white: "#F5F2EB",
  whiteDim: "#DDD8CE",
  grey: "#9B958C",
  greyDark: "#6B6560",
  greySmoke: "#3E3A35",
};

const HEADING = "'Playfair Display', 'Georgia', serif";
const BODY = "'Cormorant Garamond', 'Georgia', serif";
const UI = "'Inter', 'Helvetica Neue', sans-serif";

// ============================================
// UTILITY: cn (classnames helper used by 21st.dev carousel)
// ============================================
function cn(...args: (string | undefined | false | null)[]) {
  return args.filter(Boolean).join(" ");
}

// ============================================
// SMOKE SHADER (WebGL) — component existente Bosco
// ============================================
const FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;
uniform float u_intensity;
#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}
void main(){
  vec2 uv=(FC-.5*R)/R.y;
  vec3 col=vec3(1);
  uv.x+=.25;uv*=vec2(2,1);
  float n=fbm(uv*.28-vec2(T*.008,0));
  n=noise(uv*3.+n*2.);
  col.r-=fbm(uv+vec2(0,T*.012)+n);
  col.g-=fbm(uv*1.003+vec2(0,T*.012)+n+.003);
  col.b-=fbm(uv*1.006+vec2(0,T*.012)+n+.006);
  col=mix(col, u_color, dot(col,vec3(.21,.71,.07)));
  col=mix(vec3(.02),col,min(time*.1,1.)*u_intensity);
  col=clamp(col,.02,.95);
  O=vec4(col,1);
}`;

function SmokeCanvas({ color = [0.25, 0.22, 0.14] as [number, number, number], intensity = 1.0 }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, `#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}`);
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG);
    gl.compileShader(fs);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "resolution");
    const uTime = gl.getUniformLocation(prog, "time");
    const uColor = gl.getUniformLocation(prog, "u_color");
    const uInt = gl.getUniformLocation(prog, "u_intensity");
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    let raf: number;
    const loop = (now: number) => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 1e-3);
      gl.uniform3fv(uColor, color);
      gl.uniform1f(uInt, intensity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [color, intensity]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}

// ============================================
// CAROUSEL from motion-primitives (21st.dev)
// ============================================
type CarouselContextType = {
  index: number;
  setIndex: (i: number) => void;
  itemsCount: number;
  setItemsCount: (c: number) => void;
  disableDrag: boolean;
};
const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

function useCarousel() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used within CarouselProvider");
  return ctx;
}

function CarouselProvider({ children, initialIndex = 0, onIndexChange, disableDrag = false }: {
  children: ReactNode; initialIndex?: number; onIndexChange?: (i: number) => void; disableDrag?: boolean;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [itemsCount, setItemsCount] = useState(0);
  const handleSetIndex = (i: number) => { setIndex(i); onIndexChange?.(i); };
  useEffect(() => { setIndex(initialIndex); }, [initialIndex]);
  return (
    <CarouselContext.Provider value={{ index, setIndex: handleSetIndex, itemsCount, setItemsCount, disableDrag }}>
      {children}
    </CarouselContext.Provider>
  );
}

function Carousel({ children, className, initialIndex = 0, onIndexChange, disableDrag = false }: {
  children: ReactNode; className?: string; initialIndex?: number; onIndexChange?: (i: number) => void; disableDrag?: boolean;
}) {
  return (
    <CarouselProvider initialIndex={initialIndex} onIndexChange={onIndexChange} disableDrag={disableDrag}>
      <div className={cn("group/hover relative", className)}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </CarouselProvider>
  );
}

function CarouselContent({ children, transition }: { children: ReactNode; transition?: Transition }) {
  const { index, setIndex, setItemsCount, disableDrag } = useCarousel();
  const [visibleItemsCount, setVisibleItemsCount] = useState(1);
  const dragX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsLength = Children.count(children);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).length;
      setVisibleItemsCount(visible);
    }, { root: containerRef.current, threshold: 0.5 });
    const nodes = containerRef.current.children;
    Array.from(nodes).forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, [children]);

  useEffect(() => { if (itemsLength) setItemsCount(itemsLength); }, [itemsLength, setItemsCount]);

  const onDragEnd = () => {
    const x = dragX.get();
    if (x <= -10 && index < itemsLength - 1) setIndex(index + 1);
    else if (x >= 10 && index > 0) setIndex(index - 1);
  };

  return (
    <motion.div
      drag={disableDrag ? false : "x"}
      dragConstraints={disableDrag ? undefined : { left: 0, right: 0 }}
      dragMomentum={disableDrag ? undefined : false}
      style={{ x: disableDrag ? undefined : dragX }}
      animate={{ translateX: `-${index * (100 / visibleItemsCount)}%` }}
      onDragEnd={disableDrag ? undefined : onDragEnd}
      transition={transition || { damping: 18, stiffness: 90, type: "spring", duration: 0.2 }}
      className={cn("flex items-center", !disableDrag && "cursor-grab active:cursor-grabbing")}
      ref={containerRef}
    >
      {children}
    </motion.div>
  );
}

function CarouselItem({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={cn("w-full min-w-0 shrink-0 grow-0 overflow-hidden", className)}>{children}</motion.div>;
}

function CarouselNavigation({ alwaysShow }: { alwaysShow?: boolean }) {
  const { index, setIndex, itemsCount } = useCarousel();
  return (
    <div className="pointer-events-none absolute left-0 top-1/2 flex w-full -translate-y-1/2 justify-between px-4">
      <button
        type="button" aria-label="Previous"
        disabled={index === 0}
        onClick={() => { if (index > 0) setIndex(index - 1); }}
        style={{
          pointerEvents: "auto",
          background: "rgba(3,3,3,0.7)",
          border: `1px solid ${C.goldLine}`,
          borderRadius: "50%",
          padding: 12,
          opacity: alwaysShow ? 1 : 0,
          transition: "all 0.4s",
          cursor: index === 0 ? "not-allowed" : "pointer",
        }}
        className="group-hover/hover:opacity-100 disabled:opacity-30"
      >
        <ChevronLeft size={18} style={{ color: C.gold }} />
      </button>
      <button
        type="button" aria-label="Next"
        disabled={index + 1 === itemsCount}
        onClick={() => { if (index < itemsCount - 1) setIndex(index + 1); }}
        style={{
          pointerEvents: "auto",
          background: "rgba(3,3,3,0.7)",
          border: `1px solid ${C.goldLine}`,
          borderRadius: "50%",
          padding: 12,
          opacity: alwaysShow ? 1 : 0,
          transition: "all 0.4s",
          cursor: index + 1 === itemsCount ? "not-allowed" : "pointer",
        }}
        className="group-hover/hover:opacity-100 disabled:opacity-30"
      >
        <ChevronRight size={18} style={{ color: C.gold }} />
      </button>
    </div>
  );
}

function CarouselIndicator() {
  const { index, itemsCount, setIndex } = useCarousel();
  return (
    <div className="absolute bottom-0 z-10 flex w-full items-center justify-center">
      <div className="flex space-x-2">
        {Array.from({ length: itemsCount }, (_, i) => (
          <button
            key={i} type="button" aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            style={{
              width: 6, height: 6, borderRadius: 100,
              background: index === i ? C.gold : "rgba(160,140,91,0.2)",
              border: "none", cursor: "pointer",
              transition: "all 0.4s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// UTILITIES
// ============================================
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function FadeIn({ children, delay = 0, y = 40 }: { children: ReactNode; delay?: number; y?: number }) {
  const [ref, inView] = useInView(0.12);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0) scale(1)" : `translateY(${y}px) scale(0.98)`,
      transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <FadeIn>
      <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>{children}</span>
      <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 20, marginBottom: "clamp(60px, 7vw, 100px)" }} />
    </FadeIn>
  );
}

// ============================================
// NAV HEADER (componente Bosco existente — animated cursor pill)
// ============================================
function NavHeader() {
  const [cursor, setCursor] = useState({ left: 0, width: 0, opacity: 0 });
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const tabs = [
    { label: "Destinos", href: "#destinos" },
    { label: "Activos", href: "#activos" },
    { label: "Vender", href: "#vender" },
    { label: "La Firma", href: "#firma" },
    { label: "Contacto", href: "#contacto" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: scrolled ? "14px 4vw" : "24px 4vw",
      background: scrolled ? "rgba(3,3,3,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(24px) saturate(1.2)" : "none",
      borderBottom: scrolled ? `1px solid ${C.blackBorder}` : "1px solid transparent",
      transition: "all 0.7s cubic-bezier(0.25,0.1,0.25,1)",
    }}>
      <a href="#" style={{ fontFamily: HEADING, fontSize: 14, letterSpacing: "0.22em", color: C.white, textDecoration: "none", fontWeight: 400 }}>
        JAVIER BOSCO
      </a>
      <ul style={{
        position: "relative", display: "flex", listStyle: "none", margin: 0, padding: "4px",
        borderRadius: 100, border: `1px solid ${C.blackBorder}`, background: "rgba(3,3,3,0.5)",
      }} onMouseLeave={() => setCursor(p => ({ ...p, opacity: 0 }))}>
        {tabs.map(t => <NavTab key={t.label} href={t.href} setCursor={setCursor}>{t.label}</NavTab>)}
        <li style={{
          position: "absolute", top: 4, height: "calc(100% - 8px)", borderRadius: 100, background: C.gold,
          left: cursor.left, width: cursor.width, opacity: cursor.opacity,
          transition: "all 0.35s cubic-bezier(0.25,0.1,0.25,1)", pointerEvents: "none", zIndex: 0,
        }} />
      </ul>
      <a href="tel:+34600000000" style={{
        fontFamily: UI, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
        color: C.grey, textDecoration: "none", transition: "color 0.4s",
      }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.grey)}
      >
        +34 · Contactar
      </a>
    </nav>
  );
}

function NavTab({ children, href, setCursor }: { children: ReactNode; href: string; setCursor: (c: any) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li ref={ref} onMouseEnter={() => {
      if (!ref.current) return;
      const { width } = ref.current.getBoundingClientRect();
      setCursor({ width, opacity: 1, left: ref.current.offsetLeft });
    }} style={{ position: "relative", zIndex: 1 }}>
      <a href={href} style={{
        display: "block", padding: "10px 22px", fontFamily: UI, fontSize: 10, letterSpacing: "0.14em",
        textTransform: "uppercase", color: C.white, textDecoration: "none", mixBlendMode: "difference",
        cursor: "pointer", whiteSpace: "nowrap",
      }}>{children}</a>
    </li>
  );
}

// ============================================
// LIQUID GLASS BUTTON (componente Bosco existente)
// ============================================
function LiquidButton({ children, href = "#", onClick, variant = "outline", size = "md" }: {
  children: ReactNode; href?: string; onClick?: () => void; variant?: "outline" | "solid"; size?: "sm" | "md" | "lg";
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const Tag = (onClick ? "button" : "a") as any;

  const sizes = {
    sm: { padding: "12px 32px", fontSize: 9 },
    md: { padding: "18px 52px", fontSize: 11 },
    lg: { padding: "22px 64px", fontSize: 12 },
  };

  const isSolid = variant === "solid";

  return (
    <Tag href={onClick ? undefined : href} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      style={{
        position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: sizes[size].padding, fontFamily: UI, fontSize: sizes[size].fontSize, letterSpacing: "0.22em",
        textTransform: "uppercase", textDecoration: "none", cursor: "pointer",
        borderRadius: 100, overflow: "hidden",
        color: isSolid ? (hover ? C.gold : C.black) : (hover ? C.black : C.gold),
        border: `1px solid ${hover ? C.gold : C.goldLine}`,
        background: isSolid ? (hover ? "transparent" : C.gold) : (hover ? C.gold : "transparent"),
        transform: pressed ? "scale(0.97)" : "scale(1)",
        boxShadow: hover ? `0 0 30px ${C.goldDim}, inset 0 1px 0 rgba(255,255,255,0.15)` : `inset 0 1px 0 rgba(255,255,255,0.05)`,
        transition: "all 0.5s cubic-bezier(0.25,0.1,0.25,1)", fontWeight: 500,
      }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "inherit",
        background: hover ? "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)" : "none",
        pointerEvents: "none", transition: "all 0.5s",
      }} />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </Tag>
  );
}

// ============================================
// INVESTMENT SLIDER (componente Bosco existente)
// ============================================
function InvestmentSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ticks = [
    { val: 0, label: "<1M€" },
    { val: 1, label: "1-5M€" },
    { val: 2, label: "5-10M€" },
    { val: 3, label: "10-20M€" },
    { val: 4, label: "20-50M€" },
    { val: 5, label: "50-100M€" },
    { val: 6, label: "100M€+" },
  ];
  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "relative", height: 40, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", width: "100%", height: 3, background: C.blackBorder, borderRadius: 2 }} />
        <div style={{ position: "absolute", width: `${(value / 6) * 100}%`, height: 3, background: C.gold, borderRadius: 2, transition: "width 0.2s" }} />
        <input type="range" min={0} max={6} step={1} value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          style={{ position: "absolute", width: "100%", height: 40, appearance: "none", background: "transparent", cursor: "pointer", zIndex: 2, outline: "none" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        {ticks.map(t => (
          <span key={t.val} style={{
            fontFamily: UI, fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase",
            color: value >= t.val ? C.gold : C.greyDark, transition: "color 0.3s", textAlign: "center", flex: 1,
          }}>{t.label}</span>
        ))}
      </div>
    </div>
  );
}

// ============================================
// HERO CON COMMAND PALETTE SEARCH (Kretz-style refinado)
// ============================================
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sliderVal, setSliderVal] = useState(3);
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);

  const a = (d: number) => ({ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(35px)", transition: `all 1.4s cubic-bezier(0.16,1,0.3,1) ${d}s` });

  return (
    <section style={{ height: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <SmokeCanvas color={[0.25, 0.22, 0.14]} intensity={1.0} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 45%, transparent 0%, rgba(3,3,3,0.65) 100%)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 900, width: "100%" }}>
        <div style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.4em", color: C.greyDark, textTransform: "uppercase", marginBottom: 32, ...a(0.4) }}>
          Off-Market Real Estate · Madrid · International
        </div>

        {/* Logo */}
        <div style={{ marginBottom: 36, ...a(0.6) }}>
          <img src="/logo.png" alt="Javier Bosco Properties"
            style={{
              maxWidth: "clamp(340px, 50vw, 580px)", height: "auto", margin: "0 auto", display: "block",
              filter: "drop-shadow(0 0 60px rgba(160,140,91,0.25))",
            }} />
        </div>

        {/* Gold line */}
        <div style={{ width: loaded ? 56 : 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "0 auto 32px", transition: "width 2s cubic-bezier(0.16,1,0.3,1) 1.2s" }} />

        {/* Tagline */}
        <div style={{ fontFamily: HEADING, fontSize: "clamp(18px, 2.2vw, 26px)", color: C.gold, letterSpacing: "0.1em", fontStyle: "italic", fontWeight: 400, marginBottom: 44, ...a(1.0) }}>
          Off-market. On-point.
        </div>

        {/* Search command palette */}
        <div style={a(1.3)}>
          <SearchPalette open={searchOpen} setOpen={setSearchOpen} sliderVal={sliderVal} setSliderVal={setSliderVal} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: loaded ? 0.4 : 0, transition: "opacity 1.5s ease 3s" }}>
        <span style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.35em", color: C.greyDark, textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: 1, height: 32, background: C.blackBorder, position: "relative", overflow: "hidden" }}>
          <div style={{ width: 1, height: 16, background: C.gold, animation: "scrollDown 2.2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

// ============================================
// SEARCH COMMAND PALETTE (refinamiento del buscador Kretz)
// ============================================
function SearchPalette({ open, setOpen, sliderVal, setSliderVal }: { open: boolean; setOpen: (v: boolean) => void; sliderVal: number; setSliderVal: (v: number) => void; }) {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 16,
            padding: "20px 28px",
            background: "rgba(10,10,10,0.6)", backdropFilter: "blur(20px)",
            border: `1px solid ${C.goldLine}`, borderRadius: 100,
            cursor: "pointer", transition: "all 0.5s", color: C.grey,
            fontFamily: BODY, fontSize: 17, letterSpacing: "0.03em", fontStyle: "italic",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = "rgba(10,10,10,0.85)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.goldLine; e.currentTarget.style.background = "rgba(10,10,10,0.6)"; }}
        >
          <Search size={16} style={{ color: C.gold, flexShrink: 0 }} />
          <span style={{ flex: 1, textAlign: "left" }}>¿Qué tipo de operación busca?</span>
          <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase" }}>Explorar</span>
        </button>
      ) : (
        <SearchExpanded close={() => setOpen(false)} sliderVal={sliderVal} setSliderVal={setSliderVal} />
      )}
    </div>
  );
}

function SearchExpanded({ close, sliderVal, setSliderVal }: { close: () => void; sliderVal: number; setSliderVal: (v: number) => void }) {
  const [tab, setTab] = useState<"comprar" | "vender">("comprar");
  const [location, setLocation] = useState("");
  const [assetType, setAssetType] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "rgba(8,8,8,0.92)", backdropFilter: "blur(24px)",
        border: `1px solid ${C.goldLine}`, borderRadius: 24,
        padding: "32px 28px", textAlign: "left",
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, borderBottom: `1px solid ${C.blackBorder}`, paddingBottom: 16 }}>
        {(["comprar", "vender"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            fontFamily: UI, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
            color: tab === t ? C.gold : C.greyDark,
            background: "transparent", border: "none", cursor: "pointer",
            padding: "8px 16px", transition: "color 0.4s",
          }}>{t}</button>
        ))}
        <button onClick={close} style={{
          marginLeft: "auto", fontFamily: UI, fontSize: 10, color: C.greyDark,
          background: "transparent", border: "none", cursor: "pointer",
        }}>×</button>
      </div>

      {/* Fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div>
          <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Ubicación</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.blackBorder}`, paddingBottom: 10 }}>
            <MapPin size={14} style={{ color: C.gold }} />
            <input value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder="Madrid, España, Europa…"
              style={{
                background: "transparent", border: "none", outline: "none", flex: 1,
                color: C.white, fontFamily: BODY, fontSize: 15, fontStyle: location ? "normal" : "italic",
                letterSpacing: "0.03em",
              }}
            />
          </div>
        </div>
        <div>
          <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Tipo de activo</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.blackBorder}`, paddingBottom: 10 }}>
            <Home size={14} style={{ color: C.gold }} />
            <select value={assetType} onChange={(e) => setAssetType(e.target.value)}
              style={{
                background: "transparent", border: "none", outline: "none", flex: 1,
                color: C.white, fontFamily: BODY, fontSize: 15, cursor: "pointer",
                appearance: "none", letterSpacing: "0.03em",
              }}
            >
              <option value="" style={{ background: C.black }}>Seleccionar…</option>
              <option value="edificio" style={{ background: C.black }}>Edificio</option>
              <option value="hotel" style={{ background: C.black }}>Hotel / Hospitality</option>
              <option value="residencial" style={{ background: C.black }}>Residencial de lujo</option>
              <option value="terreno" style={{ background: C.black }}>Terreno</option>
              <option value="singular" style={{ background: C.black }}>Activo singular</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Rango de inversión</label>
        <InvestmentSlider value={sliderVal} onChange={setSliderVal} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LiquidButton href="#contacto" variant="solid" size="md">Acceder</LiquidButton>
      </div>
    </motion.div>
  );
}

// ============================================
// ABOUT SECTION — Split 2 columnas estilo Kretz
// ============================================
function About() {
  return (
    <section style={{ padding: "clamp(120px, 14vw, 220px) 6vw", background: C.black, position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(60px, 8vw, 140px)", alignItems: "center" }}>
          <FadeIn>
            <div>
              <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>La firma</span>
              <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 20, marginBottom: 44 }} />
              <h2 style={{
                fontFamily: HEADING, fontSize: "clamp(32px, 4vw, 58px)", fontWeight: 400,
                color: C.white, lineHeight: 1.15, marginBottom: 44, letterSpacing: "0.01em",
              }}>
                Intermediación en <span style={{ color: C.gold, fontStyle: "italic" }}>operaciones que no se anuncian</span>.
              </h2>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <LiquidButton href="#firma">Conocer la firma</LiquidButton>
                <LiquidButton href="#vender">Solicitar valoración</LiquidButton>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ position: "relative" }}>
              <p style={{
                fontFamily: BODY, fontSize: "clamp(16px, 1.3vw, 20px)",
                color: C.grey, lineHeight: 2, letterSpacing: "0.03em",
                fontWeight: 300, marginBottom: 40,
              }}>
                Edificios completos, hoteles, residencial de lujo, terrenos estratégicos y
                activos singulares. Acceso directo a oportunidades que se mueven entre
                profesionales antes de existir en ningún portal público.
              </p>
              <div style={{
                fontFamily: HEADING, fontSize: "clamp(72px, 11vw, 160px)",
                color: C.goldLine, fontWeight: 400, letterSpacing: "0.02em",
                lineHeight: 0.88, fontStyle: "italic",
                opacity: 0.4,
              }}>
                BOSCO
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ============================================
// PROPIEDADES DESTACADAS (carrusel 21st.dev)
// ============================================
const PROPERTIES = [
  { image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop&q=80", tag: "Madrid · El Viso", title: "Residencia Clásica", price: "7.200.000 €", meta: "420 m² · 5 hab" },
  { image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=600&fit=crop&q=80", tag: "Madrid · Castellana", title: "Edificio Corporativo", price: "42.000.000 €", meta: "8.200 m² · Oficinas" },
  { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop&q=80", tag: "Madrid · La Moraleja", title: "Chalet Exclusivo", price: "4.500.000 €", meta: "680 m² · Parcela 2.400 m²" },
  { image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=600&fit=crop&q=80", tag: "Portfolio · Hospitality", title: "Cadena Hotelera Mediterráneo", price: "Precio bajo consulta", meta: "12 establecimientos · 200M€" },
  { image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=900&h=600&fit=crop&q=80", tag: "Madrid · Salamanca", title: "Palacete del XIX", price: "14.000.000 €", meta: "Activo singular · 1.200 m²" },
  { image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&h=600&fit=crop&q=80", tag: "Francia · Riviera", title: "Villa en la Costa Azul", price: "18.000.000 €", meta: "Residencial · 950 m²" },
];

function PropiedadesDestacadas() {
  return (
    <section id="activos" style={{ padding: "clamp(120px, 14vw, 220px) 0", background: C.blackDeep, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />

      <div style={{ padding: "0 6vw", maxWidth: 1600, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ marginBottom: "clamp(50px, 6vw, 90px)" }}>
            <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>Selección actual</span>
            <h2 style={{
              fontFamily: HEADING, fontSize: "clamp(44px, 7vw, 120px)", fontWeight: 400,
              color: C.white, letterSpacing: "0.01em", lineHeight: 1, marginTop: 20,
            }}>
              Activos Destacados
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Carousel className="w-full">
            <CarouselContent>
              {PROPERTIES.map((p, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 px-3">
                  <PropertyCard property={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNavigation alwaysShow />
          </Carousel>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p style={{
            textAlign: "center", marginTop: 60,
            fontFamily: BODY, fontSize: 15, color: C.greyDark,
            letterSpacing: "0.04em", fontStyle: "italic", fontWeight: 300,
          }}>
            Esta es la selección que podemos mostrar. Las operaciones que no aparecen aquí requieren una conversación.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function PropertyCard({ property }: { property: typeof PROPERTIES[0] }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", overflow: "hidden", borderRadius: 2,
        cursor: "pointer", transition: "all 0.6s",
      }}
    >
      {/* Image */}
      <div style={{ width: "100%", height: 460, overflow: "hidden", background: C.blackBorder }}>
        <img src={property.image} alt={property.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hover ? "scale(1.05)" : "scale(1)",
            filter: hover ? "brightness(0.75)" : "brightness(0.85)",
            transition: "all 0.9s cubic-bezier(0.25,0.1,0.25,1)",
          }}
        />
        {/* Watermark JB */}
        <div style={{
          position: "absolute", top: 20, right: 20,
          fontFamily: HEADING, fontSize: 14, letterSpacing: "0.25em",
          color: "rgba(245,242,235,0.5)", textTransform: "uppercase",
        }}>JB</div>
        {/* Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(3,3,3,0.95) 0%, transparent 55%)",
        }} />
      </div>

      {/* Info */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px",
      }}>
        <div style={{
          fontFamily: UI, fontSize: 9, letterSpacing: "0.3em",
          color: C.gold, textTransform: "uppercase", marginBottom: 10,
        }}>{property.tag}</div>
        <div style={{
          fontFamily: HEADING, fontSize: 22, fontWeight: 400,
          color: C.white, letterSpacing: "0.01em", marginBottom: 8,
        }}>{property.title}</div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          borderTop: `1px solid ${hover ? C.goldLine : "rgba(255,255,255,0.1)"}`,
          paddingTop: 14, marginTop: 14, transition: "border-color 0.5s",
        }}>
          <span style={{ fontFamily: BODY, fontSize: 14, color: C.whiteDim, fontWeight: 300, letterSpacing: "0.02em" }}>
            {property.meta}
          </span>
          <span style={{ fontFamily: HEADING, fontSize: 18, color: C.gold, letterSpacing: "0.01em" }}>
            {property.price}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DESTINOS (carrusel Kretz-style)
// ============================================
const DESTINATIONS = [
  { image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&h=1000&fit=crop&q=80", name: "MADRID" },
  { image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=1000&fit=crop&q=80", name: "BARCELONA" },
  { image: "https://images.unsplash.com/photo-1611029473595-e9a54c4c0f45?w=800&h=1000&fit=crop&q=80", name: "MARBELLA" },
  { image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=1000&fit=crop&q=80", name: "PARÍS" },
  { image: "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=800&h=1000&fit=crop&q=80", name: "GSTAAD" },
  { image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&h=1000&fit=crop&q=80", name: "LONDRES" },
];

function Destinos() {
  return (
    <section id="destinos" style={{ padding: "clamp(120px, 14vw, 220px) 0", background: C.black, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />

      <div style={{ padding: "0 6vw", maxWidth: 1600, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(50px, 6vw, 90px)", flexWrap: "wrap", gap: 20 }}>
            <div>
              <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>Destinos</span>
              <h2 style={{
                fontFamily: HEADING, fontSize: "clamp(36px, 5vw, 80px)", fontWeight: 400,
                color: C.white, letterSpacing: "0.01em", lineHeight: 1, marginTop: 20,
              }}>
                Presencia global, <span style={{ fontStyle: "italic", color: C.gold }}>cierre local</span>.
              </h2>
            </div>
            <p style={{
              fontFamily: BODY, fontSize: 16, color: C.grey,
              maxWidth: 340, lineHeight: 1.9, fontWeight: 300, letterSpacing: "0.03em",
            }}>
              Foco principal en Madrid, con operaciones activas en toda España, Europa y mercados internacionales cuando la operación lo requiere.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Carousel>
            <CarouselContent>
              {DESTINATIONS.map((d, i) => (
                <CarouselItem key={i} className="md:basis-1/3 lg:basis-1/4 px-2">
                  <DestinationCard destination={d} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNavigation alwaysShow />
          </Carousel>
        </FadeIn>
      </div>
    </section>
  );
}

function DestinationCard({ destination }: { destination: typeof DESTINATIONS[0] }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", aspectRatio: "3/4", overflow: "hidden", borderRadius: 2,
        cursor: "pointer",
      }}
    >
      <img src={destination.image} alt={destination.name}
        style={{
          width: "100%", height: "100%", objectFit: "cover", display: "block",
          filter: hover ? "grayscale(0) brightness(0.7)" : "grayscale(0.4) brightness(0.55)",
          transform: hover ? "scale(1.05)" : "scale(1)",
          transition: "all 0.9s cubic-bezier(0.25,0.1,0.25,1)",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, transparent 60%, rgba(3,3,3,0.92) 100%)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 24px",
      }}>
        <div style={{
          fontFamily: HEADING, fontSize: "clamp(22px, 2vw, 32px)",
          color: C.white, letterSpacing: "0.12em", fontWeight: 400,
        }}>{destination.name}</div>
      </div>
    </div>
  );
}

// ============================================
// TIPOS DE ACTIVO
// ============================================
const ASSET_TYPES = [
  { image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=1000&fit=crop&q=80", name: "Edificios", desc: "Residenciales, corporativos, mixtos" },
  { image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1000&fit=crop&q=80", name: "Hospitality", desc: "Hoteles y cadenas hoteleras" },
  { image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=1000&fit=crop&q=80", name: "Residencial", desc: "Alto standing y ultra-lujo" },
  { image: "https://images.unsplash.com/photo-1464938050520-ef2571e0d6e0?w=800&h=1000&fit=crop&q=80", name: "Terrenos", desc: "Solares estratégicos" },
  { image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&h=1000&fit=crop&q=80", name: "Singulares", desc: "Palacios y activos únicos" },
];

function TiposActivo() {
  return (
    <section style={{ padding: "clamp(120px, 14vw, 200px) 0", background: C.blackDeep, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />

      <div style={{ padding: "0 6vw", maxWidth: 1600, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ marginBottom: "clamp(50px, 6vw, 90px)" }}>
            <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>Tipologías</span>
            <h2 style={{
              fontFamily: HEADING, fontSize: "clamp(36px, 5vw, 80px)", fontWeight: 400,
              color: C.white, letterSpacing: "0.01em", lineHeight: 1, marginTop: 20,
            }}>
              Qué <span style={{ fontStyle: "italic", color: C.gold }}>gestionamos</span>.
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Carousel>
            <CarouselContent>
              {ASSET_TYPES.map((a, i) => (
                <CarouselItem key={i} className="md:basis-1/3 lg:basis-1/4 px-2">
                  <AssetTypeCard asset={a} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNavigation alwaysShow />
          </Carousel>
        </FadeIn>
      </div>
    </section>
  );
}

function AssetTypeCard({ asset }: { asset: typeof ASSET_TYPES[0] }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", aspectRatio: "3/4", overflow: "hidden", borderRadius: 2,
        cursor: "pointer",
      }}
    >
      <img src={asset.image} alt={asset.name}
        style={{
          width: "100%", height: "100%", objectFit: "cover", display: "block",
          filter: hover ? "brightness(0.7)" : "brightness(0.55)",
          transform: hover ? "scale(1.04)" : "scale(1)",
          transition: "all 0.9s cubic-bezier(0.25,0.1,0.25,1)",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, transparent 40%, rgba(3,3,3,0.92) 100%)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 24px",
      }}>
        <div style={{
          fontFamily: HEADING, fontSize: "clamp(24px, 2.2vw, 34px)",
          color: C.white, letterSpacing: "0.02em", fontWeight: 400, marginBottom: 8,
        }}>{asset.name}</div>
        <div style={{
          fontFamily: BODY, fontSize: 14, color: C.gold,
          letterSpacing: "0.03em", fontStyle: "italic", fontWeight: 300,
        }}>{asset.desc}</div>
      </div>
    </div>
  );
}

// ============================================
// VENDER CON BOSCO (con smoke)
// ============================================
function Vender() {
  const [address, setAddress] = useState("");
  return (
    <section id="vender" style={{ position: "relative", minHeight: "80vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <SmokeCanvas color={[0.2, 0.18, 0.12]} intensity={0.55} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 0%, rgba(3,3,3,0.82) 100%)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", width: "100%", padding: "clamp(100px, 12vw, 180px) 6vw", textAlign: "center" }}>
        <FadeIn>
          <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>Vender</span>
          <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "20px auto 40px" }} />
        </FadeIn>

        <FadeIn delay={0.15}>
          <h2 style={{
            fontFamily: HEADING, fontSize: "clamp(38px, 5vw, 72px)", fontWeight: 400,
            color: C.white, lineHeight: 1.1, marginBottom: 28, maxWidth: 800, marginLeft: "auto", marginRight: "auto",
            letterSpacing: "0.01em",
          }}>
            Su activo <span style={{ color: C.gold, fontStyle: "italic" }}>merece discreción</span>.
          </h2>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p style={{
            fontFamily: BODY, fontSize: "clamp(16px, 1.3vw, 20px)",
            color: C.grey, lineHeight: 1.9, maxWidth: 620, margin: "0 auto 60px",
            letterSpacing: "0.03em", fontWeight: 300,
          }}>
            Valoración profesional y comercialización privada. Sin anuncios, sin portales, sin exposición pública.
            Solo compradores cualificados bajo acuerdo de confidencialidad.
          </p>
        </FadeIn>

        <FadeIn delay={0.45}>
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            maxWidth: 640, margin: "0 auto 32px", flexWrap: "wrap",
          }}>
            <div style={{
              flex: 1, minWidth: 280, display: "flex", alignItems: "center", gap: 12,
              padding: "18px 24px", background: "rgba(10,10,10,0.7)", backdropFilter: "blur(20px)",
              border: `1px solid ${C.goldLine}`, borderRadius: 100,
            }}>
              <MapPin size={14} style={{ color: C.gold, flexShrink: 0 }} />
              <input value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección o zona del activo"
                style={{
                  background: "transparent", border: "none", outline: "none", flex: 1,
                  color: C.white, fontFamily: BODY, fontSize: 15,
                  letterSpacing: "0.03em", fontStyle: address ? "normal" : "italic",
                }}
              />
            </div>
            <LiquidButton href="#contacto" variant="solid">Solicitar valoración</LiquidButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================
// LA FIRMA (credibilidad sin inventar datos)
// ============================================
function LaFirma() {
  return (
    <section id="firma" style={{ padding: "clamp(120px, 14vw, 220px) 6vw", background: C.black, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "clamp(60px, 8vw, 140px)", alignItems: "start" }}>
          <FadeIn>
            <div>
              <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>La firma</span>
              <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 20, marginBottom: 40 }} />
              <h2 style={{
                fontFamily: HEADING, fontSize: "clamp(32px, 3.6vw, 52px)", fontWeight: 400,
                color: C.white, lineHeight: 1.15, marginBottom: 36, letterSpacing: "0.01em",
              }}>
                Javier Bosco<br />
                <span style={{ color: C.gold, fontStyle: "italic", fontSize: "0.7em" }}>Fundador</span>
              </h2>
              <p style={{
                fontFamily: BODY, fontSize: "clamp(16px, 1.2vw, 19px)",
                color: C.grey, lineHeight: 1.95, letterSpacing: "0.03em", fontWeight: 300,
              }}>
                Intermediario inmobiliario independiente especializado en operaciones off-market de alto valor.
                Conecta compradores e inversores con activos que no están públicamente disponibles, gestionando cada operación
                con discreción absoluta.
              </p>
            </div>
          </FadeIn>

          <div>
            <FadeIn delay={0.2}>
              <div style={{
                borderLeft: `1px solid ${C.goldLine}`, paddingLeft: "clamp(24px, 3vw, 48px)",
                marginBottom: "clamp(50px, 5vw, 80px)",
              }}>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", marginBottom: 18 }}>
                  Feedback real de clientes
                </div>
                <div style={{
                  fontFamily: HEADING, fontSize: "clamp(22px, 2vw, 32px)",
                  color: C.whiteDim, fontStyle: "italic", lineHeight: 1.55, letterSpacing: "0.02em", fontWeight: 400,
                }}>
                  "Accede a operaciones que no están en el mercado."
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div style={{ borderLeft: `1px solid ${C.blackBorder}`, paddingLeft: "clamp(24px, 3vw, 48px)", marginBottom: 40 }}>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", marginBottom: 14 }}>Cómo trabajamos</div>
                <div style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.15vw, 17px)", color: C.grey, lineHeight: 1.95, fontWeight: 300 }}>
                  Cada operación comienza con una conversación privada. Sin formularios de captación masiva,
                  sin seguimientos comerciales automatizados. Solo interés real, oportunidad real y cierre real.
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div style={{ borderLeft: `1px solid ${C.blackBorder}`, paddingLeft: "clamp(24px, 3vw, 48px)" }}>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", marginBottom: 14 }}>Qué no hacemos</div>
                <div style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.15vw, 17px)", color: C.grey, lineHeight: 1.95, fontWeight: 300 }}>
                  No trabajamos con residencial estándar, operaciones pequeñas ni producto sin componente estratégico.
                  Cada operación se selecciona.
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CONTACTO FINAL
// ============================================
function Contacto() {
  const [focused, setFocused] = useState<string | null>(null);
  const inputStyle = (field: string) => ({
    background: "transparent", border: "none",
    borderBottom: `1px solid ${focused === field ? C.gold : C.blackBorder}`,
    color: C.white, fontFamily: BODY, fontSize: "clamp(15px, 1.2vw, 18px)",
    padding: "16px 0", outline: "none", width: "100%",
    letterSpacing: "0.04em", transition: "border-color 0.5s", fontWeight: 300,
  });
  return (
    <section id="contacto" style={{ padding: "clamp(100px, 12vw, 180px) 6vw", background: C.blackDeep, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(60px, 8vw, 140px)", alignItems: "start" }}>
          <div>
            <FadeIn>
              <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>Iniciar conversación</span>
              <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 20, marginBottom: 44 }} />
              <h2 style={{
                fontFamily: HEADING, fontSize: "clamp(34px, 3.8vw, 56px)", fontWeight: 400,
                color: C.white, lineHeight: 1.1, marginBottom: 32, letterSpacing: "0.01em",
              }}>
                El primer paso es<br /><span style={{ color: C.gold, fontStyle: "italic" }}>una llamada</span>.
              </h2>
              <p style={{
                fontFamily: BODY, fontSize: "clamp(16px, 1.2vw, 19px)",
                color: C.grey, lineHeight: 1.95, maxWidth: 420, letterSpacing: "0.03em", fontWeight: 300,
              }}>
                Cada solicitud se revisa personalmente. Si el perfil encaja con alguna operación en curso o en desarrollo,
                el contacto posterior es directo.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div style={{ marginTop: 56 }}>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", marginBottom: 12 }}>Línea directa</div>
                <a href="mailto:javierbosco@javierbosco.com" style={{
                  fontFamily: BODY, fontSize: 17, color: C.grey, textDecoration: "none",
                  letterSpacing: "0.05em", transition: "color 0.5s", fontWeight: 300,
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.grey)}
                >
                  javierbosco@javierbosco.com
                </a>
              </div>
            </FadeIn>
          </div>

          <div style={{ paddingTop: "clamp(20px, 4vw, 60px)" }}>
            <FadeIn delay={0.2}>
              <div style={{ marginBottom: 36 }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Nombre</label>
                <input style={inputStyle("name")} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div style={{ marginBottom: 36 }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email</label>
                <input type="email" style={inputStyle("email")} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div style={{ marginBottom: 36 }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Teléfono</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <input style={{ ...inputStyle("prefix"), width: 80, textAlign: "center" }} defaultValue="+34" onFocus={() => setFocused("prefix")} onBlur={() => setFocused(null)} />
                  <input type="tel" style={inputStyle("phone")} onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.5}>
              <div style={{ marginTop: 44 }}>
                <LiquidButton href="#" variant="solid">Enviar solicitud</LiquidButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER (estructurado tipo Kretz)
// ============================================
function Footer() {
  return (
    <footer style={{ background: C.black, borderTop: `1px solid ${C.blackBorder}`, padding: "60px 6vw 30px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 40,
          paddingBottom: 50, borderBottom: `1px solid ${C.blackBorder}`,
        }}>
          <div>
            <div style={{ fontFamily: HEADING, fontSize: 18, letterSpacing: "0.2em", color: C.white, marginBottom: 16 }}>
              JAVIER BOSCO
            </div>
            <div style={{ fontFamily: HEADING, fontSize: 12, letterSpacing: "0.05em", color: C.gold, fontStyle: "italic", marginBottom: 24 }}>
              Off-market. On-point.
            </div>
            <div style={{ fontFamily: BODY, fontSize: 14, color: C.grey, lineHeight: 1.8, fontWeight: 300, maxWidth: 260 }}>
              Intermediación en operaciones inmobiliarias off-market de alto valor. Madrid, España e internacional.
            </div>
          </div>

          <FooterColumn title="Destinos" items={["Madrid", "España", "Europa", "Internacional"]} />
          <FooterColumn title="Activos" items={["Edificios", "Hospitality", "Residencial", "Terrenos", "Singulares"]} />
          <FooterColumn title="La firma" items={["Filosofía", "Vender", "Valorar", "Contacto"]} />
          <div>
            <div style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.25em", color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>Social</div>
            <a href="https://www.instagram.com/javierboscoproperties/" target="_blank" rel="noopener noreferrer" style={{
              display: "block", fontFamily: BODY, fontSize: 14, color: C.grey, textDecoration: "none",
              letterSpacing: "0.04em", marginBottom: 10, transition: "color 0.4s", fontWeight: 300,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.grey)}
            >Instagram</a>
            <a href="mailto:javierbosco@javierbosco.com" style={{
              display: "block", fontFamily: BODY, fontSize: 14, color: C.grey, textDecoration: "none",
              letterSpacing: "0.04em", transition: "color 0.4s", fontWeight: 300,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.grey)}
            >Email</a>
          </div>
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 24, flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase" }}>
            © 2026 Javier Bosco Properties
          </span>
          <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase" }}>
            Madrid · España
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.25em", color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>{title}</div>
      {items.map(it => (
        <a key={it} href="#" style={{
          display: "block", fontFamily: BODY, fontSize: 14, color: C.grey, textDecoration: "none",
          letterSpacing: "0.04em", marginBottom: 10, transition: "color 0.4s", fontWeight: 300,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.grey)}
        >{it}</a>
      ))}
    </div>
  );
}

// ============================================
// MAIN
// ============================================
export default function JavierBoscoLanding() {
  return (
    <div style={{ background: C.black, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030303; overflow-x: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background: rgba(160,140,91,0.12); color: #F5F2EB; }
        ::placeholder { color: #4A453E; font-style: italic; }
        html { scroll-behavior: smooth; }
        @keyframes scrollDown { 0% { transform: translateY(-16px); opacity: 0; } 40% { opacity: 1; } 100% { transform: translateY(32px); opacity: 0; } }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: #A08C5B; border: 2px solid #F5F2EB;
          cursor: pointer; box-shadow: 0 0 12px rgba(160,140,91,0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%;
          background: #A08C5B; border: 2px solid #F5F2EB;
          cursor: pointer; box-shadow: 0 0 12px rgba(160,140,91,0.3);
        }
        @media (max-width: 900px) {
          nav > ul { display: none !important; }
          nav > a[href^="tel"] { display: none !important; }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1.2fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
      <NavHeader />
      <Hero />
      <About />
      <PropiedadesDestacadas />
      <Destinos />
      <TiposActivo />
      <Vender />
      <LaFirma />
      <Contacto />
      <Footer />
    </div>
  );
}
