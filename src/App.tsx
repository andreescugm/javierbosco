import { useState, useEffect, useRef } from "react";
import logo from './logo.png';
import { Carousel } from "./components/ui/carousel";

// ============================================
// JAVIER BOSCO PROPERTIES — v5
// ============================================

const C = {
  gold: "#A08C5B",
  goldHover: "#BFA36D",
  goldDim: "rgba(160,140,91,0.12)",
  goldLine: "rgba(160,140,91,0.25)",
  black: "#030303",
  blackDeep: "#0A0A0A",
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
// WEBGL SMOKE
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

function SmokeCanvas({ color = [0.25, 0.22, 0.14], intensity = 1.0 }) {
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
// UTILITIES
// ============================================
function useInView(threshold = 0.2) {
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

function FadeIn({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const [ref, inView] = useInView(0.12);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0) scale(1)" : `translateY(${y}px) scale(0.98)`,
      transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

// ============================================
// NAV HEADER
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
    { label: "Portfolio", href: "#portfolio" },
    { label: "Contacto", href: "#contacto" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: scrolled ? "14px 6vw" : "28px 6vw",
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
    </nav>
  );
}

function NavTab({ children, href, setCursor }: { children: React.ReactNode; href: string; setCursor: (v: { left: number; width: number; opacity: number }) => void }) {
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
// LIQUID GLASS BUTTON
// ============================================
function LiquidButton({ children, href = "#", onClick, style: extraStyle = {} }: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const Tag = onClick ? "button" : "a";
  return (
    <Tag href={onClick ? undefined : href} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      style={{
        position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "18px 52px", fontFamily: UI, fontSize: 11, letterSpacing: "0.22em",
        textTransform: "uppercase", color: hover ? C.black : C.gold, textDecoration: "none", cursor: "pointer",
        borderRadius: 100, overflow: "hidden", border: `1px solid ${hover ? C.gold : C.goldLine}`,
        background: hover ? C.gold : "transparent",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        boxShadow: hover ? `0 0 30px ${C.goldDim}, inset 0 1px 0 rgba(255,255,255,0.15)` : `inset 0 1px 0 rgba(255,255,255,0.05)`,
        transition: "all 0.5s cubic-bezier(0.25,0.1,0.25,1)", fontWeight: 500, ...extraStyle,
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
// HERO
// ============================================
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);
  const a = (d: number): React.CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(35px)",
    transition: `all 1.4s cubic-bezier(0.16,1,0.3,1) ${d}s`,
  });
  return (
    <section style={{ height: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <SmokeCanvas color={[0.25, 0.22, 0.14]} intensity={1.0} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 45%, transparent 0%, rgba(3,3,3,0.65) 100%)", zIndex: 1 }} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 800 }}>
        <div style={{ marginBottom: 40, ...a(0.4) }}>
          <img
            src="/javierbosco/logo.png"
            alt="Javier Bosco Properties"
            style={{
              maxWidth: "clamp(320px, 52vw, 620px)",
              height: "auto",
              margin: "0 auto",
              display: "block",
              filter: "drop-shadow(0 0 60px rgba(160,140,91,0.25))",
            }}
          />
        </div>

        <div style={{ width: loaded ? 64 : 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "0 auto 40px", transition: "width 2s cubic-bezier(0.16,1,0.3,1) 1.2s" }} />

        <div style={{ fontFamily: HEADING, fontSize: "clamp(18px, 2.2vw, 26px)", color: C.gold, letterSpacing: "0.1em", fontStyle: "italic", fontWeight: 400, marginBottom: 24, ...a(0.8) }}>
          Off-market. On-point.
        </div>

        <p style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.3vw, 20px)", color: C.grey, letterSpacing: "0.04em", lineHeight: 1.9, maxWidth: 480, margin: "0 auto 56px", fontWeight: 300, ...a(1.1) }}>
          Acceso a operaciones inmobiliarias que no están en el mercado.
        </p>

        <div style={a(1.4)}>
          <LiquidButton href="#contacto">Contactar</LiquidButton>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: loaded ? 0.4 : 0, transition: "opacity 1.5s ease 3s" }}>
        <span style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.35em", color: C.greyDark, textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: 1, height: 32, background: C.blackBorder, position: "relative", overflow: "hidden" }}>
          <div style={{ width: 1, height: 16, background: C.gold, animation: "scrollDown 2.2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

// ============================================
// PORTFOLIO CAROUSEL
// ============================================
const PROPERTIES = [
  { image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop&q=80", title: "Residencia en El Viso", tag: "Madrid · Residencial" },
  { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop&q=80", title: "Chalet en La Moraleja", tag: "Madrid · Residencial" },
  { image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop&q=80", title: "Edificio Corporativo Castellana", tag: "Madrid · Edificio" },
  { image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80", title: "Hotel Boutique Costa Brava", tag: "Cataluña · Hospitality" },
  { image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop&q=80", title: "Villa en Riviera Francesa", tag: "Francia · Residencial" },
  { image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop&q=80", title: "Cadena Hotelera Mediterráneo", tag: "Portfolio · Hospitality" },
];

function Portfolio() {
  return (
    <section id="portfolio" style={{ padding: "clamp(120px, 14vw, 200px) 6vw", background: C.blackDeep, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>Portfolio</span>
          <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 20, marginBottom: "clamp(60px, 7vw, 100px)" }} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <Carousel items={PROPERTIES} />
        </FadeIn>
        <FadeIn delay={0.3}>
          <p style={{
            fontFamily: UI, fontSize: 10, color: C.greyDark, letterSpacing: "0.12em",
            lineHeight: 1.9, textAlign: "center", marginTop: "clamp(60px, 6vw, 100px)",
            maxWidth: 560, margin: "clamp(60px, 6vw, 100px) auto 0",
            fontStyle: "italic",
          }}>
            Estas son las operaciones que podemos mostrar.<br />
            Las que no, requieren una conversación.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================
// INVESTMENT SLIDER
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
        {ticks.map((t) => (
          <span key={t.val} style={{
            fontFamily: UI, fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase",
            color: value >= t.val ? C.gold : C.greyDark,
            transition: "color 0.3s", textAlign: "center", flex: 1,
          }}>{t.label}</span>
        ))}
      </div>
    </div>
  );
}

// ============================================
// CONTACTO
// ============================================
function Contacto() {
  const [focused, setFocused] = useState<string | null>(null);
  const [sliderVal, setSliderVal] = useState(3);

  const inputStyle = (field: string): React.CSSProperties => ({
    background: "transparent", border: "none",
    borderBottom: `1px solid ${focused === field ? C.gold : C.blackBorder}`,
    color: C.white, fontFamily: BODY, fontSize: "clamp(15px, 1.2vw, 18px)",
    padding: "18px 0", outline: "none", width: "100%",
    letterSpacing: "0.04em", transition: "border-color 0.5s", fontWeight: 300,
  });

  const selectStyle: React.CSSProperties = {
    background: C.blackDeep, border: "none",
    borderBottom: `1px solid ${focused === "tipo" ? C.gold : C.blackBorder}`,
    color: C.white, fontFamily: BODY, fontSize: "clamp(15px, 1.2vw, 18px)",
    padding: "18px 0", outline: "none", width: "100%",
    letterSpacing: "0.04em", transition: "border-color 0.5s", fontWeight: 300,
    appearance: "none", cursor: "pointer",
  };

  return (
    <section id="contacto" style={{ padding: "clamp(120px, 14vw, 200px) 6vw", background: C.blackDeep, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>Contacto</span>
          <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 20, marginBottom: "clamp(60px, 7vw, 100px)" }} />
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(60px, 10vw, 160px)", alignItems: "start" }}>
          {/* Left: form */}
          <div>
            <FadeIn delay={0.1}>
              <div style={{ marginBottom: "clamp(28px, 3vw, 40px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Nombre</label>
                <input style={inputStyle("name")} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div style={{ marginBottom: "clamp(28px, 3vw, 40px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email</label>
                <input type="email" style={inputStyle("email")} placeholder="tu@email.com" onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div style={{ marginBottom: "clamp(28px, 3vw, 40px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Teléfono</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <input style={{ ...inputStyle("prefix"), width: 72, textAlign: "center" }} defaultValue="+34" onFocus={() => setFocused("prefix")} onBlur={() => setFocused(null)} />
                  <input type="tel" style={inputStyle("phone")} placeholder="600 000 000" onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div style={{ marginBottom: "clamp(28px, 3vw, 40px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Tipo de operación</label>
                <select
                  style={{ ...selectStyle, borderBottomColor: focused === "tipo" ? C.gold : C.blackBorder }}
                  onFocus={() => setFocused("tipo")} onBlur={() => setFocused(null)}
                >
                  <option value="" style={{ background: C.blackDeep }}>Seleccionar...</option>
                  <option value="compra" style={{ background: C.blackDeep }}>Compra</option>
                  <option value="venta" style={{ background: C.blackDeep }}>Venta</option>
                  <option value="advisory" style={{ background: C.blackDeep }}>Advisory</option>
                  <option value="coinversion" style={{ background: C.blackDeep }}>Co-inversión</option>
                </select>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div style={{ marginBottom: "clamp(40px, 4.5vw, 56px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 20 }}>Rango de inversión</label>
                <InvestmentSlider value={sliderVal} onChange={setSliderVal} />
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <LiquidButton href="#contacto">Enviar</LiquidButton>
            </FadeIn>
          </div>

          {/* Right: contact info */}
          <div style={{ paddingTop: "clamp(0px, 4vw, 60px)" }}>
            <FadeIn delay={0.2}>
              <div style={{ borderLeft: `1px solid ${C.blackBorder}`, paddingLeft: "clamp(32px, 4vw, 56px)" }}>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", marginBottom: 20 }}>Contacto directo</div>
                <a
                  href="mailto:javierbosco@javierbosco.com"
                  style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.3vw, 20px)", color: C.grey, textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.5s", fontWeight: 300, display: "block" }}
                  onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = C.gold}
                  onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = C.grey}
                >
                  javierbosco@javierbosco.com
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer style={{ padding: "clamp(48px, 6vw, 80px) 6vw", background: C.black, borderTop: `1px solid ${C.blackBorder}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 32 }}>
        <div>
          <div style={{ fontFamily: HEADING, fontSize: 13, letterSpacing: "0.22em", color: C.white, marginBottom: 12, fontWeight: 400 }}>
            JAVIER BOSCO PROPERTIES
          </div>
          <a href="mailto:javierbosco@javierbosco.com" style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.15em", color: C.greyDark, textDecoration: "none", textTransform: "uppercase", transition: "color 0.4s", display: "block" }}
            onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = C.gold}
            onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = C.greyDark}>
            javierbosco@javierbosco.com
          </a>
        </div>

        <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greySmoke, textTransform: "uppercase", textAlign: "center" }}>
          © 2026
        </span>

        <div style={{ display: "flex", gap: 28, alignItems: "center", justifyContent: "flex-end" }}>
          <a href="https://www.instagram.com/javierboscoproperties/" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.15em", color: C.greyDark, textDecoration: "none", textTransform: "uppercase", transition: "color 0.4s" }}
            onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = C.gold}
            onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = C.greyDark}>
            Instagram
          </a>
          <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase" }}>Madrid</span>
        </div>
      </div>
    </footer>
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
        @media (max-width: 900px) { nav > ul { display: none !important; } }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr auto 1fr"] { grid-template-columns: 1fr !important; gap: 16px !important; }
          div[style*="grid-template-columns: 1fr 2fr 1fr"] { grid-template-columns: 1fr !important; }
          footer { flex-direction: column !important; gap: 16px !important; text-align: center !important; }
        }
      `}</style>
      <NavHeader />
      <Hero />
      <Portfolio />
      <Contacto />
      <Footer />
    </div>
  );
}
