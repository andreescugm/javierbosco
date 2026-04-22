import { useState, useEffect, useRef, ReactNode, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, MapPin, Home } from "lucide-react";

const C = {
  gold: "#A08C5B",
  goldHover: "#BFA36D",
  goldDim: "rgba(160,140,91,0.12)",
  goldLine: "rgba(160,140,91,0.25)",
  black: "#F5F2EB",
  blackDeep: "#EAE7E0",
  blackBorder: "#D5D0C8",
  blackBorderHover: "#C5BFB7",
  white: "#030303",
  whiteDim: "#2A2522",
  grey: "#9B958C",
  greyDark: "#6B6560",
  greySmoke: "#3E3A35",
};

const HEADING = "'Playfair Display', 'Georgia', serif";
const BODY = "'Cormorant Garamond', 'Georgia', serif";
const UI = "'Inter', 'Helvetica Neue', sans-serif";

// ============================================
// TRANSLATIONS
// ============================================
type TKeys = {
  tagline: string; nav_destinos: string; nav_activos: string; nav_vender: string;
  nav_contacto: string; nav_call: string; section_activos: string; section_destinos: string;
  section_tipologias: string; section_vender: string; section_contacto: string;
  h_activos: string; h_destinos: string; h_destinos_local: string;
  h_tipologias: string; h_tipologias_em: string;
  h_vender: string; h_vender_em: string; h_contacto: string; h_contacto_em: string;
  label_nombre: string; label_email: string; label_telefono: string;
  btn_enviar: string; btn_valoracion: string; btn_firma: string; btn_acceder: string;
  hero_sub: string; hero_search: string; hero_explore: string;
  search_ubicacion: string; search_tipo: string; search_rango: string; search_placeholder: string;
  footer_desc: string; vender_desc: string; vender_placeholder: string;
  about_text: string; contacto_desc: string; scroll: string;
};

const T: Record<string, TKeys> = {
  es: {
    tagline: "Off-market. On-point.",
    nav_destinos: "Destinos", nav_activos: "Activos", nav_vender: "Vender",
    nav_contacto: "Contacto", nav_call: "+34 · Contactar",
    section_activos: "Selección actual", section_destinos: "Destinos",
    section_tipologias: "Tipologías", section_vender: "Vender", section_contacto: "Iniciar conversación",
    h_activos: "Activos Destacados",
    h_destinos: "Presencia global,", h_destinos_local: "cierre local",
    h_tipologias: "Qué", h_tipologias_em: "gestionamos",
    h_vender: "Su activo", h_vender_em: "merece discreción",
    h_contacto: "El primer paso es", h_contacto_em: "una llamada",
    label_nombre: "Nombre", label_email: "Email", label_telefono: "Teléfono",
    btn_enviar: "Enviar solicitud", btn_valoracion: "Solicitar valoración",
    btn_firma: "Conocer la firma", btn_acceder: "Acceder",
    hero_sub: "Off-Market Real Estate · Madrid · International",
    hero_search: "¿Qué tipo de operación busca?", hero_explore: "Explorar",
    search_ubicacion: "Ubicación", search_tipo: "Tipo de activo",
    search_rango: "Rango de inversión", search_placeholder: "Madrid, España, Europa…",
    footer_desc: "Intermediación en operaciones inmobiliarias off-market de alto valor. Madrid, España e internacional.",
    vender_desc: "Valoración profesional y comercialización privada. Sin anuncios, sin portales, sin exposición pública. Solo compradores cualificados bajo acuerdo de confidencialidad.",
    vender_placeholder: "Dirección o zona del activo",
    about_text: "Edificios completos, hoteles, residencial de lujo, terrenos estratégicos y activos singulares. Acceso directo a oportunidades que se mueven entre profesionales antes de existir en ningún portal público.",
    contacto_desc: "Cada solicitud se revisa personalmente. Si el perfil encaja con alguna operación en curso o en desarrollo, el contacto posterior es directo.",
    scroll: "Scroll",
  },
  en: {
    tagline: "Off-market. On-point.",
    nav_destinos: "Locations", nav_activos: "Assets", nav_vender: "Sell",
    nav_contacto: "Contact", nav_call: "+34 · Contact",
    section_activos: "Current Selection", section_destinos: "Locations",
    section_tipologias: "Categories", section_vender: "Sell", section_contacto: "Start a Conversation",
    h_activos: "Featured Assets",
    h_destinos: "Global reach,", h_destinos_local: "local close",
    h_tipologias: "What we", h_tipologias_em: "manage",
    h_vender: "Your asset", h_vender_em: "deserves discretion",
    h_contacto: "The first step is", h_contacto_em: "a call",
    label_nombre: "Name", label_email: "Email", label_telefono: "Phone",
    btn_enviar: "Send request", btn_valoracion: "Request valuation",
    btn_firma: "About the firm", btn_acceder: "Access",
    hero_sub: "Off-Market Real Estate · Madrid · International",
    hero_search: "What type of transaction are you looking for?", hero_explore: "Explore",
    search_ubicacion: "Location", search_tipo: "Asset type",
    search_rango: "Investment range", search_placeholder: "Madrid, Spain, Europe…",
    footer_desc: "Intermediary for high-value off-market real estate. Madrid, Spain & international.",
    vender_desc: "Professional valuation and private marketing. No listings, no portals, no public exposure. Qualified buyers only under NDA.",
    vender_placeholder: "Property address or area",
    about_text: "Full buildings, hotels, luxury residential, strategic land and singular assets. Direct access to opportunities that move between professionals before appearing on any public portal.",
    contacto_desc: "Each request is reviewed personally. If the profile matches an ongoing or developing transaction, direct contact follows.",
    scroll: "Scroll",
  },
  fr: {
    tagline: "Off-market. On-point.",
    nav_destinos: "Destinations", nav_activos: "Actifs", nav_vender: "Vendre",
    nav_contacto: "Contact", nav_call: "+34 · Contacter",
    section_activos: "Sélection actuelle", section_destinos: "Destinations",
    section_tipologias: "Typologies", section_vender: "Vendre", section_contacto: "Initier une conversation",
    h_activos: "Actifs en vedette",
    h_destinos: "Présence mondiale,", h_destinos_local: "closing local",
    h_tipologias: "Ce que nous", h_tipologias_em: "gérons",
    h_vender: "Votre actif", h_vender_em: "mérite la discrétion",
    h_contacto: "La première étape est", h_contacto_em: "un appel",
    label_nombre: "Nom", label_email: "Email", label_telefono: "Téléphone",
    btn_enviar: "Envoyer la demande", btn_valoracion: "Demander une évaluation",
    btn_firma: "La firme", btn_acceder: "Accéder",
    hero_sub: "Immobilier Off-Market · Madrid · International",
    hero_search: "Quel type d'opération recherchez-vous?", hero_explore: "Explorer",
    search_ubicacion: "Emplacement", search_tipo: "Type d'actif",
    search_rango: "Tranche d'investissement", search_placeholder: "Madrid, Espagne, Europe…",
    footer_desc: "Intermédiaire en opérations immobilières off-market de haute valeur. Madrid, Espagne & international.",
    vender_desc: "Évaluation professionnelle et commercialisation privée. Sans annonces, sans portails, sans exposition publique.",
    vender_placeholder: "Adresse ou zone de l'actif",
    about_text: "Immeubles complets, hôtels, résidentiel de luxe, terrains stratégiques et actifs singuliers. Accès direct à des opportunités qui circulent entre professionnels.",
    contacto_desc: "Chaque demande est examinée personnellement. Si le profil correspond à une opération en cours, le contact est direct.",
    scroll: "Défiler",
  },
  de: {
    tagline: "Off-market. On-point.",
    nav_destinos: "Standorte", nav_activos: "Objekte", nav_vender: "Verkaufen",
    nav_contacto: "Kontakt", nav_call: "+34 · Kontakt",
    section_activos: "Aktuelle Auswahl", section_destinos: "Standorte",
    section_tipologias: "Kategorien", section_vender: "Verkaufen", section_contacto: "Gespräch beginnen",
    h_activos: "Ausgewählte Objekte",
    h_destinos: "Globale Präsenz,", h_destinos_local: "lokaler Abschluss",
    h_tipologias: "Was wir", h_tipologias_em: "verwalten",
    h_vender: "Ihr Objekt", h_vender_em: "verdient Diskretion",
    h_contacto: "Der erste Schritt ist", h_contacto_em: "ein Anruf",
    label_nombre: "Name", label_email: "E-Mail", label_telefono: "Telefon",
    btn_enviar: "Anfrage senden", btn_valoracion: "Bewertung anfragen",
    btn_firma: "Über uns", btn_acceder: "Zugriff",
    hero_sub: "Off-Market Immobilien · Madrid · International",
    hero_search: "Welche Art von Transaktion suchen Sie?", hero_explore: "Erkunden",
    search_ubicacion: "Standort", search_tipo: "Objekttyp",
    search_rango: "Investitionsrahmen", search_placeholder: "Madrid, Spanien, Europa…",
    footer_desc: "Vermittlung hochwertiger Off-Market-Immobilien. Madrid, Spanien & international.",
    vender_desc: "Professionelle Bewertung und private Vermarktung. Keine Anzeigen, keine Portale, keine öffentliche Exposition.",
    vender_placeholder: "Adresse oder Zone des Objekts",
    about_text: "Komplette Gebäude, Hotels, Luxuswohnimmobilien, strategische Grundstücke und besondere Vermögenswerte. Direktzugang zu Möglichkeiten, die sich unter Fachleuten bewegen.",
    contacto_desc: "Jede Anfrage wird persönlich geprüft. Wenn das Profil zu einer laufenden Transaktion passt, folgt direkter Kontakt.",
    scroll: "Scrollen",
  },
  it: {
    tagline: "Off-market. On-point.",
    nav_destinos: "Destinazioni", nav_activos: "Attivi", nav_vender: "Vendere",
    nav_contacto: "Contatto", nav_call: "+34 · Contattare",
    section_activos: "Selezione attuale", section_destinos: "Destinazioni",
    section_tipologias: "Tipologie", section_vender: "Vendere", section_contacto: "Iniziare una conversazione",
    h_activos: "Attivi in evidenza",
    h_destinos: "Presenza globale,", h_destinos_local: "chiusura locale",
    h_tipologias: "Cosa", h_tipologias_em: "gestiamo",
    h_vender: "Il suo attivo", h_vender_em: "merita discrezione",
    h_contacto: "Il primo passo è", h_contacto_em: "una chiamata",
    label_nombre: "Nome", label_email: "Email", label_telefono: "Telefono",
    btn_enviar: "Invia richiesta", btn_valoracion: "Richiedi valutazione",
    btn_firma: "La firma", btn_acceder: "Accedere",
    hero_sub: "Immobiliare Off-Market · Madrid · Internazionale",
    hero_search: "Che tipo di operazione sta cercando?", hero_explore: "Esplorare",
    search_ubicacion: "Posizione", search_tipo: "Tipo di attivo",
    search_rango: "Range di investimento", search_placeholder: "Madrid, Spagna, Europa…",
    footer_desc: "Intermediazione in operazioni immobiliari off-market di alto valore. Madrid, Spagna e internazionale.",
    vender_desc: "Valutazione professionale e commercializzazione privata. Senza annunci, senza portali, senza esposizione pubblica.",
    vender_placeholder: "Indirizzo o zona dell'attivo",
    about_text: "Edifici completi, hotel, residenziale di lusso, terreni strategici e attivi singolari. Accesso diretto a opportunità che circolano tra professionisti.",
    contacto_desc: "Ogni richiesta viene esaminata personalmente. Se il profilo corrisponde a un'operazione in corso, il contatto è diretto.",
    scroll: "Scorri",
  },
  pt: {
    tagline: "Off-market. On-point.",
    nav_destinos: "Destinos", nav_activos: "Ativos", nav_vender: "Vender",
    nav_contacto: "Contato", nav_call: "+34 · Contatar",
    section_activos: "Seleção atual", section_destinos: "Destinos",
    section_tipologias: "Tipologias", section_vender: "Vender", section_contacto: "Iniciar conversa",
    h_activos: "Ativos em destaque",
    h_destinos: "Presença global,", h_destinos_local: "fecho local",
    h_tipologias: "O que", h_tipologias_em: "gerimos",
    h_vender: "O seu ativo", h_vender_em: "merece discrição",
    h_contacto: "O primeiro passo é", h_contacto_em: "uma chamada",
    label_nombre: "Nome", label_email: "Email", label_telefono: "Telefone",
    btn_enviar: "Enviar pedido", btn_valoracion: "Solicitar avaliação",
    btn_firma: "A firma", btn_acceder: "Aceder",
    hero_sub: "Imobiliário Off-Market · Madrid · Internacional",
    hero_search: "Que tipo de operação procura?", hero_explore: "Explorar",
    search_ubicacion: "Localização", search_tipo: "Tipo de ativo",
    search_rango: "Gama de investimento", search_placeholder: "Madrid, Espanha, Europa…",
    footer_desc: "Intermediação em operações imobiliárias off-market de alto valor. Madrid, Espanha e internacional.",
    vender_desc: "Avaliação profissional e comercialização privada. Sem anúncios, sem portais, sem exposição pública.",
    vender_placeholder: "Morada ou zona do ativo",
    about_text: "Edifícios completos, hotéis, residencial de luxo, terrenos estratégicos e ativos singulares. Acesso direto a oportunidades que circulam entre profissionais.",
    contacto_desc: "Cada pedido é revisto pessoalmente. Se o perfil corresponder a uma operação em curso, o contacto é direto.",
    scroll: "Rolar",
  },
  ru: {
    tagline: "Вне рынка. В точку.",
    nav_destinos: "Направления", nav_activos: "Активы", nav_vender: "Продать",
    nav_contacto: "Контакт", nav_call: "+34 · Связаться",
    section_activos: "Текущий выбор", section_destinos: "Направления",
    section_tipologias: "Категории", section_vender: "Продать", section_contacto: "Начать разговор",
    h_activos: "Избранные активы",
    h_destinos: "Глобальное присутствие,", h_destinos_local: "локальное закрытие",
    h_tipologias: "Чем мы", h_tipologias_em: "управляем",
    h_vender: "Ваш актив", h_vender_em: "заслуживает конфиденциальности",
    h_contacto: "Первый шаг —", h_contacto_em: "звонок",
    label_nombre: "Имя", label_email: "Email", label_telefono: "Телефон",
    btn_enviar: "Отправить запрос", btn_valoracion: "Запросить оценку",
    btn_firma: "О компании", btn_acceder: "Войти",
    hero_sub: "Внерыночная недвижимость · Мадрид · Международный",
    hero_search: "Какой тип операции вас интересует?", hero_explore: "Изучить",
    search_ubicacion: "Местоположение", search_tipo: "Тип актива",
    search_rango: "Диапазон инвестиций", search_placeholder: "Мадрид, Испания, Европа…",
    footer_desc: "Посредничество в высокоценных внерыночных сделках с недвижимостью. Мадрид, Испания и международный рынок.",
    vender_desc: "Профессиональная оценка и приватная реализация. Без объявлений, без порталов, без публичной огласки.",
    vender_placeholder: "Адрес или район объекта",
    about_text: "Целые здания, отели, элитная жилая недвижимость, стратегические земельные участки. Прямой доступ к возможностям, которые передаются между профессионалами.",
    contacto_desc: "Каждый запрос рассматривается лично. Если профиль соответствует текущей операции, контакт будет прямым.",
    scroll: "Прокрутить",
  },
  ar: {
    tagline: "خارج السوق. في الصميم.",
    nav_destinos: "الوجهات", nav_activos: "الأصول", nav_vender: "البيع",
    nav_contacto: "اتصل", nav_call: "+34 · اتصل",
    section_activos: "الاختيار الحالي", section_destinos: "الوجهات",
    section_tipologias: "الفئات", section_vender: "البيع", section_contacto: "ابدأ محادثة",
    h_activos: "الأصول المميزة",
    h_destinos: "حضور عالمي،", h_destinos_local: "إغلاق محلي",
    h_tipologias: "ما", h_tipologias_em: "ندير",
    h_vender: "أصلك", h_vender_em: "يستحق السرية",
    h_contacto: "الخطوة الأولى هي", h_contacto_em: "مكالمة",
    label_nombre: "الاسم", label_email: "البريد الإلكتروني", label_telefono: "الهاتف",
    btn_enviar: "إرسال الطلب", btn_valoracion: "طلب تقييم",
    btn_firma: "عن الشركة", btn_acceder: "دخول",
    hero_sub: "عقارات خارج السوق · مدريد · دولي",
    hero_search: "ما نوع الصفقة التي تبحث عنها؟", hero_explore: "استكشاف",
    search_ubicacion: "الموقع", search_tipo: "نوع الأصل",
    search_rango: "نطاق الاستثمار", search_placeholder: "مدريد، إسبانيا، أوروبا…",
    footer_desc: "وساطة في عمليات العقارات خارج السوق عالية القيمة. مدريد، إسبانيا والسوق الدولي.",
    vender_desc: "تقييم مهني وتسويق خاص. بدون إعلانات، بدون بوابات، بدون تعرض عام.",
    vender_placeholder: "عنوان العقار أو المنطقة",
    about_text: "مبانٍ كاملة، فنادق، سكنية فاخرة، أراضٍ استراتيجية وأصول فريدة. وصول مباشر إلى الفرص التي تتداول بين المحترفين.",
    contacto_desc: "كل طلب يُراجع شخصياً. إذا توافق الملف مع عملية جارية، يكون التواصل مباشراً.",
    scroll: "تمرير",
  },
  zh: {
    tagline: "场外交易。精准到位。",
    nav_destinos: "目的地", nav_activos: "资产", nav_vender: "出售",
    nav_contacto: "联系", nav_call: "+34 · 联系",
    section_activos: "当前精选", section_destinos: "目的地",
    section_tipologias: "类别", section_vender: "出售", section_contacto: "开始对话",
    h_activos: "精选资产",
    h_destinos: "全球布局，", h_destinos_local: "本地成交",
    h_tipologias: "我们", h_tipologias_em: "管理的",
    h_vender: "您的资产", h_vender_em: "值得保密",
    h_contacto: "第一步是", h_contacto_em: "一个电话",
    label_nombre: "姓名", label_email: "电子邮件", label_telefono: "电话",
    btn_enviar: "发送请求", btn_valoracion: "申请估值",
    btn_firma: "关于我们", btn_acceder: "访问",
    hero_sub: "场外房地产 · 马德里 · 国际",
    hero_search: "您在寻找哪种类型的交易？", hero_explore: "探索",
    search_ubicacion: "位置", search_tipo: "资产类型",
    search_rango: "投资范围", search_placeholder: "马德里，西班牙，欧洲…",
    footer_desc: "高价值场外房地产交易中介。马德里、西班牙及国际市场。",
    vender_desc: "专业估值和私密营销。无广告，无门户网站，无公开曝光。",
    vender_placeholder: "房产地址或区域",
    about_text: "完整建筑、酒店、豪华住宅、战略用地和独特资产。直接获取在专业人士之间流通的机会。",
    contacto_desc: "每个请求都经过个人审查。如果档案与正在进行的交易匹配，将直接联系。",
    scroll: "滚动",
  },
};

const LangContext = createContext<string>("es");
function useT() { return T[useContext(LangContext)] || T.es; }

// ============================================
// UTILITY: cn
// ============================================
function cn(...args: (string | undefined | false | null)[]) {
  return args.filter(Boolean).join(" ");
}

// ============================================
// SMOKE SHADER (WebGL) — light-mode aware
// ============================================
const FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;
uniform vec3 u_base;
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
  col=mix(u_base,col,min(time*.1,1.)*u_intensity);
  col=clamp(col,.88,.98);
  O=vec4(col,1);
}`;

function SmokeCanvas({
  color = [0.25, 0.22, 0.14] as [number, number, number],
  base = [0.02, 0.02, 0.02] as [number, number, number],
  intensity = 1.0,
}) {
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "resolution");
    const uTime = gl.getUniformLocation(prog, "time");
    const uColor = gl.getUniformLocation(prog, "u_color");
    const uBase = gl.getUniformLocation(prog, "u_base");
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
      gl.clearColor(base[0], base[1], base[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 1e-3);
      gl.uniform3fv(uColor, color);
      gl.uniform3fv(uBase, base);
      gl.uniform1f(uInt, intensity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [color, base, intensity]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}

// ============================================
// SIMPLE CAROUSEL — 1 item at a time, infinite loop
// ============================================
function SimpleCarousel({ items, renderItem }: { items: any[]; renderItem: (item: any) => ReactNode }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const n = items.length;
  const go = (d: number) => { setDir(d); setIdx(i => (i + d + n) % n); };
  const btnStyle = {
    background: "rgba(10,8,5,0.55)", border: `1px solid ${C.goldLine}`,
    borderRadius: "50%", padding: 12, cursor: "pointer", display: "flex",
  };
  return (
    <div style={{ position: "relative" }}>
      <div style={{ overflow: "hidden" }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={idx}
            custom={dir}
            initial={(d: number) => ({ x: d * 60, opacity: 0 })}
            animate={{ x: 0, opacity: 1 }}
            exit={(d: number) => ({ x: -d * 60, opacity: 0 })}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {renderItem(items[idx])}
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, transform: "translateY(-50%)", display: "flex", justifyContent: "space-between", padding: "0 16px", pointerEvents: "none" }}>
        <button type="button" aria-label="Previous" onClick={() => go(-1)} style={{ ...btnStyle, pointerEvents: "auto" }}>
          <ChevronLeft size={18} style={{ color: C.gold }} />
        </button>
        <button type="button" aria-label="Next" onClick={() => go(1)} style={{ ...btnStyle, pointerEvents: "auto" }}>
          <ChevronRight size={18} style={{ color: C.gold }} />
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: 24, fontFamily: "'Inter','Helvetica Neue',sans-serif", fontSize: 9, letterSpacing: "0.25em", color: C.greyDark }}>
        {idx + 1} / {n}
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

// ============================================
// LANG OPTIONS
// ============================================
const LANG_OPTIONS = [
  { code: "es", flag: "🇪🇸" }, { code: "en", flag: "🇬🇧" }, { code: "fr", flag: "🇫🇷" },
  { code: "de", flag: "🇩🇪" }, { code: "it", flag: "🇮🇹" }, { code: "pt", flag: "🇵🇹" },
  { code: "ru", flag: "🇷🇺" }, { code: "ar", flag: "🇸🇦" }, { code: "zh", flag: "🇨🇳" },
];

// ============================================
// NAV HEADER
// ============================================
function NavHeader({ lang, setLang }: { lang: string; setLang: (l: string) => void }) {
  const t = useT();
  const [cursor, setCursor] = useState({ left: 0, width: 0, opacity: 0 });
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const tabs = [
    { label: t.nav_destinos, href: "#destinos" },
    { label: t.nav_activos, href: "#activos" },
    { label: t.nav_vender, href: "#vender" },
    { label: t.nav_contacto, href: "#contacto" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: scrolled ? "14px 4vw" : "24px 4vw",
      background: scrolled ? "rgba(245,242,235,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(24px) saturate(1.2)" : "none",
      borderBottom: scrolled ? `1px solid ${C.blackBorder}` : "1px solid transparent",
      transition: "all 0.7s cubic-bezier(0.25,0.1,0.25,1)",
    }}>
      <a href="#" style={{ fontFamily: HEADING, fontSize: 14, letterSpacing: "0.22em", color: C.white, textDecoration: "none", fontWeight: 400 }}>
        JAVIER BOSCO
      </a>
      <ul style={{
        position: "relative", display: "flex", listStyle: "none", margin: 0, padding: "4px",
        borderRadius: 100, border: `1px solid ${C.blackBorder}`, background: "rgba(200,195,185,0.3)",
      }} onMouseLeave={() => setCursor(p => ({ ...p, opacity: 0 }))}>
        {tabs.map(t => <NavTab key={t.href} href={t.href} setCursor={setCursor}>{t.label}</NavTab>)}
        <li style={{
          position: "absolute", top: 4, height: "calc(100% - 8px)", borderRadius: 100, background: C.gold,
          left: cursor.left, width: cursor.width, opacity: cursor.opacity,
          transition: "all 0.35s cubic-bezier(0.25,0.1,0.25,1)", pointerEvents: "none", zIndex: 0,
        }} />
      </ul>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          style={{
            background: "#F5F2EB", border: `1px solid ${C.blackBorder}`,
            color: C.grey, fontFamily: UI, fontSize: 13, letterSpacing: "0.05em",
            padding: "3px 6px", cursor: "pointer", borderRadius: 2, outline: "none",
            transition: "border-color 0.4s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.blackBorder)}
        >
          {LANG_OPTIONS.map(l => <option key={l.code} value={l.code} style={{ background: "#F5F2EB" }}>{l.flag}</option>)}
        </select>
      </div>
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
// LIQUID GLASS BUTTON
// ============================================
function LiquidButton({ children, href = "#", onClick, variant = "outline", size = "md" }: {
  children: ReactNode; href?: string; onClick?: () => void; variant?: "outline" | "solid"; size?: "sm" | "md" | "lg";
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const Tag = (onClick ? "button" : "a") as any;
  const sizes = { sm: { padding: "12px 32px", fontSize: 9 }, md: { padding: "18px 52px", fontSize: 11 }, lg: { padding: "22px 64px", fontSize: 12 } };
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
      <span style={{ position: "absolute", inset: 0, borderRadius: "inherit", background: hover ? "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)" : "none", pointerEvents: "none", transition: "all 0.5s" }} />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </Tag>
  );
}

// ============================================
// INVESTMENT SLIDER
// ============================================
function InvestmentSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ticks = ["<1M€","1-5M€","5-10M€","10-20M€","20-50M€","50-100M€","100M€+"];
  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "relative", height: 40, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", width: "100%", height: 3, background: C.blackBorder, borderRadius: 2 }} />
        <div style={{ position: "absolute", width: `${(value / 6) * 100}%`, height: 3, background: C.gold, borderRadius: 2, transition: "width 0.2s" }} />
        <input type="range" min={0} max={6} step={1} value={value} onChange={(e) => onChange(parseInt(e.target.value))}
          style={{ position: "absolute", width: "100%", height: 40, appearance: "none", background: "transparent", cursor: "pointer", zIndex: 2, outline: "none" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        {ticks.map((label, i) => (
          <span key={i} style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: value >= i ? C.gold : C.greyDark, transition: "color 0.3s", textAlign: "center", flex: 1 }}>{label}</span>
        ))}
      </div>
    </div>
  );
}

// ============================================
// HERO
// ============================================
function Hero() {
  const t = useT();
  const [loaded, setLoaded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sliderVal, setSliderVal] = useState(3);
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);
  const a = (d: number) => ({ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(35px)", transition: `all 1.4s cubic-bezier(0.16,1,0.3,1) ${d}s` });
  return (
    <section style={{ height: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <SmokeCanvas color={[0.75, 0.72, 0.65]} base={[0.96, 0.94, 0.90]} intensity={0.4} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 45%, transparent 0%, rgba(255,255,255,0.45) 100%)", zIndex: 1 }} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 900, width: "100%" }}>
        <div style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.4em", color: C.greyDark, textTransform: "uppercase", marginBottom: 32, ...a(0.4) }}>
          {t.hero_sub}
        </div>
        <div style={{ marginBottom: 36, ...a(0.6) }}>
          <img src="/logo.png" alt="Javier Bosco Properties"
            style={{ maxWidth: "clamp(340px, 50vw, 580px)", height: "auto", margin: "0 auto", display: "block", filter: "drop-shadow(0 0 60px rgba(160,140,91,0.25))" }} />
        </div>
        <div style={{ width: loaded ? 56 : 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "0 auto 32px", transition: "width 2s cubic-bezier(0.16,1,0.3,1) 1.2s" }} />
        <div style={{ fontFamily: HEADING, fontSize: "clamp(18px, 2.2vw, 26px)", color: C.gold, letterSpacing: "0.1em", fontStyle: "italic", fontWeight: 400, marginBottom: 44, ...a(1.0) }}>
          {t.tagline}
        </div>
        <div style={a(1.3)}>
          <SearchPalette open={searchOpen} setOpen={setSearchOpen} sliderVal={sliderVal} setSliderVal={setSliderVal} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: loaded ? 0.4 : 0, transition: "opacity 1.5s ease 3s" }}>
        <span style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.35em", color: C.greyDark, textTransform: "uppercase" }}>{t.scroll}</span>
        <div style={{ width: 1, height: 32, background: C.blackBorder, position: "relative", overflow: "hidden" }}>
          <div style={{ width: 1, height: 16, background: C.gold, animation: "scrollDown 2.2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

// ============================================
// SEARCH PALETTE
// ============================================
function SearchPalette({ open, setOpen, sliderVal, setSliderVal }: { open: boolean; setOpen: (v: boolean) => void; sliderVal: number; setSliderVal: (v: number) => void }) {
  const t = useT();
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "20px 28px",
          background: "rgba(245,242,235,0.75)", backdropFilter: "blur(20px)",
          border: `1px solid ${C.goldLine}`, borderRadius: 100,
          cursor: "pointer", transition: "all 0.5s", color: C.grey,
          fontFamily: BODY, fontSize: 17, letterSpacing: "0.03em", fontStyle: "italic",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.gold; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.goldLine; }}
        >
          <Search size={16} style={{ color: C.gold, flexShrink: 0 }} />
          <span style={{ flex: 1, textAlign: "left" }}>{t.hero_search}</span>
          <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase" }}>{t.hero_explore}</span>
        </button>
      ) : (
        <SearchExpanded close={() => setOpen(false)} sliderVal={sliderVal} setSliderVal={setSliderVal} />
      )}
    </div>
  );
}
function SearchExpanded({ close, sliderVal, setSliderVal }: { close: () => void; sliderVal: number; setSliderVal: (v: number) => void }) {
  const t = useT();
  const [tab, setTab] = useState<"comprar" | "vender">("comprar");
  const [location, setLocation] = useState("");
  const [assetType, setAssetType] = useState("");
  return (
    <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: "rgba(240,237,230,0.96)", backdropFilter: "blur(24px)", border: `1px solid ${C.goldLine}`, borderRadius: 24, padding: "32px 28px", textAlign: "left" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 28, borderBottom: `1px solid ${C.blackBorder}`, paddingBottom: 16 }}>
        {(["comprar", "vender"] as const).map(tb => (
          <button key={tb} onClick={() => setTab(tb)} style={{
            fontFamily: UI, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
            color: tab === tb ? C.gold : C.greyDark, background: "transparent", border: "none", cursor: "pointer", padding: "8px 16px", transition: "color 0.4s",
          }}>{tb}</button>
        ))}
        <button onClick={close} style={{ marginLeft: "auto", fontFamily: UI, fontSize: 10, color: C.greyDark, background: "transparent", border: "none", cursor: "pointer" }}>×</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div>
          <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t.search_ubicacion}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.blackBorder}`, paddingBottom: 10 }}>
            <MapPin size={14} style={{ color: C.gold }} />
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t.search_placeholder}
              style={{ background: "transparent", border: "none", outline: "none", flex: 1, color: C.white, fontFamily: BODY, fontSize: 15, fontStyle: location ? "normal" : "italic", letterSpacing: "0.03em" }} />
          </div>
        </div>
        <div>
          <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t.search_tipo}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.blackBorder}`, paddingBottom: 10 }}>
            <Home size={14} style={{ color: C.gold }} />
            <select value={assetType} onChange={(e) => setAssetType(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", flex: 1, color: C.white, fontFamily: BODY, fontSize: 15, cursor: "pointer", appearance: "none", letterSpacing: "0.03em" }}>
              <option value="">Seleccionar…</option>
              <option value="edificio">Edificio</option>
              <option value="hotel">Hotel / Hospitality</option>
              <option value="residencial">Residencial de lujo</option>
              <option value="terreno">Terreno</option>
              <option value="singular">Activo singular</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 14 }}>{t.search_rango}</label>
        <InvestmentSlider value={sliderVal} onChange={setSliderVal} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LiquidButton href="#contacto" variant="solid" size="md">{t.btn_acceder}</LiquidButton>
      </div>
    </motion.div>
  );
}

// ============================================
// ABOUT (kept for reference)
// ============================================
function About() {
  const t = useT();
  return (
    <section style={{ padding: "clamp(120px, 14vw, 220px) 6vw", background: C.black, position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(60px, 8vw, 140px)", alignItems: "center" }}>
          <FadeIn>
            <div>
              <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>La firma</span>
              <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 20, marginBottom: 44 }} />
              <h2 style={{ fontFamily: HEADING, fontSize: "clamp(32px, 4vw, 58px)", fontWeight: 400, color: C.white, lineHeight: 1.15, marginBottom: 44, letterSpacing: "0.01em" }}>
                Intermediación en <span style={{ color: C.gold, fontStyle: "italic" }}>operaciones que no se anuncian</span>.
              </h2>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <LiquidButton href="#contacto">{t.btn_firma}</LiquidButton>
                <LiquidButton href="#vender">{t.btn_valoracion}</LiquidButton>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ position: "relative" }}>
              <p style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.3vw, 20px)", color: C.grey, lineHeight: 2, letterSpacing: "0.03em", fontWeight: 300, marginBottom: 40 }}>
                {t.about_text}
              </p>
              <div style={{ fontFamily: HEADING, fontSize: "clamp(72px, 11vw, 160px)", color: C.goldLine, fontWeight: 400, letterSpacing: "0.02em", lineHeight: 0.88, fontStyle: "italic", opacity: 0.4 }}>
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
// LA FIRMA
// ============================================
function LaFirma() {
  const t = useT();
  return (
    <section style={{ padding: "clamp(120px, 14vw, 220px) 6vw", background: C.black, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(60px, 8vw, 140px)", alignItems: "center" }}>
          <FadeIn>
            <div>
              <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>La firma</span>
              <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 20, marginBottom: 44 }} />
              <h2 style={{ fontFamily: HEADING, fontSize: "clamp(32px, 4vw, 58px)", fontWeight: 400, color: C.white, lineHeight: 1.15, marginBottom: 44, letterSpacing: "0.01em" }}>
                Intermediación en <span style={{ color: C.gold, fontStyle: "italic" }}>operaciones off-market de alto valor</span>.
              </h2>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <LiquidButton href="#contacto">{t.btn_firma}</LiquidButton>
                <LiquidButton href="#vender">{t.btn_valoracion}</LiquidButton>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ position: "relative" }}>
              <p style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.3vw, 20px)", color: C.grey, lineHeight: 2, letterSpacing: "0.03em", fontWeight: 300, marginBottom: 40 }}>
                Intermediación exclusiva en activos inmobiliarios fuera de mercado. Edificios, hoteles, residencial de lujo y activos singulares entre 1M€ y 200M€. Acceso directo a oportunidades que se mueven entre profesionales bajo acuerdo de confidencialidad.
              </p>
              <div style={{ fontFamily: HEADING, fontSize: "clamp(72px, 11vw, 160px)", color: C.goldLine, fontWeight: 400, letterSpacing: "0.02em", lineHeight: 0.88, fontStyle: "italic", opacity: 0.4 }}>
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
// PROPIEDADES DESTACADAS
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
  const t = useT();
  return (
    <section id="activos" style={{ padding: "clamp(120px, 14vw, 220px) 0", background: C.blackDeep, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />
      <div style={{ padding: "0 6vw", maxWidth: 1600, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ marginBottom: "clamp(50px, 6vw, 90px)" }}>
            <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>{t.section_activos}</span>
            <h2 style={{ fontFamily: HEADING, fontSize: "clamp(44px, 7vw, 120px)", fontWeight: 400, color: C.white, letterSpacing: "0.01em", lineHeight: 1, marginTop: 20 }}>
              {t.h_activos}
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <SimpleCarousel items={PROPERTIES} renderItem={(p) => <PropertyCard property={p} />} />
        </FadeIn>
        <FadeIn delay={0.4}>
          <p style={{ textAlign: "center", marginTop: 60, fontFamily: BODY, fontSize: 15, color: C.greyDark, letterSpacing: "0.04em", fontStyle: "italic", fontWeight: 300 }}>
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
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", overflow: "hidden", borderRadius: 2, cursor: "pointer", transition: "all 0.6s" }}>
      <div style={{ width: "100%", height: 320, overflow: "hidden", background: C.blackBorder }}>
        <img src={property.image} alt={property.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hover ? "scale(1.05)" : "scale(1)", filter: hover ? "brightness(0.75)" : "brightness(0.85)", transition: "all 0.9s cubic-bezier(0.25,0.1,0.25,1)" }} />
        <div style={{ position: "absolute", top: 20, right: 20, fontFamily: HEADING, fontSize: 14, letterSpacing: "0.25em", color: "rgba(245,242,235,0.5)", textTransform: "uppercase" }}>JB</div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(3,3,3,0.95) 0%, transparent 55%)" }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px" }}>
        <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.gold, textTransform: "uppercase", marginBottom: 10 }}>{property.tag}</div>
        <div style={{ fontFamily: HEADING, fontSize: 22, fontWeight: 400, color: C.white, letterSpacing: "0.01em", marginBottom: 8 }}>{property.title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: `1px solid ${hover ? C.goldLine : "rgba(255,255,255,0.1)"}`, paddingTop: 14, marginTop: 14, transition: "border-color 0.5s" }}>
          <span style={{ fontFamily: BODY, fontSize: 14, color: C.whiteDim, fontWeight: 300, letterSpacing: "0.02em" }}>{property.meta}</span>
          <span style={{ fontFamily: HEADING, fontSize: 18, color: C.gold, letterSpacing: "0.01em" }}>{property.price}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DESTINOS
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
  const t = useT();
  return (
    <section id="destinos" style={{ padding: "clamp(120px, 14vw, 220px) 0", background: C.black, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />
      <div style={{ padding: "0 6vw", maxWidth: 1600, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(50px, 6vw, 90px)", flexWrap: "wrap", gap: 20 }}>
            <div>
              <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>{t.section_destinos}</span>
              <h2 style={{ fontFamily: HEADING, fontSize: "clamp(36px, 5vw, 80px)", fontWeight: 400, color: C.white, letterSpacing: "0.01em", lineHeight: 1, marginTop: 20 }}>
                {t.h_destinos} <span style={{ fontStyle: "italic", color: C.gold }}>{t.h_destinos_local}</span>.
              </h2>
            </div>
            <p style={{ fontFamily: BODY, fontSize: 16, color: C.grey, maxWidth: 340, lineHeight: 1.9, fontWeight: 300, letterSpacing: "0.03em" }}>
              Foco principal en Madrid, con operaciones activas en toda España, Europa y mercados internacionales cuando la operación lo requiere.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <SimpleCarousel items={DESTINATIONS} renderItem={(d) => <DestinationCard destination={d} />} />
        </FadeIn>
      </div>
    </section>
  );
}
function DestinationCard({ destination }: { destination: typeof DESTINATIONS[0] }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", aspectRatio: "4/5", maxHeight: 380, overflow: "hidden", borderRadius: 2, cursor: "pointer" }}>
      <img src={destination.image} alt={destination.name}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: hover ? "grayscale(0) brightness(0.7)" : "grayscale(0.4) brightness(0.55)", transform: hover ? "scale(1.05)" : "scale(1)", transition: "all 0.9s cubic-bezier(0.25,0.1,0.25,1)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(3,3,3,0.92) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 24px" }}>
        <div style={{ fontFamily: HEADING, fontSize: "clamp(22px, 2vw, 32px)", color: "#F5F2EB", letterSpacing: "0.12em", fontWeight: 400 }}>{destination.name}</div>
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
  const t = useT();
  return (
    <section style={{ padding: "clamp(120px, 14vw, 200px) 0", background: C.blackDeep, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />
      <div style={{ padding: "0 6vw", maxWidth: 1600, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ marginBottom: "clamp(50px, 6vw, 90px)" }}>
            <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>{t.section_tipologias}</span>
            <h2 style={{ fontFamily: HEADING, fontSize: "clamp(36px, 5vw, 80px)", fontWeight: 400, color: C.white, letterSpacing: "0.01em", lineHeight: 1, marginTop: 20 }}>
              {t.h_tipologias} <span style={{ fontStyle: "italic", color: C.gold }}>{t.h_tipologias_em}</span>.
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <SimpleCarousel items={ASSET_TYPES} renderItem={(a) => <AssetTypeCard asset={a} />} />
        </FadeIn>
      </div>
    </section>
  );
}
function AssetTypeCard({ asset }: { asset: typeof ASSET_TYPES[0] }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", aspectRatio: "4/5", maxHeight: 380, overflow: "hidden", borderRadius: 2, cursor: "pointer" }}>
      <img src={asset.image} alt={asset.name}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: hover ? "brightness(0.7)" : "brightness(0.55)", transform: hover ? "scale(1.04)" : "scale(1)", transition: "all 0.9s cubic-bezier(0.25,0.1,0.25,1)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(3,3,3,0.92) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 24px" }}>
        <div style={{ fontFamily: HEADING, fontSize: "clamp(24px, 2.2vw, 34px)", color: "#F5F2EB", letterSpacing: "0.02em", fontWeight: 400, marginBottom: 8 }}>{asset.name}</div>
        <div style={{ fontFamily: BODY, fontSize: 14, color: C.gold, letterSpacing: "0.03em", fontStyle: "italic", fontWeight: 300 }}>{asset.desc}</div>
      </div>
    </div>
  );
}

// ============================================
// VENDER
// ============================================
function Vender() {
  const t = useT();
  const [address, setAddress] = useState("");
  return (
    <section id="vender" style={{ position: "relative", background: "#F8F7F4", minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", height: 1, background: C.blackBorder }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", padding: "clamp(100px, 12vw, 180px) 6vw", textAlign: "center" }}>
        <FadeIn>
          <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>{t.section_vender}</span>
          <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "20px auto 40px" }} />
        </FadeIn>
        <FadeIn delay={0.15}>
          <h2 style={{ fontFamily: HEADING, fontSize: "clamp(38px, 5vw, 72px)", fontWeight: 400, color: C.white, lineHeight: 1.1, marginBottom: 28, maxWidth: 800, marginLeft: "auto", marginRight: "auto", letterSpacing: "0.01em" }}>
            {t.h_vender} <span style={{ color: C.gold, fontStyle: "italic" }}>{t.h_vender_em}</span>.
          </h2>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.3vw, 20px)", color: C.greyDark, lineHeight: 1.9, maxWidth: 620, margin: "0 auto 60px", letterSpacing: "0.03em", fontWeight: 300 }}>
            {t.vender_desc}
          </p>
        </FadeIn>
        <FadeIn delay={0.45}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 640, margin: "0 auto 32px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280, display: "flex", alignItems: "center", gap: 12, padding: "18px 24px", background: "#FFFFFF", border: "1px solid #E0DDD6", borderRadius: 100 }}>
              <MapPin size={14} style={{ color: C.gold, flexShrink: 0 }} />
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t.vender_placeholder}
                style={{ background: "transparent", border: "none", outline: "none", flex: 1, color: C.white, fontFamily: BODY, fontSize: 15, letterSpacing: "0.03em", fontStyle: address ? "normal" : "italic" }} />
            </div>
            <LiquidButton href="#contacto" variant="solid">{t.btn_valoracion}</LiquidButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================
// CONTACTO
// ============================================
function Contacto() {
  const t = useT();
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
              <span style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>{t.section_contacto}</span>
              <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 20, marginBottom: 44 }} />
              <h2 style={{ fontFamily: HEADING, fontSize: "clamp(34px, 3.8vw, 56px)", fontWeight: 400, color: C.white, lineHeight: 1.1, marginBottom: 32, letterSpacing: "0.01em" }}>
                {t.h_contacto}<br /><span style={{ color: C.gold, fontStyle: "italic" }}>{t.h_contacto_em}</span>.
              </h2>
              <p style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.2vw, 19px)", color: C.grey, lineHeight: 1.95, maxWidth: 420, letterSpacing: "0.03em", fontWeight: 300 }}>
                {t.contacto_desc}
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div style={{ marginTop: 56 }}>
                <div style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", marginBottom: 12 }}>Email</div>
                <a href="mailto:javierbosco@javierbosco.com" style={{ fontFamily: BODY, fontSize: 17, color: C.grey, textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.5s", fontWeight: 300 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.grey)}>
                  javierbosco@javierbosco.com
                </a>
              </div>
            </FadeIn>
          </div>
          <div style={{ paddingTop: "clamp(20px, 4vw, 60px)" }}>
            <FadeIn delay={0.2}>
              <div style={{ marginBottom: 36 }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t.label_nombre}</label>
                <input style={inputStyle("name")} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div style={{ marginBottom: 36 }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t.label_email}</label>
                <input type="email" style={inputStyle("email")} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div style={{ marginBottom: 36 }}>
                <label style={{ fontFamily: UI, fontSize: 8, letterSpacing: "0.3em", color: C.greyDark, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t.label_telefono}</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <input style={{ ...inputStyle("prefix"), width: 80, textAlign: "center" }} defaultValue="+34" onFocus={() => setFocused("prefix")} onBlur={() => setFocused(null)} />
                  <input type="tel" style={inputStyle("phone")} onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.5}>
              <div style={{ marginTop: 44 }}>
                <LiquidButton href="#contacto" variant="solid">{t.btn_enviar}</LiquidButton>
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
  const t = useT();
  return (
    <footer style={{ background: C.black, borderTop: `1px solid ${C.blackBorder}`, padding: "60px 6vw 30px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 40, paddingBottom: 50, borderBottom: `1px solid ${C.blackBorder}` }}>
          <div>
            <div style={{ fontFamily: HEADING, fontSize: 18, letterSpacing: "0.2em", color: C.white, marginBottom: 16 }}>JAVIER BOSCO</div>
            <div style={{ fontFamily: HEADING, fontSize: 12, letterSpacing: "0.05em", color: C.gold, fontStyle: "italic", marginBottom: 24 }}>{t.tagline}</div>
            <div style={{ fontFamily: BODY, fontSize: 14, color: C.grey, lineHeight: 1.8, fontWeight: 300, maxWidth: 260 }}>{t.footer_desc}</div>
          </div>
          <FooterColumn title={t.nav_destinos} items={["Madrid", "España", "Europa", "Internacional"]} />
          <FooterColumn title={t.nav_activos} items={["Edificios", "Hospitality", "Residencial", "Terrenos", "Singulares"]} />
          <FooterColumn title="La firma" items={["Filosofía", "Vender", "Valorar", "Contacto"]} />
          <div>
            <div style={{ fontFamily: UI, fontSize: 10, letterSpacing: "0.25em", color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>Social</div>
            <a href="https://www.instagram.com/javierboscoproperties/" target="_blank" rel="noopener noreferrer"
              style={{ display: "block", fontFamily: BODY, fontSize: 14, color: C.grey, textDecoration: "none", letterSpacing: "0.04em", marginBottom: 10, transition: "color 0.4s", fontWeight: 300 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.grey)}>Instagram</a>
            <a href="mailto:javierbosco@javierbosco.com"
              style={{ display: "block", fontFamily: BODY, fontSize: 14, color: C.grey, textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.4s", fontWeight: 300 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.grey)}>Email</a>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase" }}>© 2026 Javier Bosco Properties</span>
          <span style={{ fontFamily: UI, fontSize: 9, letterSpacing: "0.2em", color: C.greyDark, textTransform: "uppercase" }}>Madrid · España</span>
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
        <a key={it} href="#" style={{ display: "block", fontFamily: BODY, fontSize: 14, color: C.grey, textDecoration: "none", letterSpacing: "0.04em", marginBottom: 10, transition: "color 0.4s", fontWeight: 300 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.grey)}>{it}</a>
      ))}
    </div>
  );
}

// ============================================
// MAIN
// ============================================
export default function JavierBoscoLanding() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <LangContext.Provider value={lang}>
      <div style={{ background: C.black, minHeight: "100vh", overflowX: "hidden" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@200;300;400;500&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: #F5F2EB; overflow-x: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
          }
          ::selection { background: rgba(160,140,91,0.12); color: #F5F2EB; }
          ::placeholder { color: #9B958C; font-style: italic; }
          html { scroll-behavior: smooth; }
          @keyframes scrollDown { 0% { transform: translateY(-16px); opacity: 0; } 40% { opacity: 1; } 100% { transform: translateY(32px); opacity: 0; } }
          input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #A08C5B; border: 2px solid #F5F2EB; cursor: pointer; box-shadow: 0 0 12px rgba(160,140,91,0.3); }
          input[type="range"]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #A08C5B; border: 2px solid #F5F2EB; cursor: pointer; }
          @media (max-width: 900px) { nav > ul { display: none !important; } }
          @media (max-width: 768px) {
            div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
            div[style*="grid-template-columns: 1fr 1.2fr"] { grid-template-columns: 1fr !important; }
            div[style*="grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
        <NavHeader lang={lang} setLang={setLang} />
        <Hero />
        <PropiedadesDestacadas />
        <TiposActivo />
        <Destinos />
        <LaFirma />
        <Vender />
        <Contacto />
        <Footer />
      </div>
    </LangContext.Provider>
  );
}
