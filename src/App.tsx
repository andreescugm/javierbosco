import { useState, useEffect, useRef } from "react";

// ============================================
// JAVIER BOSCO PROPERTIES — v4 FINAL
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
  white: "#F5F2EB",       // ← más luminoso
  whiteDim: "#DDD8CE",    // ← más luminoso
  grey: "#9B958C",        // ← más luminoso
  greyDark: "#6B6560",    // ← más luminoso
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
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, `#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}`);
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, FRAG);
    gl.compileShader(fs);
    const prog = gl.createProgram();
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
    let raf;
    const loop = (now) => {
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
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, y = 40 }) {
  const [ref, inView] = useInView(0.12);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0) scale(1)" : `translateY(${y}px) scale(0.98)`,
      transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

function Counter({ end, prefix = "", suffix = "", active, duration = 2200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    let start = 0;
    const step = end / (duration / 16);
    const id = setInterval(() => { start += step; if (start >= end) { setVal(end); clearInterval(id); } else setVal(Math.floor(start)); }, 16);
    return () => clearInterval(id);
  }, [active, end, duration]);
  return <>{prefix}{val}{suffix}</>;
}

function SectionLabel({ children }) {
  return (
    <FadeIn>
      <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>{children}</span>
      <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 20, marginBottom: "clamp(60px, 7vw, 100px)" }} />
    </FadeIn>
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
    { label: "Filosofía", href: "#filosofia" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Cifras", href: "#cifras" },
    { label: "Servicios", href: "#servicios" },
    { label: "Acceso", href: "#acceso" },
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

function NavTab({ children, href, setCursor }) {
  const ref = useRef(null);
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
function LiquidButton({ children, href = "#", onClick, style: extraStyle = {} }) {
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
// HERO — con logo PNG
// ============================================
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);
  const a = (d) => ({ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(35px)", transition: `all 1.4s cubic-bezier(0.16,1,0.3,1) ${d}s` });
  return (
    <section style={{ height: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <SmokeCanvas color={[0.25, 0.22, 0.14]} intensity={1.0} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 45%, transparent 0%, rgba(3,3,3,0.65) 100%)", zIndex: 1 }} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 800 }}>
        <div style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.4em", color: C.greyDark, textTransform: "uppercase", marginBottom: 40, ...a(0.4) }}>
          Off-Market Real Estate · Madrid · International
        </div>

        {/* LOGO PNG en vez de texto */}
        <div style={{ marginBottom: 40, ...a(0.6) }}>
          <img 
  src={`${import.meta.env.BASE_URL}logo.png`} 
  alt="Logo Javier Bosco" 
/>
            alt="Javier Bosco Properties"
            style={{
              maxWidth: "clamp(380px, 56vw, 680px)",
              height: "auto",
              margin: "0 auto",
              display: "block",
              filter: "drop-shadow(0 0 60px rgba(160,140,91,0.25))",
            }}
          />
        </div>

        <div style={{ width: loaded ? 64 : 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "0 auto 40px", transition: "width 2s cubic-bezier(0.16,1,0.3,1) 1.2s" }} />

        <div style={{ fontFamily: HEADING, fontSize: "clamp(19px, 2.4vw, 28px)", color: C.gold, letterSpacing: "0.1em", fontStyle: "italic", fontWeight: 400, marginBottom: 32, ...a(1.0) }}>
          Off-market. On-point.
        </div>

        <p style={{ fontFamily: BODY, fontSize: "clamp(17px, 1.4vw, 22px)", color: C.grey, letterSpacing: "0.04em", lineHeight: 1.9, maxWidth: 520, margin: "0 auto 28px", fontWeight: 300, ...a(1.3) }}>
          Conectamos inversores y compradores con propiedades de alto valor
          que nunca aparecen en portales ni listados públicos.
        </p>
        <p style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.2vw, 18px)", color: C.greyDark, letterSpacing: "0.04em", lineHeight: 1.9, maxWidth: 480, margin: "0 auto 60px", fontWeight: 300, fontStyle: "italic", ...a(1.5) }}>
          Edificios completos, residencial de lujo, hoteles, cadenas hoteleras,
          terrenos estratégicos y activos singulares. Desde 1M€ hasta 200M€.
        </p>
        <div style={a(1.7)}>
          <LiquidButton href="#acceso">Solicitar Acceso Privado</LiquidButton>
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
// FILOSOFÍA — copy más claro
// ============================================
function Filosofia() {
  return (
    <section id="filosofia" style={{ padding: "clamp(120px, 14vw, 240px) 6vw", background: C.black }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>Filosofía</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "clamp(60px, 8vw, 140px)", alignItems: "start" }}>
          <div>
            <FadeIn delay={0.15}>
              <h2 style={{ fontFamily: HEADING, fontSize: "clamp(32px, 3.8vw, 58px)", fontWeight: 400, color: C.white, lineHeight: 1.12, marginBottom: "clamp(36px, 4vw, 56px)" }}>
                Las mejores<br />oportunidades<br />
                <span style={{ color: C.gold, fontStyle: "italic" }}>no se publican.<br />Se comparten.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p style={{ fontFamily: BODY, fontSize: "clamp(17px, 1.3vw, 21px)", color: C.grey, lineHeight: 2, maxWidth: 460, letterSpacing: "0.03em", fontWeight: 300 }}>
                El mercado off-market funciona con una regla simple: los activos más valiosos
                — edificios enteros, hoteles, terrenos estratégicos — se mueven entre profesionales
                que se conocen y confían entre sí, antes de llegar a ningún portal público.
              </p>
            </FadeIn>
            <FadeIn delay={0.45}>
              <p style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.2vw, 19px)", color: C.greyDark, lineHeight: 2, maxWidth: 460, marginTop: 28, letterSpacing: "0.03em", fontWeight: 300 }}>
                Javier Bosco Properties actúa como intermediario especializado en este tipo de operaciones:
                identifica oportunidades, conecta a las partes correctas y gestiona el proceso con discreción absoluta.
                Foco principal en Madrid, con operaciones activas en toda España, Europa y mercados internacionales.
              </p>
            </FadeIn>
          </div>
          <div style={{ paddingTop: "clamp(40px, 5vw, 100px)" }}>
            <FadeIn delay={0.35}>
              <div style={{ borderLeft: `1px solid ${C.goldLine}`, paddingLeft: "clamp(24px, 3vw, 48px)", marginBottom: "clamp(60px, 6vw, 100px)" }}>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", marginBottom: 20 }}>Lo que dicen los clientes</div>
                <div style={{ fontFamily: HEADING, fontSize: "clamp(19px, 1.7vw, 26px)", color: C.whiteDim, fontStyle: "italic", lineHeight: 1.6, letterSpacing: "0.02em", fontWeight: 400 }}>
                  "Accede a operaciones que no están en el mercado."
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.55}>
              <div style={{ borderLeft: `1px solid ${C.blackBorder}`, paddingLeft: "clamp(24px, 3vw, 48px)", marginBottom: "clamp(60px, 6vw, 80px)" }}>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", marginBottom: 14 }}>Caso real</div>
                <div style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.2vw, 18px)", color: C.grey, lineHeight: 1.9, fontWeight: 300 }}>
                  Acuerdo cerrado con una petrolera internacional.
                  Desplazamiento a Bulgaria para firma presencial.
                  Así de confidencial es el nivel de las operaciones.
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.7}>
              <div style={{ borderLeft: `1px solid ${C.blackBorder}`, paddingLeft: "clamp(24px, 3vw, 48px)" }}>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", marginBottom: 14 }}>Qué no hacemos</div>
                <div style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.2vw, 18px)", color: C.grey, lineHeight: 1.9, fontWeight: 300 }}>
                  No trabajamos con residencial estándar, operaciones pequeñas
                  ni producto sin componente estratégico. Cada operación se selecciona.
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
// PORTFOLIO — más variedad, precios reales, imágenes fix
// ============================================
const ASSETS = [
  { image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop&q=80", title: "Edificio Corporativo Castellana", tag: "Edificio · Madrid · 42M€" },
  { image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&q=80", title: "Hotel 5 Estrellas Gran Vía", tag: "Hospitality · Madrid · 85M€" },
  { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80", title: "Chalet en La Moraleja", tag: "Residencial · Madrid · 4.5M€" },
  { image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=600&h=400&fit=crop&q=80", title: "Palacete Barrio de Salamanca", tag: "Activo Singular · Madrid · 14M€" },
  { image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&q=80", title: "Cadena Hotelera Mediterráneo", tag: "Portfolio Hospitality · 200M€" },
  { image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop&q=80", title: "Ático con Vistas en El Viso", tag: "Residencial · Madrid · 7.2M€" },
  { image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop&q=80", title: "Hotel Boutique Costa Brava", tag: "Hospitality · Cataluña · 12M€" },
  { image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&q=80", title: "Villa en la Riviera Francesa", tag: "Residencial · Francia · 18M€" },
  { image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop&q=80", title: "Edificio Señorial Centro Madrid", tag: "Edificio · Madrid · 22M€" },
  { image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&h=400&fit=crop&q=80", title: "Finca Histórica en la Toscana", tag: "Activo Singular · Italia · 8.5M€" },
  { image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&q=80", title: "Residencia en Puerta de Hierro", tag: "Residencial · Madrid · 5.8M€" },
  { image: "https://images.unsplash.com/photo-1464938050520-ef2571e0d6e0?w=600&h=400&fit=crop&q=80", title: "Edificio Institucional Chamberí", tag: "Edificio · Madrid · 28M€" },
];

function Portfolio() {
  const scrollRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(1);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let pos = 0;
    let raf;
    let paused = false;
    const step = () => {
      if (!paused) {
        pos += 0.4 * speedRef.current;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const pause = () => { paused = true; };
    const resume = () => { paused = false; pos = el.scrollLeft; };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("mouseenter", pause); el.removeEventListener("mouseleave", resume); };
  }, []);

  const doubled = [...ASSETS, ...ASSETS];

  return (
    <section id="portfolio" style={{ padding: "clamp(120px, 14vw, 200px) 0", background: C.blackDeep, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />
      <div style={{ maxWidth: 1200, margin: "0 auto 0", padding: "0 6vw" }}>
        <SectionLabel>Portfolio Orientativo</SectionLabel>
      </div>
      <FadeIn>
        <div ref={scrollRef} style={{ display: "flex", gap: 20, overflow: "hidden", paddingBottom: 8, cursor: "grab", width: "100%" }}>
          {doubled.map((asset, i) => (
            <div key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                flexShrink: 0, width: 320, position: "relative",
                borderRadius: 4, overflow: "hidden",
                opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.5 : 1,
                transform: hoveredIdx === i ? "scale(1.03)" : "scale(1)",
                transition: "all 0.5s cubic-bezier(0.25,0.1,0.25,1)",
              }}>
              <div style={{ width: "100%", height: 220, overflow: "hidden", background: C.blackBorder }}>
                <img src={asset.image} alt={asset.title}
                  loading="lazy"
                  crossOrigin="anonymous"
                  style={{
                    width: "100%", height: "100%", objectFit: "cover", display: "block",
                    filter: hoveredIdx === i ? "grayscale(0) brightness(0.9)" : "grayscale(0.7) brightness(0.55)",
                    transition: "filter 0.6s",
                  }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "48px 20px 20px",
                background: "linear-gradient(to top, rgba(3,3,3,0.95) 0%, transparent 100%)",
              }}>
                <div style={{ fontFamily: HEADING, fontSize: 17, color: C.white, letterSpacing: "0.02em", marginBottom: 6 }}>
                  {asset.title}
                </div>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.gold, textTransform: "uppercase" }}>
                  {asset.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div style={{ textAlign: "center", marginTop: 40, padding: "0 6vw", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <p style={{ fontFamily: UI, fontSize: 10, color: C.greyDark, letterSpacing: "0.15em", fontStyle: "italic" }}>
            Por discreción, las imágenes son orientativas. Los activos reales se presentan bajo acuerdo de confidencialidad.
          </p>
          <button
            onClick={() => setSpeed(s => s === 1 ? 3 : s === 3 ? 6 : 1)}
            style={{
              fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
              color: C.greyDark, background: "transparent",
              border: `1px solid ${C.blackBorder}`, borderRadius: 100,
              padding: "8px 20px", cursor: "pointer",
              transition: "all 0.4s",
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = C.goldLine; e.target.style.color = C.gold; }}
            onMouseLeave={(e) => { e.target.style.borderColor = C.blackBorder; e.target.style.color = C.greyDark; }}
          >
            {speed === 1 ? "×1" : speed === 3 ? "×3" : "×6"}
          </button>
        </div>
      </FadeIn>
    </section>
  );
}

// ============================================
// CIFRAS — rango 1-200M€, copy mejorado
// ============================================
function Cifras() {
  const [ref, inView] = useInView(0.25);
  const stats = [
    { value: 300, prefix: "+", label: "Operaciones\nCerradas" },
    { value: 5, prefix: "+", label: "Años en\nOff-Market" },
    { value: 200, suffix: "M€", label: "Mayor\nOperación" },
    { value: 1, suffix: "–200M€", label: "Rango de\nActivos" },
  ];
  return (
    <section id="cifras" ref={ref} style={{ padding: "clamp(120px, 14vw, 240px) 6vw", background: C.black, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "clamp(80px, 8vw, 140px)" }}>
            <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>Cifras</span>
            <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "20px auto 0" }} />
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: `1px solid ${C.blackBorder}` }}>
          {stats.map((s, i) => (
            <FadeIn key={i} delay={0.1 + i * 0.12}>
              <div style={{ padding: "clamp(40px, 5vw, 72px) clamp(20px, 3vw, 48px)", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.blackBorder}` : "none" }}>
                <div style={{ fontFamily: HEADING, fontSize: "clamp(36px, 4.5vw, 72px)", fontWeight: 400, color: C.gold, lineHeight: 1, marginBottom: 20 }}>
                  <Counter end={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} active={inView} />
                </div>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.25em", color: C.grey, textTransform: "uppercase", lineHeight: 2, whiteSpace: "pre-line" }}>{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.7}>
          <div style={{ textAlign: "center", marginTop: "clamp(60px, 6vw, 100px)", maxWidth: 600, margin: "clamp(60px, 6vw, 100px) auto 0" }}>
            <p style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.3vw, 20px)", color: C.grey, lineHeight: 1.9, letterSpacing: "0.03em", fontWeight: 300 }}>
              Cada rango de inversión recibe una estrategia distinta: diferente tipo de activo,
              diferente perfil de comprador, diferente nivel de confidencialidad.
              No es lo mismo gestionar 2M€ que 120M€ — y así lo tratamos.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================
// SERVICIOS
// ============================================
function ServiceRow({ num, title, desc, isLast }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      display: "grid", gridTemplateColumns: "60px 1fr 1.2fr", gap: "clamp(24px, 4vw, 64px)", alignItems: "baseline",
      padding: "clamp(32px, 4vw, 56px) 0", borderTop: `1px solid ${hover ? C.blackBorderHover : C.blackBorder}`,
      borderBottom: isLast ? `1px solid ${C.blackBorder}` : "none", cursor: "default",
      transition: "all 0.6s cubic-bezier(0.25,0.1,0.25,1)", paddingLeft: hover ? 16 : 0,
    }}>
      <span style={{ fontFamily: HEADING, fontSize: 13, color: hover ? C.gold : C.greyDark, letterSpacing: "0.1em", transition: "color 0.5s" }}>{num}</span>
      <h3 style={{ fontFamily: HEADING, fontSize: "clamp(22px, 2.2vw, 32px)", fontWeight: 400, color: hover ? C.gold : C.white, letterSpacing: "0.02em", margin: 0, transition: "color 0.5s" }}>{title}</h3>
      <p style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.2vw, 18px)", color: C.grey, lineHeight: 1.9, margin: 0, letterSpacing: "0.03em", fontWeight: 300 }}>{desc}</p>
    </div>
  );
}

function Servicios() {
  const services = [
    { num: "01", title: "Compra Off-Market", desc: "Acceso anticipado a edificios, solares, hoteles y activos singulares que no están públicamente disponibles. Operaciones desde 1M€ hasta 200M€, antes de que lleguen al mercado abierto." },
    { num: "02", title: "Venta Discrecional", desc: "Tu activo se presenta exclusivamente a compradores verificados e inversores cualificados. Sin aparecer en portales, sin exposición pública, sin dejar huella digital." },
    { num: "03", title: "Advisory Estratégico", desc: "Análisis de oportunidad, due diligence y estructuración de operaciones complejas. El criterio profesional que convierte información privilegiada en ventaja competitiva." },
    { num: "04", title: "Activos Singulares", desc: "Operaciones que no encajan en categorías convencionales: palacios urbanos, fincas históricas, portfolios hoteleros de 9 cifras. Sin límite geográfico." },
  ];
  return (
    <section id="servicios" style={{ padding: "clamp(120px, 14vw, 240px) 6vw", background: C.blackDeep }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>Servicios</SectionLabel>
        {services.map((s, i) => <FadeIn key={i} delay={0.1 * i}><ServiceRow {...s} isLast={i === services.length - 1} /></FadeIn>)}
      </div>
    </section>
  );
}

// ============================================
// INVESTMENT SLIDER
// ============================================
function InvestmentSlider({ value, onChange }) {
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
// ACCESO — con smoke, campos completos
// ============================================
function Acceso() {
  const [focused, setFocused] = useState(null);
  const [sliderVal, setSliderVal] = useState(3);

  const inputStyle = (field) => ({
    background: "transparent", border: "none",
    borderBottom: `1px solid ${focused === field ? C.gold : C.blackBorder}`,
    color: C.white, fontFamily: BODY, fontSize: "clamp(15px, 1.2vw, 18px)",
    padding: "18px 0", outline: "none", width: "100%",
    letterSpacing: "0.04em", transition: "border-color 0.5s", fontWeight: 300,
  });

  const selectStyle = {
    background: "transparent", border: "none",
    borderBottom: `1px solid ${focused === "tipo" ? C.gold : C.blackBorder}`,
    color: C.white, fontFamily: BODY, fontSize: "clamp(15px, 1.2vw, 18px)",
    padding: "18px 0", outline: "none", width: "100%",
    letterSpacing: "0.04em", transition: "border-color 0.5s", fontWeight: 300,
    appearance: "none", cursor: "pointer",
  };

  return (
    <section id="acceso" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <SmokeCanvas color={[0.2, 0.18, 0.12]} intensity={0.5} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 0%, rgba(3,3,3,0.8) 100%)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "clamp(120px, 14vw, 240px) 6vw" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(60px, 10vw, 180px)", alignItems: "start" }}>
          <div>
            <SectionLabel>Acceso Privado</SectionLabel>
            <FadeIn delay={0.15}>
              <h2 style={{ fontFamily: HEADING, fontSize: "clamp(38px, 4vw, 60px)", fontWeight: 400, color: C.white, lineHeight: 1.1, marginBottom: "clamp(28px, 3vw, 44px)" }}>
                El primer paso<br />es una<br /><span style={{ color: C.gold, fontStyle: "italic" }}>conversación.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p style={{ fontFamily: BODY, fontSize: "clamp(17px, 1.3vw, 21px)", color: C.grey, lineHeight: 2, maxWidth: 440, letterSpacing: "0.03em", fontWeight: 300, marginBottom: 24 }}>
                Si eres inversor, family office, desarrollador o profesional del sector
                y buscas acceso a oportunidades inmobiliarias off-market de alto valor
                — este formulario es tu punto de entrada.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.1vw, 18px)", color: C.greyDark, lineHeight: 2, maxWidth: 440, letterSpacing: "0.03em", fontWeight: 300, fontStyle: "italic" }}>
                Cada solicitud se revisa personalmente.
                Si tu perfil encaja con alguna operación en curso, el contacto es directo.
              </p>
            </FadeIn>
            <FadeIn delay={0.55}>
              <div style={{ marginTop: "clamp(60px, 6vw, 100px)" }}>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", marginBottom: 14 }}>Línea directa</div>
                <a href="mailto:javierbosco@javierbosco.com" style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.2vw, 18px)", color: C.grey, textDecoration: "none", letterSpacing: "0.06em", transition: "color 0.5s", fontWeight: 300, display: "block", marginBottom: 8 }}
                  onMouseEnter={(e) => e.target.style.color = C.gold} onMouseLeave={(e) => e.target.style.color = C.grey}>
                  javierbosco@javierbosco.com
                </a>
              </div>
            </FadeIn>
          </div>

          {/* FORM */}
          <div style={{ paddingTop: "clamp(20px, 4vw, 72px)" }}>
            <FadeIn delay={0.2}>
              <div style={{ marginBottom: "clamp(28px, 3vw, 40px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Nombre completo</label>
                <input style={inputStyle("name")} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div style={{ marginBottom: "clamp(28px, 3vw, 40px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email</label>
                <input type="email" style={inputStyle("email")} placeholder="tu@email.com" onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div style={{ marginBottom: "clamp(28px, 3vw, 40px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Teléfono (con prefijo internacional si no es español)</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <input style={{ ...inputStyle("prefix"), width: 80, textAlign: "center" }} defaultValue="+34" onFocus={() => setFocused("prefix")} onBlur={() => setFocused(null)} />
                  <input type="tel" style={inputStyle("phone")} placeholder="600 000 000" onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div style={{ marginBottom: "clamp(28px, 3vw, 40px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Tipo de operación</label>
                <select style={{ ...selectStyle, borderBottomColor: focused === "tipo" ? C.gold : C.blackBorder }} onFocus={() => setFocused("tipo")} onBlur={() => setFocused(null)}>
                  <option value="" style={{ background: C.black }}>Seleccionar...</option>
                  <option value="compra" style={{ background: C.black }}>Compra</option>
                  <option value="venta" style={{ background: C.black }}>Venta</option>
                  <option value="advisory" style={{ background: C.black }}>Advisory</option>
                  <option value="coinversion" style={{ background: C.black }}>Co-inversión</option>
                </select>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div style={{ marginBottom: "clamp(28px, 3vw, 40px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Tipo de activo</label>
                <select style={{ ...selectStyle, borderBottomColor: focused === "activo" ? C.gold : C.blackBorder }} onFocus={() => setFocused("activo")} onBlur={() => setFocused(null)}>
                  <option value="" style={{ background: C.black }}>Seleccionar...</option>
                  <option value="edificio" style={{ background: C.black }}>Edificio</option>
                  <option value="singular" style={{ background: C.black }}>Activo singular</option>
                  <option value="residencial" style={{ background: C.black }}>Residencial de lujo</option>
                  <option value="hotel" style={{ background: C.black }}>Hotel / Cadena hotelera</option>
                  <option value="terreno" style={{ background: C.black }}>Terreno</option>
                </select>
              </div>
            </FadeIn>

            <FadeIn delay={0.45}>
              <div style={{ marginBottom: "clamp(28px, 3vw, 40px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Ubicación de interés</label>
                <input style={{ ...inputStyle("ubicacion"), fontStyle: "italic" }} placeholder="Madrid, España, Europa, Internacional..."
                  onFocus={() => setFocused("ubicacion")} onBlur={() => setFocused(null)} />
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div style={{ marginBottom: "clamp(40px, 4.5vw, 56px)" }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 20 }}>Capital aproximado</label>
                <InvestmentSlider value={sliderVal} onChange={setSliderVal} />
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <LiquidButton href="#acceso">Solicitar Acceso</LiquidButton>
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
    <footer style={{ padding: "40px 6vw", background: C.black, borderTop: `1px solid ${C.blackBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase" }}>© 2026 Javier Bosco Properties</span>
      <span style={{ fontFamily: HEADING, fontSize: 13, color: C.greyDark, fontStyle: "italic", letterSpacing: "0.06em" }}>Off-market. On-point.</span>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <a href="https://www.instagram.com/javierboscoproperties/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.15em", color: C.greyDark, textDecoration: "none", textTransform: "uppercase", transition: "color 0.4s" }}
          onMouseEnter={(e) => e.target.style.color = C.gold} onMouseLeave={(e) => e.target.style.color = C.greyDark}>
          Instagram
        </a>
        <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase" }}>Madrid</span>
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
          div[style*="grid-template-columns: 1.2fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="grid-template-columns: 60px"] { grid-template-columns: 1fr !important; gap: 12px !important; }
          footer { flex-direction: column !important; gap: 16px !important; text-align: center !important; }
        }
      `}</style>
      <NavHeader />
      <Hero />
      <Filosofia />
      <Portfolio />
      <Cifras />
      <Servicios />
      <Acceso />
      <Footer />
    </div>
  );
}
