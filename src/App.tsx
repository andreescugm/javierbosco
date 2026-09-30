import { useState, useEffect, useRef, createContext, useContext, useCallback, type ReactNode, type FormEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from "framer-motion";
import { Search, MapPin, Home, Plus, Minus, X, Menu } from "lucide-react";
import Lenis from "lenis";
import { CardStack } from "./components/CardStack";
import { T, LANG_OPTIONS, isLang, type Lang, type Dict, type AssetKey, type DestKey } from "./i18n";
import { LEGAL, EMAIL_PUBLICO, EMAIL_FORMULARIO, type LegalKey } from "./legal";

// ============================================
// PALETA — web en modo claro (crema + oro apagado).
// Nota: los nombres "black"/"white" son históricos: black = fondo claro, white = texto oscuro.
// ============================================
const C = {
  gold: "#A08C5B",
  goldText: "#6B5A2E",
  goldHover: "#BFA36D",
  goldDim: "rgba(160,140,91,0.12)",
  goldLine: "rgba(160,140,91,0.25)",
  black: "#F5F2EB",
  blackDeep: "#EAE7E0",
  blackBorder: "#D5D0C8",
  white: "#030303",
  whiteDim: "#C8C2B8",
  grey: "#585249",
  greyDark: "#504B44",
};

const HEADING = "'Playfair Display', 'Georgia', serif";
const BODY = "'Cormorant Garamond', 'Georgia', serif";
const UI = "'Inter', 'Helvetica Neue', sans-serif";
const ease = [0.25, 0.1, 0.25, 1] as const;
const easeOut = [0.16, 1, 0.3, 1] as const;
const VP = { once: true, amount: 0.15 } as const;

// Rango de inversión: único para toda la web (1M€ – 200M€).
const RANGES = ["1–5M€", "5–10M€", "10–20M€", "20–50M€", "50–100M€", "100–200M€"];

// ============================================
// CONTEXTOS: idioma + solicitud (lo que el visitante elige en el buscador / vender)
// ============================================
const LangContext = createContext<Lang>("es");
function useT(): Dict { return T[useContext(LangContext)]; }

type Lead = { operacion: "comprar" | "vender"; ubicacion?: string; tipo?: AssetKey | ""; rango?: string; direccion?: string } | null;
const LeadContext = createContext<{ lead: Lead; setLead: (l: Lead) => void }>({ lead: null, setLead: () => {} });

const LegalContext = createContext<(k: LegalKey) => void>(() => {});

// ============================================
// SCROLL (Lenis)
// ============================================
let lenisInstance: Lenis | null = null;
const NAV_OFFSET = -72;
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: NAV_OFFSET });
  else el.scrollIntoView({ behavior: "smooth" });
}
function scrollTop() {
  if (lenisInstance) lenisInstance.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

function useViewportWidth() {
  const [w, setW] = useState(() => (typeof window === "undefined" ? 1280 : window.innerWidth));
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ============================================
// HUMO (WebGL) — solo en el hero
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
  col.r-=fbm(uv+vec2(0,T*.012)+n)*.55;
  col.g-=fbm(uv*1.003+vec2(0,T*.012)+n+.003)*.55;
  col.b-=fbm(uv*1.006+vec2(0,T*.012)+n+.006)*.55;
  col=max(col,vec3(0.35));
  col=mix(col, u_color, dot(col,vec3(.21,.71,.07)));
  col=mix(vec3(.95),col,min(time*.5,1.)*u_intensity);
  col=clamp(col,.25,.98);
  O=vec4(col,1);
}`;

const HERO_SMOKE = { color: [0.75, 0.72, 0.65], base: [0.96, 0.94, 0.9], intensity: 0.4 } as const;

function SmokeCanvas() {
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
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
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
    // No renderizar cuando el hero no está en pantalla (ahorra batería/GPU)
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    let raf = 0;
    const { color, base, intensity } = HERO_SMOKE;
    const loop = (now: number) => {
      if (visible) {
        gl.clearColor(base[0], base[1], base[2], 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(prog);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, now * 1e-3);
        gl.uniform3f(uColor, color[0], color[1], color[2]);
        gl.uniform1f(uInt, intensity);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io.disconnect();
      gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}

// ============================================
// DRAG CAROUSEL — 1 elemento, swipe/arrastre
// ============================================
const slideVariants: Variants = {
  enter: (d: number) => ({ x: d * 200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: -d * 200, opacity: 0 }),
};
function DragCarousel<I>({ items, renderItem, prevLabel, nextLabel }: { items: I[]; renderItem: (item: I, i: number) => ReactNode; prevLabel: string; nextLabel: string }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const n = items.length;
  const go = (d: number) => { setDir(d); setIdx(i => (i + d + n) % n); };
  const btnBase = {
    background: "rgba(10,8,5,0.55)", border: `1px solid ${C.goldLine}`,
    borderRadius: "50%", width: 44, height: 44, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.4s",
  };
  return (
    <div style={{ position: "relative" }}>
      <div style={{ overflow: "hidden", touchAction: "pan-y" }}>
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={idx}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 || info.velocity.x < -400) go(1);
              else if (info.offset.x > 50 || info.velocity.x > 400) go(-1);
            }}
            style={{ cursor: "grab" }}
          >
            {renderItem(items[idx], idx)}
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ position: "absolute", top: "32%", left: 0, right: 0, transform: "translateY(-50%)", display: "flex", justifyContent: "space-between", padding: "0 16px", pointerEvents: "none" }}>
        {[{ d: -1, label: prevLabel, path: "M15 18l-6-6 6-6" }, { d: 1, label: nextLabel, path: "M9 18l6-6-6-6" }].map(b => (
          <button key={b.d} type="button" aria-label={b.label} onClick={() => go(b.d)}
            style={{ ...btnBase, pointerEvents: "auto" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = "rgba(10,8,5,0.75)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.goldLine; e.currentTarget.style.background = "rgba(10,8,5,0.55)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><path d={b.path} /></svg>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
        {items.map((_, i) => (
          <button key={i} type="button" aria-label={`${i + 1} / ${n}`} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
            style={{
              width: idx === i ? 24 : 6, height: 6, borderRadius: 3, border: "none", cursor: "pointer",
              background: idx === i ? C.gold : C.blackBorder, transition: "all 0.5s cubic-bezier(0.25,0.1,0.25,1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// FADE-IN
// ============================================
function FadeIn({ children, delay = 0, y = 30 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={VP} transition={{ duration: 1, delay, ease }}>
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.goldText, textTransform: "uppercase" }}>{children}</span>;
}
function GoldRule() {
  return <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 20, marginBottom: 44 }} />;
}
function SectionTopLine() {
  return <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />;
}

// ============================================
// NAV
// ============================================
function NavHeader({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const t = useT();
  const [cursor, setCursor] = useState({ left: 0, width: 0, opacity: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    if (menuOpen) lenisInstance?.stop(); else lenisInstance?.start();
  }, [menuOpen]);
  const tabs = [
    { label: t.nav.activos, id: "activos" },
    { label: t.nav.destinos, id: "destinos" },
    { label: t.nav.firma, id: "firma" },
    { label: t.nav.vender, id: "vender" },
    { label: t.nav.contacto, id: "contacto" },
  ];
  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
        padding: scrolled ? "14px 4vw" : "24px 4vw",
        background: scrolled || menuOpen ? "rgba(245,242,235,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(1.2)" : "none",
        borderBottom: scrolled ? `1px solid ${C.blackBorder}` : "1px solid transparent",
        transition: "all 0.7s cubic-bezier(0.25,0.1,0.25,1)",
      }}>
        <a href="#top" onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollTop(); }}
          style={{ fontFamily: HEADING, fontSize: 14, letterSpacing: "0.22em", color: C.white, textDecoration: "none", fontWeight: 400, whiteSpace: "nowrap" }}>
          JAVIER BOSCO
        </a>
        <ul className="nav-tabs" style={{
          position: "relative", display: "flex", listStyle: "none", margin: 0, padding: "4px",
          borderRadius: 100, border: `1px solid ${C.blackBorder}`, background: "rgba(200,195,185,0.3)",
        }} onMouseLeave={() => setCursor(p => ({ ...p, opacity: 0 }))}>
          {tabs.map(tab => <NavTab key={tab.id} id={tab.id} setCursor={setCursor}>{tab.label}</NavTab>)}
          <li aria-hidden="true" style={{
            position: "absolute", top: 4, height: "calc(100% - 8px)", borderRadius: 100, background: C.gold,
            left: cursor.left, width: cursor.width, opacity: cursor.opacity,
            transition: "all 0.35s cubic-bezier(0.25,0.1,0.25,1)", pointerEvents: "none", zIndex: 0,
          }} />
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <select
            aria-label="Idioma / Language"
            value={lang}
            onChange={(e) => { if (isLang(e.target.value)) setLang(e.target.value); }}
            style={{
              background: "#F5F2EB", border: `1px solid ${C.blackBorder}`, color: C.grey, fontFamily: UI, fontSize: 13,
              padding: "3px 6px", cursor: "pointer", borderRadius: 2, outline: "none", transition: "border-color 0.4s",
            }}
          >
            {LANG_OPTIONS.map(l => <option key={l.code} value={l.code} title={l.label}>{l.flag}</option>)}
          </select>
          <button type="button" className="nav-burger" aria-label={menuOpen ? t.nav.cerrar : t.nav.menu} aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: "transparent", border: `1px solid ${C.blackBorder}`, borderRadius: 2, width: 38, height: 32, alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.white }}>
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: C.black, display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px 8vw 60px" }}
          >
            {tabs.map((tab, i) => (
              <motion.a key={tab.id} href={`#${tab.id}`}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08 * i, ease }}
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); setTimeout(() => scrollToId(tab.id), 50); }}
                style={{ fontFamily: HEADING, fontSize: "clamp(30px, 8vw, 44px)", color: C.white, textDecoration: "none", padding: "12px 0", borderBottom: `1px solid ${C.blackBorder}` }}>
                {tab.label}
              </motion.a>
            ))}
            <div style={{ marginTop: 40, fontFamily: HEADING, fontStyle: "italic", color: C.gold, fontSize: 16 }}>{t.tagline}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
function NavTab({ children, id, setCursor }: { children: ReactNode; id: string; setCursor: (c: { left: number; width: number; opacity: number }) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li ref={ref} onMouseEnter={() => {
      if (!ref.current) return;
      setCursor({ width: ref.current.getBoundingClientRect().width, opacity: 1, left: ref.current.offsetLeft });
    }} style={{ position: "relative", zIndex: 1 }}>
      <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }} style={{
        display: "block", padding: "10px 20px", fontFamily: UI, fontSize: 10, letterSpacing: "0.14em",
        textTransform: "uppercase", color: C.white, textDecoration: "none", mixBlendMode: "difference", whiteSpace: "nowrap",
      }}>{children}</a>
    </li>
  );
}

// ============================================
// BOTÓN
// ============================================
function LiquidButton({ children, href, onClick, variant = "outline", size = "md", type, disabled }: {
  children: ReactNode; href?: string; onClick?: () => void; variant?: "outline" | "solid"; size?: "sm" | "md" | "lg";
  type?: "submit" | "button"; disabled?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const sizes = { sm: { padding: "12px 32px", fontSize: 9 }, md: { padding: "18px 52px", fontSize: 11 }, lg: { padding: "22px 64px", fontSize: 12 } };
  const isSolid = variant === "solid";
  const style = {
    position: "relative" as const, display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: sizes[size].padding, fontFamily: UI, fontSize: sizes[size].fontSize, letterSpacing: "0.22em",
    textTransform: "uppercase" as const, textDecoration: "none", cursor: disabled ? "wait" : "pointer",
    borderRadius: 100, overflow: "hidden", opacity: disabled ? 0.6 : 1,
    color: isSolid ? (hover ? C.gold : C.black) : (hover ? C.black : C.gold),
    border: `1px solid ${hover ? C.gold : C.goldLine}`,
    background: isSolid ? (hover ? "transparent" : C.gold) : (hover ? C.gold : "transparent"),
    transform: pressed ? "scale(0.97)" : "scale(1)",
    boxShadow: hover ? `0 0 30px ${C.goldDim}` : "none",
    transition: "all 0.5s cubic-bezier(0.25,0.1,0.25,1)", fontWeight: 500,
  };
  const handlers = {
    onMouseEnter: () => setHover(true), onMouseLeave: () => { setHover(false); setPressed(false); },
    onMouseDown: () => setPressed(true), onMouseUp: () => setPressed(false),
  };
  const inner = <span style={{ position: "relative", zIndex: 1 }}>{children}</span>;
  if (href) {
    return (
      <a href={href} style={style} {...handlers}
        onClick={(e) => {
          if (onClick) onClick();
          if (href.startsWith("#") && href.length > 1) { e.preventDefault(); scrollToId(href.slice(1)); }
        }}>{inner}</a>
    );
  }
  return <button type={type ?? "button"} onClick={onClick} disabled={disabled} style={style} {...handlers}>{inner}</button>;
}

// ============================================
// SLIDER DE INVERSIÓN
// ============================================
function InvestmentSlider({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const max = RANGES.length - 1;
  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "relative", height: 40, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", width: "100%", height: 3, background: C.blackBorder, borderRadius: 2 }} />
        <div style={{ position: "absolute", width: `${(value / max) * 100}%`, height: 3, background: C.gold, borderRadius: 2 }} />
        <input type="range" aria-label={label} aria-valuetext={RANGES[Math.round(value)]} min={0} max={max} step={0.01} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onPointerUp={() => onChange(Math.round(value))}
          style={{ position: "absolute", width: "100%", height: 40, appearance: "none", background: "transparent", cursor: "pointer", zIndex: 2, outline: "none" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        {RANGES.map((r, i) => (
          <span key={r} style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.06em", color: Math.round(value) === i ? C.goldText : C.greyDark, fontWeight: Math.round(value) === i ? 500 : 400, transition: "color 0.3s", textAlign: "center", flex: 1 }}>{r}</span>
        ))}
      </div>
    </div>
  );
}

// ============================================
// HERO
// ============================================
const heroContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } } };
const heroItem: Variants = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: easeOut } } };

function Hero() {
  const t = useT();
  const [searchOpen, setSearchOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smokeY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  return (
    <section id="top" ref={heroRef} style={{ minHeight: "100svh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "110px 0 90px" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <motion.div style={{ position: "absolute", inset: 0, y: smokeY }}>
          <SmokeCanvas />
        </motion.div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 45%, transparent 0%, rgba(255,255,255,0.65) 100%)", zIndex: 1 }} />
      <motion.div variants={heroContainer} initial="hidden" animate="visible"
        style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 900, width: "100%" }}>
        <motion.div variants={heroItem} style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.4em", color: C.greyDark, textTransform: "uppercase", marginBottom: 32 }}>
          {t.hero_sub}
        </motion.div>
        <motion.h1 variants={heroItem} style={{ marginBottom: 36 }}>
          <img src="/img/logo.webp" alt="Javier Bosco Properties — Activos singulares" width={1000} height={682} fetchPriority="high"
            style={{ width: "clamp(280px, 50vw, 580px)", height: "auto", margin: "0 auto", display: "block", filter: "drop-shadow(0 0 60px rgba(160,140,91,0.2))" }} />
        </motion.h1>
        <motion.div initial={{ width: 0 }} animate={{ width: 56 }} transition={{ duration: 2, ease: easeOut, delay: 1.2 }}
          style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "0 auto 32px" }} />
        <motion.div variants={heroItem} style={{ fontFamily: HEADING, fontSize: "clamp(18px, 2.2vw, 26px)", color: C.goldText, letterSpacing: "0.1em", fontStyle: "italic", fontWeight: 400, marginBottom: 44 }}>
          {t.tagline}
        </motion.div>
        <motion.div variants={heroItem}>
          <div style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
            {!searchOpen ? (
              <button type="button" onClick={() => setSearchOpen(true)} className="search-pill" style={{
                width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "20px 28px",
                background: "rgba(245,242,235,0.75)", backdropFilter: "blur(20px)", border: `1px solid ${C.goldLine}`, borderRadius: 100,
                cursor: "pointer", transition: "all 0.5s", color: C.grey, fontFamily: BODY, fontSize: 17, letterSpacing: "0.03em", fontStyle: "italic",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.gold; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.goldLine; }}>
                <Search size={16} style={{ color: C.gold, flexShrink: 0 }} />
                <span style={{ flex: 1, textAlign: "start" }}>{t.search.abrir}</span>
                <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase", fontStyle: "normal" }}>{t.search.explorar}</span>
              </button>
            ) : (
              <SearchExpanded close={() => setSearchOpen(false)} />
            )}
          </div>
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 3, duration: 1.5 }}
        style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.35em", color: C.greyDark, textTransform: "uppercase" }}>{t.scroll}</span>
        <div style={{ width: 1, height: 32, background: C.blackBorder, position: "relative", overflow: "hidden" }}>
          <div style={{ width: 1, height: 16, background: C.gold, animation: "scrollDown 2.2s ease-in-out infinite" }} />
        </div>
      </motion.div>
    </section>
  );
}

const labelStyle = { fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase" as const, display: "block", marginBottom: 6 };

function SearchExpanded({ close }: { close: () => void }) {
  const t = useT();
  const { setLead } = useContext(LeadContext);
  const [tab, setTab] = useState<"comprar" | "vender">("comprar");
  const [location, setLocation] = useState("");
  const [assetType, setAssetType] = useState<AssetKey | "">("");
  const [slider, setSlider] = useState(2);
  const submit = () => {
    setLead({ operacion: tab, ubicacion: location.trim(), tipo: assetType, rango: RANGES[Math.round(slider)] });
    scrollToId("contacto");
  };
  return (
    <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: easeOut }}
      style={{ background: "rgba(240,237,230,0.96)", backdropFilter: "blur(24px)", border: `1px solid ${C.goldLine}`, borderRadius: 24, padding: "28px clamp(18px, 4vw, 28px)", textAlign: "start" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: `1px solid ${C.blackBorder}`, paddingBottom: 14 }}>
        {(["comprar", "vender"] as const).map(tb => (
          <button type="button" key={tb} onClick={() => setTab(tb)} aria-pressed={tab === tb} style={{
            fontFamily: UI, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
            color: tab === tb ? C.goldText : C.greyDark, fontWeight: tab === tb ? 500 : 400,
            background: "transparent", border: "none", borderBottom: `1px solid ${tab === tb ? C.gold : "transparent"}`,
            cursor: "pointer", padding: "8px 14px", transition: "all 0.4s",
          }}>{t.search[tb]}</button>
        ))}
        <button type="button" onClick={close} aria-label={t.search.cerrar} style={{ marginInlineStart: "auto", color: C.greyDark, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}><X size={14} /></button>
      </div>
      <div className="grid-2-tight" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div>
          <label htmlFor="s-ubic" style={labelStyle}>{t.search.ubicacion}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.blackBorder}`, paddingBottom: 10 }}>
            <MapPin size={14} style={{ color: C.gold, flexShrink: 0 }} />
            <input id="s-ubic" value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t.search.ubicacion_ph}
              style={{ background: "transparent", border: "none", outline: "none", flex: 1, minWidth: 0, color: C.white, fontFamily: BODY, fontSize: 16, letterSpacing: "0.03em" }} />
          </div>
        </div>
        <div>
          <label htmlFor="s-tipo" style={labelStyle}>{t.search.tipo}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.blackBorder}`, paddingBottom: 10 }}>
            <Home size={14} style={{ color: C.gold, flexShrink: 0 }} />
            <select id="s-tipo" value={assetType} onChange={(e) => setAssetType(e.target.value as AssetKey | "")}
              style={{ background: "transparent", border: "none", outline: "none", flex: 1, minWidth: 0, color: C.white, fontFamily: BODY, fontSize: 16, cursor: "pointer" }}>
              <option value="">{t.search.seleccionar}</option>
              {(Object.keys(t.assetOptions) as AssetKey[]).map(k => <option key={k} value={k}>{t.assetOptions[k]}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <span style={{ ...labelStyle, marginBottom: 14 }}>{t.search.rango}</span>
        <InvestmentSlider value={slider} onChange={setSlider} label={t.search.rango} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LiquidButton variant="solid" size="md" onClick={submit}>{t.search.continuar}</LiquidButton>
      </div>
    </motion.div>
  );
}

// ============================================
// ACTIVOS DESTACADOS
// ============================================
const PROPERTY_IMAGES = ["/img/prop-chueca.webp", "/img/prop-gracia.webp", "/img/prop-plazamayor.webp"];
function PropiedadesDestacadas() {
  const t = useT();
  const items = t.properties.map((p, i) => ({ ...p, image: PROPERTY_IMAGES[i] }));
  return (
    <section id="activos" style={{ padding: "clamp(110px, 14vw, 220px) 0", background: C.blackDeep, position: "relative", overflow: "hidden" }}>
      <SectionTopLine />
      <div style={{ padding: "0 6vw", maxWidth: 1600, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ marginBottom: "clamp(50px, 6vw, 90px)" }}>
            <Eyebrow>{t.activos.label}</Eyebrow>
            <h2 style={{ fontFamily: HEADING, fontSize: "clamp(40px, 7vw, 120px)", fontWeight: 400, color: C.white, letterSpacing: "0.01em", lineHeight: 1, marginTop: 20 }}>
              {t.activos.title}
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <DragCarousel items={items} prevLabel={t.activos.prev} nextLabel={t.activos.next} renderItem={(p) => <PropertyCard property={p} price={t.activos.price} />} />
        </FadeIn>
        <FadeIn delay={0.4}>
          <p style={{ textAlign: "center", marginTop: 60, fontFamily: BODY, fontSize: 16, color: C.greyDark, letterSpacing: "0.04em", fontStyle: "italic", fontWeight: 400 }}>
            {t.activos.note}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
function PropertyCard({ property, price }: { property: { image: string; tag: string; title: string; meta: string }; price: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", overflow: "hidden", borderRadius: 2, userSelect: "none" }}>
      <div style={{ width: "100%", height: "clamp(340px, 42vw, 520px)", overflow: "hidden", background: C.blackBorder }}>
        <img src={property.image} alt={property.title} draggable={false} loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hover ? "scale(1.05)" : "scale(1)", filter: hover ? "brightness(0.75)" : "brightness(0.85)", transition: "all 0.9s cubic-bezier(0.25,0.1,0.25,1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(3,3,3,0.95) 0%, transparent 55%)" }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px" }}>
        <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.gold, textTransform: "uppercase", marginBottom: 10 }}>{property.tag}</div>
        <div style={{ fontFamily: HEADING, fontSize: "clamp(19px, 2vw, 24px)", fontWeight: 400, color: "#F5F2EB", letterSpacing: "0.01em", marginBottom: 8 }}>{property.title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", borderTop: `1px solid ${hover ? C.goldLine : "rgba(255,255,255,0.1)"}`, paddingTop: 14, marginTop: 14, transition: "border-color 0.5s" }}>
          <span style={{ fontFamily: BODY, fontSize: 15, color: C.whiteDim, fontWeight: 400, letterSpacing: "0.02em" }}>{property.meta}</span>
          <span style={{ fontFamily: HEADING, fontSize: 17, color: C.gold, letterSpacing: "0.01em" }}>{price}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TIPOLOGÍAS
// ============================================
const ASSET_IMAGES = ["solares", "terrenos", "edificios", "hoteles", "cadenas", "granlujo", "singulares", "offmarket"].map(n => `/img/tipo-${n}.webp`);
function TiposActivo() {
  const t = useT();
  return (
    <section id="tipologias" style={{ padding: "clamp(110px, 14vw, 200px) 0", background: C.black, position: "relative" }}>
      <SectionTopLine />
      <div style={{ padding: "0 6vw", maxWidth: 1600, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ marginBottom: "clamp(50px, 6vw, 90px)" }}>
            <Eyebrow>{t.tipologias.label}</Eyebrow>
            <h2 style={{ fontFamily: HEADING, fontSize: "clamp(36px, 5vw, 80px)", fontWeight: 400, color: C.white, letterSpacing: "0.01em", lineHeight: 1, marginTop: 20 }}>
              {t.tipologias.h} <span style={{ fontStyle: "italic", color: C.gold }}>{t.tipologias.em}</span>.
            </h2>
          </div>
        </FadeIn>
        <motion.div className="asset-grid" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} initial="hidden" whileInView="visible" viewport={VP}>
          {t.tipologias.items.map((a, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 24, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease } } }}>
              <AssetTypeCard name={a.name} desc={a.desc} image={ASSET_IMAGES[i]} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
function AssetTypeCard({ name, desc, image }: { name: string; desc: string; image: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", borderRadius: 2 }}>
      <img src={image} alt={name} loading="lazy" width={760} height={950}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: hover ? "brightness(0.65) saturate(0.9)" : "brightness(0.5) saturate(0.75)", transform: hover ? "scale(1.04)" : "scale(1)", transition: "all 0.9s cubic-bezier(0.25,0.1,0.25,1)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(3,3,3,0.88) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(14px, 2vw, 24px)" }}>
        <div style={{ fontFamily: HEADING, fontSize: "clamp(16px, 1.6vw, 24px)", color: "#F5F2EB", letterSpacing: "0.02em", fontWeight: 400, marginBottom: 4 }}>{name}</div>
        <div style={{ fontFamily: BODY, fontSize: "clamp(12px, 0.95vw, 14px)", color: C.goldHover, letterSpacing: "0.03em", fontStyle: "italic", fontWeight: 400 }}>{desc}</div>
      </div>
    </div>
  );
}

// ============================================
// EXTRA — YATES Y AVIACIÓN PRIVADA
// ============================================
const EXTRA_IMAGES = ["/img/extra-yate.webp", "/img/extra-jet.webp"];
function ExtraSection() {
  const t = useT();
  const [img, setImg] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setImg(i => (i + 1) % EXTRA_IMAGES.length), 4500);
    return () => window.clearInterval(id);
  }, []);
  return (
    <section id="extra" style={{ padding: "clamp(110px, 14vw, 200px) 0", background: C.blackDeep, position: "relative", overflow: "hidden" }}>
      <SectionTopLine />
      <div style={{ padding: "0 6vw", maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div className="grid-2" style={{ gap: "clamp(40px, 6vw, 100px)", alignItems: "center" }}>
            <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", borderRadius: 2, background: C.blackBorder }}>
              {EXTRA_IMAGES.map((src, i) => (
                <img key={src} src={src} alt={t.extra.title} loading="lazy" width={760} height={950}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.6) saturate(0.8)", opacity: img === i ? 1 : 0, transform: img === i ? "scale(1)" : "scale(1.04)", transition: "opacity 1.4s cubic-bezier(0.25,0.1,0.25,1), transform 6s linear" }} />
              ))}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(3,3,3,0.85) 100%)" }} />
              <div style={{ position: "absolute", top: 20, right: 20 }}>
                <span style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: C.gold, background: "rgba(3,3,3,0.7)", border: `1px solid ${C.goldLine}`, padding: "8px 16px", borderRadius: 2 }}>
                  {t.extra.badge}
                </span>
              </div>
              <div style={{ position: "absolute", bottom: 20, left: 20, display: "flex", gap: 6 }}>
                {EXTRA_IMAGES.map((_, i) => <span key={i} style={{ width: img === i ? 20 : 6, height: 2, background: img === i ? C.gold : "rgba(245,242,235,0.4)", transition: "all 0.6s" }} />)}
              </div>
            </div>
            <div>
              <Eyebrow>{t.extra.label}</Eyebrow>
              <GoldRule />
              <h2 style={{ fontFamily: HEADING, fontSize: "clamp(34px, 4vw, 60px)", fontWeight: 400, color: C.white, lineHeight: 1.1, marginBottom: 28, letterSpacing: "0.01em" }}>
                <span style={{ color: C.gold, fontStyle: "italic" }}>{t.extra.title}</span>
              </h2>
              <p style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.25vw, 19px)", color: C.grey, lineHeight: 1.9, letterSpacing: "0.03em", fontWeight: 400, marginBottom: 20 }}>
                {t.extra.body}
              </p>
              <p style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.1vw, 17px)", color: C.greyDark, lineHeight: 1.9, letterSpacing: "0.03em", fontWeight: 400, fontStyle: "italic", marginBottom: 44 }}>
                {t.extra.note}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <LiquidButton href="#contacto">{t.extra.cta}</LiquidButton>
                <span style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.25em", color: C.greyDark, textTransform: "uppercase" }}>{t.extra.only}</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================
// DESTINOS
// ============================================
const DEST_KEYS: DestKey[] = ["madrid", "barcelona", "marbella", "paris", "gstaad", "londres"];
function Destinos() {
  const t = useT();
  const vw = useViewportWidth();
  const cardWidth = Math.round(Math.min(380, vw * 0.7));
  const items = DEST_KEYS.map(k => ({ id: k, title: t.destinos.items[k].title, tag: t.destinos.items[k].tag, description: t.destinos.items[k].desc, imageSrc: `/img/dest-${k}.webp` }));
  return (
    <section id="destinos" style={{ padding: "clamp(110px, 14vw, 220px) 0", background: C.black, position: "relative", overflow: "hidden" }}>
      <SectionTopLine />
      <div style={{ padding: "0 6vw", maxWidth: 1600, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(50px, 6vw, 90px)", flexWrap: "wrap", gap: 20 }}>
            <div>
              <Eyebrow>{t.destinos.label}</Eyebrow>
              <h2 style={{ fontFamily: HEADING, fontSize: "clamp(36px, 5vw, 80px)", fontWeight: 400, color: C.white, letterSpacing: "0.01em", lineHeight: 1, marginTop: 20 }}>
                {t.destinos.h} <span style={{ fontStyle: "italic", color: C.gold }}>{t.destinos.em}</span>.
              </h2>
            </div>
            <p style={{ fontFamily: BODY, fontSize: 17, color: C.grey, maxWidth: 360, lineHeight: 1.9, fontWeight: 400, letterSpacing: "0.03em" }}>
              {t.destinos.desc}
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <CardStack
            items={items}
            cardWidth={cardWidth}
            cardHeight={Math.round(cardWidth * 1.26)}
            overlap={vw < 640 ? 0.62 : 0.52}
            spreadDeg={vw < 640 ? 30 : 42}
            tiltXDeg={10}
            activeLiftPx={18}
            activeScale={1.02}
            inactiveScale={0.92}
            autoAdvance
            intervalMs={4000}
            pauseOnHover
            dotColor="rgba(126,109,63,0.3)"
            dotActiveColor={C.goldText}
            borderColor={C.goldLine}
          />
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================
// LA FIRMA
// ============================================
function LaFirma() {
  const t = useT();
  return (
    <section id="firma" style={{ padding: "clamp(110px, 14vw, 220px) 6vw", background: C.blackDeep, position: "relative", overflow: "hidden" }}>
      <SectionTopLine />
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="grid-2" style={{ gap: "clamp(60px, 8vw, 140px)", alignItems: "center" }}>
          <FadeIn>
            <div>
              <Eyebrow>{t.firma.label}</Eyebrow>
              <GoldRule />
              <h2 style={{ fontFamily: HEADING, fontSize: "clamp(32px, 4vw, 58px)", fontWeight: 400, color: C.white, lineHeight: 1.15, marginBottom: 44, letterSpacing: "0.01em" }}>
                {t.firma.h} <span style={{ color: C.gold, fontStyle: "italic" }}>{t.firma.em}</span>.
              </h2>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <LiquidButton href="#contacto">{t.firma.btn_contacto}</LiquidButton>
                <LiquidButton href="#vender">{t.firma.btn_valoracion}</LiquidButton>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ position: "relative" }}>
              <p style={{ fontFamily: BODY, fontSize: "clamp(17px, 1.35vw, 21px)", color: C.grey, lineHeight: 1.9, letterSpacing: "0.03em", fontWeight: 400, marginBottom: 40 }}>
                {t.firma.body}
              </p>
              <div aria-hidden="true" style={{ fontFamily: HEADING, fontSize: "clamp(72px, 11vw, 160px)", color: C.goldLine, fontWeight: 400, letterSpacing: "0.02em", lineHeight: 0.88, fontStyle: "italic", opacity: 0.4 }}>
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
// VENDER (sin humo)
// ============================================
const venderStagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
const venderReveal: Variants = { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease } } };
const venderLine: Variants = { hidden: { width: 0 }, visible: { width: 32, transition: { duration: 1.2, ease } } };
function Vender() {
  const t = useT();
  const { setLead } = useContext(LeadContext);
  const [address, setAddress] = useState("");
  const submit = () => { setLead({ operacion: "vender", direccion: address.trim() }); scrollToId("contacto"); };
  return (
    <section id="vender" style={{ position: "relative", background: `linear-gradient(180deg, ${C.black} 0%, #EFEBE3 100%)`, overflow: "hidden" }}>
      <SectionTopLine />
      <motion.div variants={venderStagger} initial="hidden" whileInView="visible" viewport={VP}
        style={{ position: "relative", maxWidth: 1100, margin: "0 auto", width: "100%", padding: "clamp(110px, 13vw, 200px) 6vw", textAlign: "center" }}>
        <motion.span variants={venderReveal} style={{ display: "block", fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.goldText, textTransform: "uppercase" }}>{t.vender.label}</motion.span>
        <motion.div variants={venderLine} style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "20px auto 40px" }} />
        <motion.h2 variants={venderReveal} style={{ fontFamily: HEADING, fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 400, color: C.white, lineHeight: 1.1, marginBottom: 28, maxWidth: 800, marginLeft: "auto", marginRight: "auto", letterSpacing: "0.01em" }}>
          {t.vender.h} <span style={{ color: C.gold, fontStyle: "italic" }}>{t.vender.em}</span>.
        </motion.h2>
        <motion.p variants={venderReveal} style={{ fontFamily: BODY, fontSize: "clamp(17px, 1.35vw, 21px)", color: C.grey, lineHeight: 1.9, maxWidth: 620, margin: "0 auto 60px", letterSpacing: "0.03em", fontWeight: 400 }}>
          {t.vender.desc}
        </motion.p>
        <motion.form variants={venderReveal} onSubmit={(e) => { e.preventDefault(); submit(); }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, maxWidth: 680, margin: "0 auto", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "min(280px, 100%)", display: "flex", alignItems: "center", gap: 12, padding: "18px 24px", background: "#FFFFFF", border: "1px solid #E0DDD6", borderRadius: 100 }}>
            <MapPin size={14} style={{ color: C.gold, flexShrink: 0 }} />
            <input aria-label={t.vender.placeholder} value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t.vender.placeholder}
              style={{ background: "transparent", border: "none", outline: "none", flex: 1, minWidth: 0, color: C.white, fontFamily: BODY, fontSize: 16, letterSpacing: "0.03em" }} />
          </div>
          <LiquidButton type="submit" variant="solid">{t.vender.btn}</LiquidButton>
        </motion.form>
      </motion.div>
    </section>
  );
}

// ============================================
// CONTACTO
// ============================================
function GoldUnderline({ active }: { active: boolean }) {
  return (
    <motion.div animate={{ scaleX: active ? 1 : 0 }} transition={{ duration: 0.5, ease }}
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: C.gold, transformOrigin: "center" }} />
  );
}

type SendState = "idle" | "sending" | "ok" | "error";

function Contacto({ lang }: { lang: Lang }) {
  const t = useT();
  const { lead, setLead } = useContext(LeadContext);
  const openLegal = useContext(LegalContext);
  const [focused, setFocused] = useState<string | null>(null);
  const [state, setState] = useState<SendState>("idle");
  const [validation, setValidation] = useState<string | null>(null);
  const inputStyle = {
    background: "transparent", border: "none", borderBottom: `1px solid ${C.blackBorder}`,
    color: C.white, fontFamily: BODY, fontSize: "clamp(16px, 1.2vw, 18px)",
    padding: "16px 0", outline: "none", width: "100%", letterSpacing: "0.04em", fontWeight: 400,
  };

  const leadParts: string[] = [];
  if (lead) {
    leadParts.push(lead.operacion === "vender" ? t.contacto.vender : t.contacto.comprar);
    if (lead.tipo) leadParts.push(t.assetOptions[lead.tipo]);
    if (lead.rango) leadParts.push(lead.rango);
    if (lead.ubicacion) leadParts.push(lead.ubicacion);
    if (lead.direccion) leadParts.push(lead.direccion);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("_honey")) return; // bot
    if (!String(fd.get("nombre") || "").trim() || !String(fd.get("email") || "").trim()) { setValidation(t.contacto.required); return; }
    if (!fd.get("consentimiento")) { setValidation(t.contacto.consent_required); return; }
    setValidation(null);
    // Datos de la solicitud (buscador / vender), en castellano para el equipo
    if (lead) {
      fd.append("operacion", lead.operacion === "vender" ? "Venta" : "Compra");
      if (lead.tipo) fd.append("tipo_activo", T.es.assetOptions[lead.tipo]);
      if (lead.rango) fd.append("rango_inversion", lead.rango);
      if (lead.ubicacion) fd.append("ubicacion", lead.ubicacion);
      if (lead.direccion) fd.append("direccion_activo", lead.direccion);
    }
    fd.append("idioma_web", lang);
    fd.set("consentimiento", "Acepta la política de privacidad");
    fd.append("_subject", "Nueva solicitud desde javierbosco.com");
    fd.append("_template", "table");
    fd.append("_captcha", "false");
    setState("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL_FORMULARIO}`, {
        method: "POST", headers: { Accept: "application/json" }, body: fd,
      });
      const data: { success?: string | boolean; message?: string } = await res.json();
      if (res.ok && String(data.success) === "true") {
        setState("ok");
        form.reset();
        setLead(null);
      } else {
        console.error("FormSubmit:", data);
        setState("error");
      }
    } catch (err) {
      console.error("FormSubmit:", err);
      setState("error");
    }
  };

  return (
    <section id="contacto" style={{ padding: "clamp(100px, 12vw, 180px) 6vw", background: C.blackDeep, position: "relative", overflow: "hidden" }}>
      <SectionTopLine />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="grid-2" style={{ gap: "clamp(50px, 8vw, 140px)", alignItems: "start" }}>
          <div>
            <FadeIn>
              <Eyebrow>{t.contacto.label}</Eyebrow>
              <GoldRule />
              <h2 style={{ fontFamily: HEADING, fontSize: "clamp(34px, 3.8vw, 56px)", fontWeight: 400, color: C.white, lineHeight: 1.1, marginBottom: 32, letterSpacing: "0.01em" }}>
                {t.contacto.h}<br /><span style={{ color: C.gold, fontStyle: "italic" }}>{t.contacto.em}</span>.
              </h2>
              <p style={{ fontFamily: BODY, fontSize: "clamp(17px, 1.25vw, 19px)", color: C.grey, lineHeight: 1.9, maxWidth: 420, letterSpacing: "0.03em", fontWeight: 400 }}>
                {t.contacto.desc}
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div style={{ marginTop: 56 }}>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", marginBottom: 12 }}>{t.contacto.email_label}</div>
                <a href={`mailto:${EMAIL_PUBLICO}`} className="hover-gold" style={{ fontFamily: BODY, fontSize: 18, color: C.grey, textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.5s" }}>
                  {EMAIL_PUBLICO}
                </a>
              </div>
            </FadeIn>
          </div>
          <div style={{ paddingTop: "clamp(0px, 4vw, 60px)" }}>
            <form onSubmit={handleSubmit} noValidate>
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
              {leadParts.length > 0 && (
                <div style={{ marginBottom: 36, padding: "14px 18px", border: `1px solid ${C.goldLine}`, borderRadius: 2, display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                  <div>
                    <div style={{ ...labelStyle, marginBottom: 6 }}>{t.contacto.interes}</div>
                    <div style={{ fontFamily: BODY, fontSize: 16, color: C.white }}>{leadParts.join(" · ")}</div>
                  </div>
                  <button type="button" onClick={() => setLead(null)} aria-label={t.contacto.quitar} style={{ background: "transparent", border: "none", color: C.greyDark, cursor: "pointer", display: "flex" }}><X size={14} /></button>
                </div>
              )}
              <FadeIn delay={0.2}>
                <div style={{ marginBottom: 36, position: "relative" }}>
                  <label htmlFor="f-nombre" style={labelStyle}>{t.contacto.nombre}</label>
                  <input id="f-nombre" name="nombre" autoComplete="name" required style={inputStyle} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
                  <GoldUnderline active={focused === "name"} />
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div style={{ marginBottom: 36, position: "relative" }}>
                  <label htmlFor="f-email" style={labelStyle}>{t.contacto.email}</label>
                  <input id="f-email" name="email" type="email" autoComplete="email" required style={inputStyle} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
                  <GoldUnderline active={focused === "email"} />
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div style={{ marginBottom: 32 }}>
                  <label htmlFor="f-tel" style={labelStyle}>{t.contacto.telefono}</label>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ position: "relative", width: 80, flexShrink: 0 }}>
                      <input name="prefijo" aria-label="Prefijo" autoComplete="tel-country-code" style={{ ...inputStyle, textAlign: "center" }} defaultValue="+34" onFocus={() => setFocused("prefix")} onBlur={() => setFocused(null)} />
                      <GoldUnderline active={focused === "prefix"} />
                    </div>
                    <div style={{ position: "relative", flex: 1 }}>
                      <input id="f-tel" name="telefono" type="tel" autoComplete="tel-national" style={inputStyle} onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
                      <GoldUnderline active={focused === "phone"} />
                    </div>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.45}>
                <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer", fontFamily: BODY, fontSize: 15, color: C.grey, lineHeight: 1.5 }}>
                  <input type="checkbox" name="consentimiento" value="si" required style={{ marginTop: 4, accentColor: C.gold, width: 14, height: 14, flexShrink: 0 }} />
                  <span>
                    {t.contacto.consent_pre}{" "}
                    <button type="button" onClick={() => openLegal("privacidad")} style={{ background: "none", border: "none", padding: 0, color: C.goldText, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer", font: "inherit" }}>
                      {t.contacto.consent_link}
                    </button>.
                  </span>
                </label>
              </FadeIn>
              <FadeIn delay={0.5}>
                <div style={{ marginTop: 40 }} aria-live="polite">
                  {validation && <p style={{ fontFamily: BODY, fontSize: 15, color: "#8A3B2E", marginBottom: 16 }}>{validation}</p>}
                  {state === "ok" && (
                    <div style={{ padding: "16px 24px", background: C.goldDim, border: `1px solid ${C.goldLine}`, borderRadius: 2, marginBottom: 20, fontFamily: BODY, fontSize: 16, color: C.goldText, fontStyle: "italic", textAlign: "center" }}>
                      {t.contacto.ok}
                    </div>
                  )}
                  {state === "error" && (
                    <p style={{ fontFamily: BODY, fontSize: 15, color: "#8A3B2E", marginBottom: 16 }}>
                      {t.contacto.error} <a href={`mailto:${EMAIL_PUBLICO}`} style={{ color: "inherit" }}>{EMAIL_PUBLICO}</a>.
                    </p>
                  )}
                  <LiquidButton type="submit" variant="solid" disabled={state === "sending"}>
                    {state === "sending" ? t.contacto.enviando : t.contacto.enviar}
                  </LiquidButton>
                </div>
              </FadeIn>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ (desplegables)
// ============================================
function FAQ() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" style={{ padding: "clamp(100px, 12vw, 180px) 6vw", background: C.black, position: "relative" }}>
      <SectionTopLine />
      <div className="grid-faq" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div>
            <Eyebrow>{t.faq.label}</Eyebrow>
            <GoldRule />
            <h2 style={{ fontFamily: HEADING, fontSize: "clamp(34px, 3.8vw, 56px)", fontWeight: 400, color: C.white, lineHeight: 1.1, letterSpacing: "0.01em" }}>
              {t.faq.h} <span style={{ color: C.gold, fontStyle: "italic" }}>{t.faq.em}</span>.
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div style={{ borderTop: `1px solid ${C.blackBorder}` }}>
            {t.faq.items.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} style={{ borderBottom: `1px solid ${C.blackBorder}` }}>
                  <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={`faq-${i}`}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, padding: "26px 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "start" }}>
                    <span style={{ fontFamily: HEADING, fontSize: "clamp(17px, 1.5vw, 21px)", color: isOpen ? C.goldText : C.white, fontWeight: 400, lineHeight: 1.4, transition: "color 0.5s" }}>{f.q}</span>
                    <span style={{ color: C.gold, flexShrink: 0, display: "flex" }}>{isOpen ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div id={`faq-${i}`} key="c" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease }} style={{ overflow: "hidden" }}>
                        <p style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.2vw, 18px)", color: C.grey, lineHeight: 1.85, letterSpacing: "0.02em", padding: "0 40px 28px 0", maxWidth: 640 }}>{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
const footerStagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const footerCol: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } };
const linkStyle = { display: "block", fontFamily: BODY, fontSize: 15, color: C.grey, textDecoration: "none", letterSpacing: "0.04em", marginBottom: 10, transition: "color 0.4s", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "start" as const };
const colTitle = { fontFamily: UI, fontSize: 10, letterSpacing: "0.25em", color: C.goldText, textTransform: "uppercase" as const, marginBottom: 20 };

function FooterLink({ id, children }: { id: string; children: ReactNode }) {
  return <a href={`#${id}`} className="hover-gold" style={linkStyle} onClick={(e) => { e.preventDefault(); scrollToId(id); }}>{children}</a>;
}

function Footer() {
  const t = useT();
  const openLegal = useContext(LegalContext);
  return (
    <footer style={{ background: C.blackDeep, borderTop: `1px solid ${C.blackBorder}`, padding: "70px 6vw 30px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <motion.div className="footer-grid" variants={footerStagger} initial="hidden" whileInView="visible" viewport={VP}
          style={{ paddingBottom: 50, borderBottom: `1px solid ${C.blackBorder}` }}>
          <motion.div variants={footerCol}>
            <div style={{ fontFamily: HEADING, fontSize: 18, letterSpacing: "0.2em", color: C.white, marginBottom: 16 }}>JAVIER BOSCO</div>
            <div style={{ fontFamily: HEADING, fontSize: 13, letterSpacing: "0.05em", color: C.goldText, fontStyle: "italic", marginBottom: 24 }}>{t.tagline}</div>
            <div style={{ fontFamily: BODY, fontSize: 15, color: C.grey, lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>{t.footer.desc}</div>
            <a href="https://www.instagram.com/javierboscoproperties/" target="_blank" rel="noopener noreferrer" className="hover-gold" style={linkStyle}>Instagram</a>
            <a href={`mailto:${EMAIL_PUBLICO}`} className="hover-gold" style={linkStyle}>{EMAIL_PUBLICO}</a>
          </motion.div>
          <motion.div variants={footerCol}>
            <div style={colTitle}>{t.footer.col_destinos}</div>
            {DEST_KEYS.map(k => <FooterLink key={k} id="destinos">{t.destinos.items[k].title.charAt(0) + t.destinos.items[k].title.slice(1).toLowerCase()}</FooterLink>)}
          </motion.div>
          <motion.div variants={footerCol}>
            <div style={colTitle}>{t.footer.col_activos}</div>
            {t.tipologias.items.slice(0, 7).map(a => <FooterLink key={a.name} id="tipologias">{a.name}</FooterLink>)}
          </motion.div>
          <motion.div variants={footerCol}>
            <div style={colTitle}>{t.footer.col_firma}</div>
            <FooterLink id="firma">{t.footer.firma_links.firma}</FooterLink>
            <FooterLink id="faq">{t.footer.firma_links.faq}</FooterLink>
            <FooterLink id="vender">{t.footer.firma_links.vender}</FooterLink>
            <FooterLink id="contacto">{t.footer.firma_links.contacto}</FooterLink>
          </motion.div>
          <motion.div variants={footerCol}>
            <div style={colTitle}>{t.footer.col_legal}</div>
            <button type="button" className="hover-gold" style={linkStyle} onClick={() => openLegal("aviso-legal")}>{t.footer.aviso}</button>
            <button type="button" className="hover-gold" style={linkStyle} onClick={() => openLegal("privacidad")}>{t.footer.privacidad}</button>
            <button type="button" className="hover-gold" style={linkStyle} onClick={() => openLegal("cookies")}>{t.footer.cookies}</button>
          </motion.div>
        </motion.div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase" }}>© {new Date().getFullYear()} Javier Bosco Properties · {t.footer.rights}</span>
          <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase" }}>Madrid · España</span>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MODAL LEGAL
// ============================================
function LegalModal({ which, close }: { which: LegalKey | null; close: () => void }) {
  useEffect(() => {
    if (!which) return;
    lenisInstance?.stop();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); lenisInstance?.start(); };
  }, [which, close]);
  return (
    <AnimatePresence>
      {which && (
        <motion.div key="legal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }}
          onClick={close}
          style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(3,3,3,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "4vh 16px" }}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby="legal-title" data-lenis-prevent
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.5, ease }}
            onClick={(e) => e.stopPropagation()}
            className="legal-doc" dir="ltr" lang="es"
            style={{ background: C.black, maxWidth: 760, width: "100%", maxHeight: "92vh", overflowY: "auto", borderRadius: 2, border: `1px solid ${C.blackBorder}`, padding: "clamp(28px, 5vw, 56px)", position: "relative" }}>
            <button type="button" onClick={close} aria-label="Cerrar" style={{ position: "sticky", top: 0, float: "right", background: C.black, border: `1px solid ${C.blackBorder}`, borderRadius: 2, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.white }}><X size={14} /></button>
            <Eyebrow>Javier Bosco Properties</Eyebrow>
            <h2 id="legal-title" style={{ fontFamily: HEADING, fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 400, color: C.white, margin: "16px 0 28px" }}>{LEGAL[which].title}</h2>
            {LEGAL[which].body()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// MAIN
// ============================================
function readStoredLang(): Lang {
  try { const v = localStorage.getItem("lang"); if (isLang(v)) return v; } catch { /* sin almacenamiento */ }
  return "es";
}

const LEGAL_HASHES: LegalKey[] = ["aviso-legal", "privacidad", "cookies"];

export default function JavierBoscoLanding() {
  const [lang, setLang] = useState<Lang>(readStoredLang);
  const [lead, setLead] = useState<Lead>(null);
  const [legal, setLegal] = useState<LegalKey | null>(() => {
    const h = window.location.hash.slice(1) as LegalKey;
    return LEGAL_HASHES.includes(h) ? h : null;
  });

  useEffect(() => {
    try { localStorage.setItem("lang", lang); } catch { /* sin almacenamiento */ }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true });
    lenisInstance = lenis;
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisInstance = null; };
  }, []);

  const openLegal = useCallback((k: LegalKey) => {
    setLegal(k);
    history.replaceState(null, "", `#${k}`);
  }, []);
  const closeLegal = useCallback(() => {
    setLegal(null);
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  return (
    <LangContext.Provider value={lang}>
      <LeadContext.Provider value={{ lead, setLead }}>
        <LegalContext.Provider value={openLegal}>
          <div style={{ background: C.black, minHeight: "100vh", overflowX: "clip" }}>
            <NavHeader lang={lang} setLang={setLang} />
            <main>
              <Hero />
              <PropiedadesDestacadas />
              <TiposActivo />
              <ExtraSection />
              <Destinos />
              <LaFirma />
              <Vender />
              <Contacto lang={lang} />
              <FAQ />
            </main>
            <Footer />
            <LegalModal which={legal} close={closeLegal} />
          </div>
        </LegalContext.Provider>
      </LeadContext.Provider>
    </LangContext.Provider>
  );
}
