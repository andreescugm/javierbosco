// ============================================
// ACTIVOS ORIENTATIVOS + CON QUIÉN TRABAJAMOS
// Datos (precio, imagen, referencia) aquí; textos en los 9 idiomas más abajo.
// Los activos son una muestra orientativa: sin direcciones ni datos identificativos.
// ============================================
import type { Lang } from "./i18n";

export type AssetCat = "residencial" | "solares" | "edificios" | "singulares" | "inversion";
export type AssetId = "r1" | "r2" | "r3" | "s1" | "s2" | "e1" | "e2" | "g1" | "g2" | "i1" | "i2";

export const ASSETS: { id: AssetId; ref: string; cat: AssetCat; price: number; image: string; featured: boolean }[] = [
  { id: "r1", ref: "JB-R104", cat: "residencial", price: 1_800_000, image: "/img/act-r1.webp", featured: true },
  { id: "s1", ref: "JB-S031", cat: "solares", price: 10_500_000, image: "/img/act-s1.webp", featured: true },
  { id: "e1", ref: "JB-E012", cat: "edificios", price: 6_000_000, image: "/img/act-e1.webp", featured: true },
  { id: "i1", ref: "JB-I024", cat: "inversion", price: 18_500_000, image: "/img/act-i1.webp", featured: true },
  { id: "g1", ref: "JB-G007", cat: "singulares", price: 2_000_000, image: "/img/act-g1.webp", featured: true },
  { id: "r3", ref: "JB-R122", cat: "residencial", price: 720_000, image: "/img/act-r3.webp", featured: true },
  { id: "r2", ref: "JB-R117", cat: "residencial", price: 3_100_000, image: "/img/act-r2.webp", featured: false },
  { id: "s2", ref: "JB-S036", cat: "solares", price: 3_200_000, image: "/img/act-s2.webp", featured: false },
  { id: "e2", ref: "JB-E019", cat: "edificios", price: 14_000_000, image: "/img/act-e2.webp", featured: false },
  { id: "g2", ref: "JB-G011", cat: "singulares", price: 4_500_000, image: "/img/act-g2.webp", featured: false },
  { id: "i2", ref: "JB-I029", cat: "inversion", price: 26_000_000, image: "/img/act-i2.webp", featured: false },
];

export const TICKETS = [700_000, 1_000_000, 2_000_000, 6_000_000, 10_000_000, 50_000_000];

/** Precio en formato de cada idioma: 720.000 € · 1,8 M€ · €1.8M … */
export function formatPrice(v: number, lang: Lang): string {
  const loc: Record<Lang, string> = { es: "es-ES", en: "en-GB", fr: "fr-FR", de: "de-DE", it: "it-IT", pt: "pt-PT", ru: "ru-RU", ar: "ar-EG", zh: "zh-CN" };
  const nf = (d: number) => new Intl.NumberFormat(loc[lang] === "ar-EG" ? "en-GB" : loc[lang], { maximumFractionDigits: d, minimumFractionDigits: 0 });
  if (v < 1_000_000) {
    const n = nf(0).format(v);
    return lang === "en" || lang === "zh" ? `€${n}` : `${n} €`;
  }
  const m = nf(1).format(v / 1_000_000);
  switch (lang) {
    case "en": case "zh": return `€${m}M`;
    case "de": return `${m} Mio. €`;
    case "ru": return `${m} млн €`;
    case "ar": return `${m} مليون €`;
    default: return `${m} M€`;
  }
}

type AssetText = { type: string; place: string; specs: string[]; kpis?: [string, string][] };

export type ActDict = {
  label: string; h1: string; h2: string; lead: string;
  filters: Record<"todos" | AssetCat, string>;
  ver_todo: string; ver_menos: string; info: string; ref: string; note: string;
  encargo_h: string; encargo_em: string; encargo_sub: string; encargo_ph: string; encargo_btn: string;
  assets: Record<AssetId, AssetText>;
  clientes: {
    label: string; h: string; em: string; lead: string;
    perfiles: { t: string; d: string }[];
    ticket_label: string; ticket_names: string[];
    situ_label: string; situaciones: string[]; cierre: string; cierre_em: string; cta: string;
  };
};

const es: ActDict = {
  label: "Activos · Muestra orientativa",
  h1: "Si alguien quiere algo,", h2: "lo conseguimos.",
  lead: "Esté donde esté. Esto no es un portal: es una pequeña muestra del tipo de activos a los que accedemos. Sin direcciones ni datos que identifiquen al propietario. El resto se comparte en privado.",
  filters: { todos: "Todos", residencial: "Residencial", solares: "Solares", edificios: "Edificios", singulares: "Singulares", inversion: "Inversión" },
  ver_todo: "Ver la muestra completa", ver_menos: "Ver menos", info: "Solicitar información", ref: "Ref.",
  note: "Activos orientativos. Superficies, precios y condiciones se confirman únicamente bajo acuerdo de confidencialidad.",
  encargo_h: "¿Busca algo que", encargo_em: "no aparece aquí?",
  encargo_sub: "Descríbalo con el detalle que quiera: zona, superficie, características, rentabilidad. Lo buscamos esté donde esté.",
  encargo_ph: "Ej.: ático en Chamberí, 4 dormitorios, terraza, garaje, hasta 2,5 M€",
  encargo_btn: "Encargar búsqueda",
  assets: {
    r1: { type: "Propiedad", place: "Centro de Madrid", specs: ["4 dormitorios", "Techos de 3,8 m", "Suelo radiante", "Doble portal", "Acceso trasero independiente", "Mármol original"] },
    r2: { type: "Piso emblemático", place: "Barrio de Salamanca", specs: ["285 m²", "Finca señorial de 1912", "Balcones corridos a fachada", "Portería física", "2 plazas de garaje", "Orientación sur"] },
    r3: { type: "Piso", place: "Chamberí", specs: ["3 dormitorios", "Exterior, última planta", "Reforma integral de autor", "Carpintería de madera original", "Trastero"] },
    s1: { type: "Solar", place: "Madrid", kpis: [["Edificabilidad", "12.400 m²"], ["Uso", "Residencial"], ["Planeamiento", "Aprobado"]], specs: ["Proyecto básico para 140 viviendas", "Urbanización ejecutada", "Libre de cargas"] },
    s2: { type: "Parcela", place: "Costa del Sol", kpis: [["Parcela", "4.800 m²"], ["Edificabilidad", "0,35 m²/m²"], ["Licencia", "Concedida"]], specs: ["Uso residencial unifamiliar", "Vistas abiertas al mar", "Acceso privado"] },
    e1: { type: "Edificio emblemático", place: "Huesca", specs: ["3.100 m² construidos", "Fachada de piedra catalogada", "Compatible con uso hotelero", "Entregado vacío", "Casco histórico"] },
    e2: { type: "Edificio residencial", place: "Madrid centro", kpis: [["Superficie", "2.650 m²"], ["Unidades", "22 + 2 locales"], ["Libre", "60 %"]], specs: ["Sin división horizontal", "Potencial de reposicionamiento", "Patio de manzana"] },
    g1: { type: "Propiedad singular", place: "Centro de Madrid", specs: ["Dúplex de 190 m²", "Terraza de 120 m²", "Lucernario y yeserías originales", "Vistas sobre tejados históricos", "Edificio del s. XIX"] },
    g2: { type: "Finca", place: "Mallorca", specs: ["38 hectáreas", "Olivar centenario", "Casa principal del s. XVIII", "Agua propia", "Licencia de agroturismo"] },
    i1: { type: "Activo de inversión · Oficinas", place: "Madrid", kpis: [["Ocupación", "98 %"], ["WAULT", "6,2 años"], ["Rentabilidad", "5,4 %"]], specs: ["4.200 m² sobre rasante", "3 inquilinos multinacionales", "Certificación LEED Gold"] },
    i2: { type: "Hotel en rentabilidad", place: "Canarias", kpis: [["Categoría", "4*"], ["Habitaciones", "180"], ["Yield", "6,1 %"]], specs: ["Arrendado a operador internacional", "15 años de obligado cumplimiento", "Renta fija + variable"] },
  },
  clientes: {
    label: "Con quién trabajamos", h: "Lo importante", em: "no es el ticket",
    lead: "Trabajamos con quien necesita discreción, no solo con quien mueve grandes cifras. Desde un piso de 700.000 € hasta operaciones institucionales, con el mismo nivel de reserva.",
    perfiles: [
      { t: "Family offices", d: "Patrimonio con criterio de largo plazo." },
      { t: "Private equity", d: "Oportunidades fuera de proceso competitivo." },
      { t: "Inversores", d: "Capital que busca rentabilidad sin ruido." },
      { t: "Patrimonios privados", d: "Diversificación en activos reales." },
      { t: "Compradores particulares", d: "Una vivienda concreta que no está en ningún portal." },
      { t: "Propietarios", d: "Vender con absoluta discreción." },
    ],
    ticket_label: "Operaciones de todos los tamaños",
    ticket_names: ["Piso", "Propiedad", "Piso emblemático", "Edificio", "Solar", "Institucional"],
    situ_label: "Situaciones habituales",
    situaciones: [
      "Vender sin que nadie sepa que la propiedad está a la venta.",
      "Empezar a mover un activo antes de sacarlo al mercado.",
      "Encontrar exactamente lo que no aparece en ningún portal.",
    ],
    cierre: "No somos un portal.", cierre_em: "No enseñamos todo lo que tenemos.", cta: "Cuéntenos qué busca",
  },
};

const en: ActDict = {
  label: "Assets · Indicative selection",
  h1: "If someone wants something,", h2: "we get it.",
  lead: "Wherever it is. This is not a portal: it is a small sample of the kind of assets we can access. No addresses, nothing that identifies the owner. Everything else is shared privately.",
  filters: { todos: "All", residencial: "Residential", solares: "Land", edificios: "Buildings", singulares: "Singular", inversion: "Investment" },
  ver_todo: "View the full selection", ver_menos: "Show less", info: "Request information", ref: "Ref.",
  note: "Indicative assets. Areas, prices and terms are only confirmed under a confidentiality agreement.",
  encargo_h: "Looking for something", encargo_em: "not shown here?",
  encargo_sub: "Describe it in as much detail as you like: area, size, features, yield. We will find it, wherever it is.",
  encargo_ph: "e.g. penthouse in Chamberí, 4 bedrooms, terrace, parking, up to €2.5M",
  encargo_btn: "Commission a search",
  assets: {
    r1: { type: "Residence", place: "Central Madrid", specs: ["4 bedrooms", "3.8 m ceilings", "Underfloor heating", "Two entrances", "Independent rear access", "Original marble"] },
    r2: { type: "Landmark apartment", place: "Salamanca district", specs: ["285 m²", "Stately 1912 building", "Full-length façade balconies", "Staffed concierge", "2 parking spaces", "South-facing"] },
    r3: { type: "Apartment", place: "Chamberí", specs: ["3 bedrooms", "Exterior, top floor", "Architect-led full refurbishment", "Original timber joinery", "Storage room"] },
    s1: { type: "Development site", place: "Madrid", kpis: [["Buildable area", "12,400 m²"], ["Use", "Residential"], ["Zoning", "Approved"]], specs: ["Outline design for 140 homes", "Infrastructure completed", "Free of charges"] },
    s2: { type: "Plot", place: "Costa del Sol", kpis: [["Plot", "4,800 m²"], ["Buildability", "0.35 m²/m²"], ["Permit", "Granted"]], specs: ["Single-family residential use", "Open sea views", "Private access"] },
    e1: { type: "Landmark building", place: "Huesca", specs: ["3,100 m² built", "Listed stone façade", "Suitable for hotel use", "Delivered vacant", "Historic centre"] },
    e2: { type: "Residential building", place: "Central Madrid", kpis: [["Area", "2,650 m²"], ["Units", "22 + 2 retail"], ["Vacant", "60%"]], specs: ["Single ownership (not divided)", "Repositioning potential", "Inner courtyard"] },
    g1: { type: "Singular property", place: "Central Madrid", specs: ["190 m² duplex", "120 m² terrace", "Original skylight and plasterwork", "Views over historic rooftops", "19th-century building"] },
    g2: { type: "Estate", place: "Mallorca", specs: ["38 hectares", "Century-old olive grove", "18th-century main house", "Own water supply", "Agritourism licence"] },
    i1: { type: "Investment asset · Offices", place: "Madrid", kpis: [["Occupancy", "98%"], ["WAULT", "6.2 years"], ["Yield", "5.4%"]], specs: ["4,200 m² above ground", "3 multinational tenants", "LEED Gold certified"] },
    i2: { type: "Income-producing hotel", place: "Canary Islands", kpis: [["Category", "4*"], ["Rooms", "180"], ["Yield", "6.1%"]], specs: ["Leased to an international operator", "15-year fixed term", "Fixed + variable rent"] },
  },
  clientes: {
    label: "Who we work with", h: "What matters", em: "is not the ticket size",
    lead: "We work with anyone who needs discretion, not only those moving large figures. From a €700,000 apartment to institutional deals, with the same level of confidentiality.",
    perfiles: [
      { t: "Family offices", d: "Long-term wealth, long-term judgement." },
      { t: "Private equity", d: "Opportunities outside competitive processes." },
      { t: "Investors", d: "Capital seeking returns without noise." },
      { t: "Private wealth", d: "Diversification into real assets." },
      { t: "Private buyers", d: "A specific home that is on no portal." },
      { t: "Owners", d: "Selling with absolute discretion." },
    ],
    ticket_label: "Transactions of every size",
    ticket_names: ["Apartment", "Residence", "Landmark apartment", "Building", "Land", "Institutional"],
    situ_label: "Typical situations",
    situaciones: [
      "Selling without anyone knowing the property is for sale.",
      "Starting to move an asset before it goes to market.",
      "Finding exactly what does not appear on any portal.",
    ],
    cierre: "We are not a portal.", cierre_em: "We do not show everything we have.", cta: "Tell us what you are looking for",
  },
};

const fr: ActDict = {
  label: "Actifs · Sélection indicative",
  h1: "Si quelqu'un veut quelque chose,", h2: "nous l'obtenons.",
  lead: "Où qu'il soit. Ceci n'est pas un portail : c'est un petit échantillon du type d'actifs auxquels nous avons accès. Sans adresse ni donnée permettant d'identifier le propriétaire. Le reste se partage en privé.",
  filters: { todos: "Tous", residencial: "Résidentiel", solares: "Terrains", edificios: "Immeubles", singulares: "Singuliers", inversion: "Investissement" },
  ver_todo: "Voir la sélection complète", ver_menos: "Voir moins", info: "Demander des informations", ref: "Réf.",
  note: "Actifs indicatifs. Surfaces, prix et conditions ne sont confirmés que sous accord de confidentialité.",
  encargo_h: "Vous cherchez quelque chose", encargo_em: "qui n'apparaît pas ici ?",
  encargo_sub: "Décrivez-le avec le détail souhaité : quartier, surface, caractéristiques, rendement. Nous le trouvons, où qu'il soit.",
  encargo_ph: "Ex. : penthouse à Chamberí, 4 chambres, terrasse, parking, jusqu'à 2,5 M€",
  encargo_btn: "Confier une recherche",
  assets: {
    r1: { type: "Propriété", place: "Centre de Madrid", specs: ["4 chambres", "Plafonds de 3,8 m", "Chauffage au sol", "Double entrée", "Accès arrière indépendant", "Marbre d'origine"] },
    r2: { type: "Appartement d'exception", place: "Quartier de Salamanca", specs: ["285 m²", "Immeuble de prestige de 1912", "Balcons filants en façade", "Gardien", "2 places de parking", "Orientation sud"] },
    r3: { type: "Appartement", place: "Chamberí", specs: ["3 chambres", "Extérieur, dernier étage", "Rénovation complète d'architecte", "Menuiseries bois d'origine", "Cave"] },
    s1: { type: "Terrain à bâtir", place: "Madrid", kpis: [["Constructibilité", "12 400 m²"], ["Usage", "Résidentiel"], ["Urbanisme", "Approuvé"]], specs: ["Avant-projet pour 140 logements", "Viabilisation réalisée", "Libre de charges"] },
    s2: { type: "Parcelle", place: "Costa del Sol", kpis: [["Parcelle", "4 800 m²"], ["Constructibilité", "0,35 m²/m²"], ["Permis", "Obtenu"]], specs: ["Usage résidentiel individuel", "Vue dégagée sur la mer", "Accès privé"] },
    e1: { type: "Immeuble emblématique", place: "Huesca", specs: ["3 100 m² construits", "Façade en pierre classée", "Compatible usage hôtelier", "Livré vide", "Centre historique"] },
    e2: { type: "Immeuble résidentiel", place: "Centre de Madrid", kpis: [["Surface", "2 650 m²"], ["Lots", "22 + 2 commerces"], ["Libre", "60 %"]], specs: ["Mono-propriété", "Potentiel de repositionnement", "Cour intérieure"] },
    g1: { type: "Propriété singulière", place: "Centre de Madrid", specs: ["Duplex de 190 m²", "Terrasse de 120 m²", "Verrière et staffs d'origine", "Vue sur les toits historiques", "Immeuble du XIXe siècle"] },
    g2: { type: "Domaine", place: "Majorque", specs: ["38 hectares", "Oliveraie centenaire", "Maison de maître du XVIIIe", "Eau propre", "Licence d'agrotourisme"] },
    i1: { type: "Actif d'investissement · Bureaux", place: "Madrid", kpis: [["Occupation", "98 %"], ["WAULT", "6,2 ans"], ["Rendement", "5,4 %"]], specs: ["4 200 m² hors sol", "3 locataires multinationaux", "Certification LEED Gold"] },
    i2: { type: "Hôtel loué", place: "Canaries", kpis: [["Catégorie", "4*"], ["Chambres", "180"], ["Rendement", "6,1 %"]], specs: ["Loué à un opérateur international", "Bail ferme de 15 ans", "Loyer fixe + variable"] },
  },
  clientes: {
    label: "Avec qui nous travaillons", h: "L'essentiel", em: "n'est pas le montant",
    lead: "Nous travaillons avec ceux qui ont besoin de discrétion, pas seulement avec ceux qui déplacent de grandes sommes. D'un appartement à 700 000 € aux opérations institutionnelles, avec la même confidentialité.",
    perfiles: [
      { t: "Family offices", d: "Un patrimoine pensé sur le long terme." },
      { t: "Private equity", d: "Des opportunités hors processus concurrentiel." },
      { t: "Investisseurs", d: "Du capital en quête de rendement, sans bruit." },
      { t: "Patrimoines privés", d: "Diversification en actifs réels." },
      { t: "Acheteurs particuliers", d: "Un bien précis qui n'est sur aucun portail." },
      { t: "Propriétaires", d: "Vendre en toute discrétion." },
    ],
    ticket_label: "Des opérations de toutes tailles",
    ticket_names: ["Appartement", "Propriété", "Appartement d'exception", "Immeuble", "Terrain", "Institutionnel"],
    situ_label: "Situations fréquentes",
    situaciones: [
      "Vendre sans que personne ne sache que le bien est à vendre.",
      "Commencer à proposer un actif avant sa mise sur le marché.",
      "Trouver exactement ce qui n'apparaît sur aucun portail.",
    ],
    cierre: "Nous ne sommes pas un portail.", cierre_em: "Nous ne montrons pas tout ce que nous avons.", cta: "Dites-nous ce que vous cherchez",
  },
};

const de: ActDict = {
  label: "Objekte · Beispielhafte Auswahl",
  h1: "Wenn jemand etwas will,", h2: "beschaffen wir es.",
  lead: "Wo auch immer es ist. Dies ist kein Portal, sondern ein kleiner Ausschnitt der Objekte, zu denen wir Zugang haben. Ohne Adressen, ohne Angaben, die den Eigentümer erkennen lassen. Alles Weitere nur im persönlichen Gespräch.",
  filters: { todos: "Alle", residencial: "Wohnen", solares: "Grundstücke", edificios: "Gebäude", singulares: "Besondere", inversion: "Investment" },
  ver_todo: "Gesamte Auswahl ansehen", ver_menos: "Weniger anzeigen", info: "Informationen anfragen", ref: "Ref.",
  note: "Beispielhafte Objekte. Flächen, Preise und Konditionen werden nur unter Vertraulichkeitsvereinbarung bestätigt.",
  encargo_h: "Sie suchen etwas,", encargo_em: "das hier nicht steht?",
  encargo_sub: "Beschreiben Sie es so genau Sie möchten: Lage, Fläche, Merkmale, Rendite. Wir finden es, wo auch immer es ist.",
  encargo_ph: "z. B. Penthouse in Chamberí, 4 Schlafzimmer, Terrasse, Garage, bis 2,5 Mio. €",
  encargo_btn: "Suchauftrag erteilen",
  assets: {
    r1: { type: "Residenz", place: "Madrid Zentrum", specs: ["4 Schlafzimmer", "3,8 m Deckenhöhe", "Fußbodenheizung", "Zwei Eingänge", "Separater Hinterzugang", "Originaler Marmor"] },
    r2: { type: "Repräsentative Wohnung", place: "Viertel Salamanca", specs: ["285 m²", "Herrschaftlicher Bau von 1912", "Durchgehende Balkone", "Concierge", "2 Stellplätze", "Südausrichtung"] },
    r3: { type: "Wohnung", place: "Chamberí", specs: ["3 Schlafzimmer", "Außenlage, oberstes Geschoss", "Komplettsanierung durch Architekten", "Originale Holzfenster", "Abstellraum"] },
    s1: { type: "Baugrundstück", place: "Madrid", kpis: [["Bebaubare Fläche", "12.400 m²"], ["Nutzung", "Wohnen"], ["Planung", "Genehmigt"]], specs: ["Vorentwurf für 140 Wohnungen", "Erschließung abgeschlossen", "Lastenfrei"] },
    s2: { type: "Grundstück", place: "Costa del Sol", kpis: [["Grundstück", "4.800 m²"], ["Bebaubarkeit", "0,35 m²/m²"], ["Baugenehmigung", "Erteilt"]], specs: ["Einfamilienhausnutzung", "Freier Meerblick", "Privater Zugang"] },
    e1: { type: "Markantes Gebäude", place: "Huesca", specs: ["3.100 m² Bruttofläche", "Denkmalgeschützte Steinfassade", "Hotelnutzung möglich", "Leerstehend übergeben", "Altstadt"] },
    e2: { type: "Wohngebäude", place: "Madrid Zentrum", kpis: [["Fläche", "2.650 m²"], ["Einheiten", "22 + 2 Läden"], ["Leerstand", "60 %"]], specs: ["Nicht aufgeteilt", "Repositionierungspotenzial", "Innenhof"] },
    g1: { type: "Besonderes Objekt", place: "Madrid Zentrum", specs: ["Maisonette mit 190 m²", "Terrasse mit 120 m²", "Originales Oberlicht und Stuck", "Blick über historische Dächer", "Gebäude aus dem 19. Jh."] },
    g2: { type: "Finca", place: "Mallorca", specs: ["38 Hektar", "Jahrhundertealter Olivenhain", "Haupthaus aus dem 18. Jh.", "Eigene Wasserversorgung", "Agrotourismus-Lizenz"] },
    i1: { type: "Investment · Büro", place: "Madrid", kpis: [["Vermietung", "98 %"], ["WAULT", "6,2 Jahre"], ["Rendite", "5,4 %"]], specs: ["4.200 m² oberirdisch", "3 multinationale Mieter", "LEED Gold zertifiziert"] },
    i2: { type: "Vermietetes Hotel", place: "Kanaren", kpis: [["Kategorie", "4*"], ["Zimmer", "180"], ["Rendite", "6,1 %"]], specs: ["An internationalen Betreiber verpachtet", "15 Jahre Festlaufzeit", "Fix- + Umsatzpacht"] },
  },
  clientes: {
    label: "Mit wem wir arbeiten", h: "Entscheidend ist", em: "nicht das Volumen",
    lead: "Wir arbeiten mit allen, die Diskretion brauchen, nicht nur mit denen, die große Summen bewegen. Von der Wohnung für 700.000 € bis zur institutionellen Transaktion, mit derselben Vertraulichkeit.",
    perfiles: [
      { t: "Family Offices", d: "Vermögen mit langfristigem Blick." },
      { t: "Private Equity", d: "Gelegenheiten außerhalb von Bieterverfahren." },
      { t: "Investoren", d: "Kapital, das Rendite ohne Aufsehen sucht." },
      { t: "Privatvermögen", d: "Diversifikation in Sachwerte." },
      { t: "Private Käufer", d: "Ein bestimmtes Zuhause, das auf keinem Portal steht." },
      { t: "Eigentümer", d: "Verkaufen mit absoluter Diskretion." },
    ],
    ticket_label: "Transaktionen jeder Größe",
    ticket_names: ["Wohnung", "Residenz", "Repräsentative Wohnung", "Gebäude", "Grundstück", "Institutionell"],
    situ_label: "Typische Situationen",
    situaciones: [
      "Verkaufen, ohne dass jemand erfährt, dass die Immobilie zum Verkauf steht.",
      "Ein Objekt vermarkten, bevor es an den Markt geht.",
      "Genau das finden, was auf keinem Portal erscheint.",
    ],
    cierre: "Wir sind kein Portal.", cierre_em: "Wir zeigen nicht alles, was wir haben.", cta: "Sagen Sie uns, was Sie suchen",
  },
};

const it: ActDict = {
  label: "Attivi · Selezione indicativa",
  h1: "Se qualcuno vuole qualcosa,", h2: "lo otteniamo.",
  lead: "Ovunque si trovi. Questo non è un portale: è un piccolo campione del tipo di attivi a cui abbiamo accesso. Senza indirizzi né dati che identifichino il proprietario. Il resto si condivide in privato.",
  filters: { todos: "Tutti", residencial: "Residenziale", solares: "Terreni", edificios: "Edifici", singulares: "Singolari", inversion: "Investimento" },
  ver_todo: "Vedi la selezione completa", ver_menos: "Mostra meno", info: "Richiedi informazioni", ref: "Rif.",
  note: "Attivi indicativi. Superfici, prezzi e condizioni si confermano solo sotto accordo di riservatezza.",
  encargo_h: "Cerca qualcosa", encargo_em: "che non compare qui?",
  encargo_sub: "Lo descriva con il dettaglio che preferisce: zona, superficie, caratteristiche, rendimento. Lo troviamo, ovunque sia.",
  encargo_ph: "Es.: attico a Chamberí, 4 camere, terrazza, box, fino a 2,5 M€",
  encargo_btn: "Affidare una ricerca",
  assets: {
    r1: { type: "Proprietà", place: "Centro di Madrid", specs: ["4 camere", "Soffitti di 3,8 m", "Riscaldamento a pavimento", "Doppio ingresso", "Accesso posteriore indipendente", "Marmo originale"] },
    r2: { type: "Appartamento di prestigio", place: "Quartiere Salamanca", specs: ["285 m²", "Palazzo signorile del 1912", "Balconi continui in facciata", "Portineria", "2 posti auto", "Esposizione sud"] },
    r3: { type: "Appartamento", place: "Chamberí", specs: ["3 camere", "Esterno, ultimo piano", "Ristrutturazione integrale d'autore", "Infissi in legno originali", "Cantina"] },
    s1: { type: "Area edificabile", place: "Madrid", kpis: [["Edificabilità", "12.400 m²"], ["Destinazione", "Residenziale"], ["Pianificazione", "Approvata"]], specs: ["Progetto di massima per 140 unità", "Urbanizzazione completata", "Libero da gravami"] },
    s2: { type: "Lotto", place: "Costa del Sol", kpis: [["Lotto", "4.800 m²"], ["Edificabilità", "0,35 m²/m²"], ["Permesso", "Rilasciato"]], specs: ["Residenziale unifamiliare", "Vista mare aperta", "Accesso privato"] },
    e1: { type: "Edificio emblematico", place: "Huesca", specs: ["3.100 m² costruiti", "Facciata in pietra vincolata", "Compatibile con uso alberghiero", "Consegnato libero", "Centro storico"] },
    e2: { type: "Edificio residenziale", place: "Centro di Madrid", kpis: [["Superficie", "2.650 m²"], ["Unità", "22 + 2 negozi"], ["Libero", "60%"]], specs: ["Proprietà indivisa", "Potenziale di riposizionamento", "Cortile interno"] },
    g1: { type: "Proprietà singolare", place: "Centro di Madrid", specs: ["Duplex di 190 m²", "Terrazza di 120 m²", "Lucernario e stucchi originali", "Vista sui tetti storici", "Edificio dell'Ottocento"] },
    g2: { type: "Tenuta", place: "Maiorca", specs: ["38 ettari", "Uliveto secolare", "Casa padronale del Settecento", "Acqua propria", "Licenza agrituristica"] },
    i1: { type: "Investimento · Uffici", place: "Madrid", kpis: [["Occupazione", "98%"], ["WAULT", "6,2 anni"], ["Rendimento", "5,4%"]], specs: ["4.200 m² fuori terra", "3 inquilini multinazionali", "Certificazione LEED Gold"] },
    i2: { type: "Hotel a reddito", place: "Canarie", kpis: [["Categoria", "4*"], ["Camere", "180"], ["Yield", "6,1%"]], specs: ["Locato a operatore internazionale", "15 anni di durata vincolata", "Canone fisso + variabile"] },
  },
  clientes: {
    label: "Con chi lavoriamo", h: "Ciò che conta", em: "non è l'importo",
    lead: "Lavoriamo con chi ha bisogno di discrezione, non solo con chi muove grandi cifre. Da un appartamento da 700.000 € a operazioni istituzionali, con la stessa riservatezza.",
    perfiles: [
      { t: "Family office", d: "Patrimoni con visione di lungo periodo." },
      { t: "Private equity", d: "Opportunità fuori da processi competitivi." },
      { t: "Investitori", d: "Capitale che cerca rendimento senza rumore." },
      { t: "Patrimoni privati", d: "Diversificazione in attivi reali." },
      { t: "Acquirenti privati", d: "Una casa precisa che non è su nessun portale." },
      { t: "Proprietari", d: "Vendere con assoluta discrezione." },
    ],
    ticket_label: "Operazioni di ogni dimensione",
    ticket_names: ["Appartamento", "Proprietà", "Appartamento di prestigio", "Edificio", "Terreno", "Istituzionale"],
    situ_label: "Situazioni frequenti",
    situaciones: [
      "Vendere senza che nessuno sappia che l'immobile è in vendita.",
      "Iniziare a proporre un attivo prima di portarlo sul mercato.",
      "Trovare esattamente ciò che non compare su nessun portale.",
    ],
    cierre: "Non siamo un portale.", cierre_em: "Non mostriamo tutto ciò che abbiamo.", cta: "Ci dica cosa cerca",
  },
};

const pt: ActDict = {
  label: "Ativos · Seleção indicativa",
  h1: "Se alguém quer algo,", h2: "nós conseguimos.",
  lead: "Esteja onde estiver. Isto não é um portal: é uma pequena amostra do tipo de ativos a que temos acesso. Sem moradas nem dados que identifiquem o proprietário. O resto partilha-se em privado.",
  filters: { todos: "Todos", residencial: "Residencial", solares: "Terrenos", edificios: "Edifícios", singulares: "Singulares", inversion: "Investimento" },
  ver_todo: "Ver a seleção completa", ver_menos: "Ver menos", info: "Pedir informação", ref: "Ref.",
  note: "Ativos indicativos. Áreas, preços e condições só se confirmam sob acordo de confidencialidade.",
  encargo_h: "Procura algo", encargo_em: "que não aparece aqui?",
  encargo_sub: "Descreva-o com o detalhe que quiser: zona, área, características, rentabilidade. Encontramo-lo, esteja onde estiver.",
  encargo_ph: "Ex.: penthouse em Chamberí, 4 quartos, terraço, garagem, até 2,5 M€",
  encargo_btn: "Encomendar pesquisa",
  assets: {
    r1: { type: "Propriedade", place: "Centro de Madrid", specs: ["4 quartos", "Pé-direito de 3,8 m", "Piso radiante", "Dupla entrada", "Acesso traseiro independente", "Mármore original"] },
    r2: { type: "Apartamento emblemático", place: "Bairro de Salamanca", specs: ["285 m²", "Edifício senhorial de 1912", "Varandas corridas na fachada", "Portaria", "2 lugares de garagem", "Orientação sul"] },
    r3: { type: "Apartamento", place: "Chamberí", specs: ["3 quartos", "Exterior, último piso", "Remodelação integral de autor", "Caixilharia de madeira original", "Arrecadação"] },
    s1: { type: "Terreno urbano", place: "Madrid", kpis: [["Edificabilidade", "12.400 m²"], ["Uso", "Residencial"], ["Planeamento", "Aprovado"]], specs: ["Projeto base para 140 fogos", "Infraestruturas executadas", "Livre de ónus"] },
    s2: { type: "Lote", place: "Costa del Sol", kpis: [["Lote", "4.800 m²"], ["Edificabilidade", "0,35 m²/m²"], ["Licença", "Concedida"]], specs: ["Moradia unifamiliar", "Vista de mar desafogada", "Acesso privado"] },
    e1: { type: "Edifício emblemático", place: "Huesca", specs: ["3.100 m² de construção", "Fachada em pedra classificada", "Compatível com uso hoteleiro", "Entregue devoluto", "Centro histórico"] },
    e2: { type: "Edifício residencial", place: "Centro de Madrid", kpis: [["Área", "2.650 m²"], ["Frações", "22 + 2 lojas"], ["Devoluto", "60%"]], specs: ["Propriedade vertical", "Potencial de reposicionamento", "Logradouro interior"] },
    g1: { type: "Propriedade singular", place: "Centro de Madrid", specs: ["Duplex de 190 m²", "Terraço de 120 m²", "Claraboia e estuques originais", "Vista sobre telhados históricos", "Edifício do séc. XIX"] },
    g2: { type: "Quinta", place: "Maiorca", specs: ["38 hectares", "Olival centenário", "Casa principal do séc. XVIII", "Água própria", "Licença de agroturismo"] },
    i1: { type: "Ativo de investimento · Escritórios", place: "Madrid", kpis: [["Ocupação", "98%"], ["WAULT", "6,2 anos"], ["Rentabilidade", "5,4%"]], specs: ["4.200 m² acima do solo", "3 inquilinos multinacionais", "Certificação LEED Gold"] },
    i2: { type: "Hotel arrendado", place: "Canárias", kpis: [["Categoria", "4*"], ["Quartos", "180"], ["Yield", "6,1%"]], specs: ["Arrendado a operador internacional", "15 anos de prazo obrigatório", "Renda fixa + variável"] },
  },
  clientes: {
    label: "Com quem trabalhamos", h: "O importante", em: "não é o ticket",
    lead: "Trabalhamos com quem precisa de discrição, não só com quem movimenta grandes valores. De um apartamento de 700.000 € a operações institucionais, com o mesmo nível de reserva.",
    perfiles: [
      { t: "Family offices", d: "Património com visão de longo prazo." },
      { t: "Private equity", d: "Oportunidades fora de processos competitivos." },
      { t: "Investidores", d: "Capital que procura rentabilidade sem ruído." },
      { t: "Patrimónios privados", d: "Diversificação em ativos reais." },
      { t: "Compradores particulares", d: "Uma casa concreta que não está em nenhum portal." },
      { t: "Proprietários", d: "Vender com absoluta discrição." },
    ],
    ticket_label: "Operações de todas as dimensões",
    ticket_names: ["Apartamento", "Propriedade", "Apartamento emblemático", "Edifício", "Terreno", "Institucional"],
    situ_label: "Situações habituais",
    situaciones: [
      "Vender sem que ninguém saiba que o imóvel está à venda.",
      "Começar a mover um ativo antes de o colocar no mercado.",
      "Encontrar exatamente o que não aparece em nenhum portal.",
    ],
    cierre: "Não somos um portal.", cierre_em: "Não mostramos tudo o que temos.", cta: "Diga-nos o que procura",
  },
};

const ru: ActDict = {
  label: "Активы · Ориентировочная подборка",
  h1: "Если кто-то чего-то хочет,", h2: "мы это находим.",
  lead: "Где бы это ни было. Это не портал, а небольшая выборка активов, к которым у нас есть доступ. Без адресов и данных, по которым можно узнать владельца. Остальное — только лично.",
  filters: { todos: "Все", residencial: "Жильё", solares: "Участки", edificios: "Здания", singulares: "Уникальные", inversion: "Инвестиции" },
  ver_todo: "Показать всю подборку", ver_menos: "Свернуть", info: "Запросить информацию", ref: "Реф.",
  note: "Ориентировочные активы. Площади, цены и условия подтверждаются только по соглашению о конфиденциальности.",
  encargo_h: "Ищете то,", encargo_em: "чего здесь нет?",
  encargo_sub: "Опишите так подробно, как хотите: район, площадь, характеристики, доходность. Мы найдём, где бы это ни было.",
  encargo_ph: "Напр.: пентхаус в Чамбери, 4 спальни, терраса, гараж, до 2,5 млн €",
  encargo_btn: "Заказать поиск",
  assets: {
    r1: { type: "Резиденция", place: "Центр Мадрида", specs: ["4 спальни", "Потолки 3,8 м", "Тёплый пол", "Два подъезда", "Отдельный задний вход", "Оригинальный мрамор"] },
    r2: { type: "Статусная квартира", place: "Район Саламанка", specs: ["285 м²", "Исторический дом 1912 года", "Сквозные балконы по фасаду", "Консьерж", "2 машиноместа", "Южная сторона"] },
    r3: { type: "Квартира", place: "Чамбери", specs: ["3 спальни", "Окна на улицу, верхний этаж", "Авторский капитальный ремонт", "Оригинальные деревянные окна", "Кладовая"] },
    s1: { type: "Участок под застройку", place: "Мадрид", kpis: [["Площадь застройки", "12 400 м²"], ["Назначение", "Жильё"], ["Градплан", "Утверждён"]], specs: ["Эскизный проект на 140 квартир", "Инженерные сети подведены", "Без обременений"] },
    s2: { type: "Участок", place: "Коста-дель-Соль", kpis: [["Участок", "4 800 м²"], ["Коэф. застройки", "0,35 м²/м²"], ["Разрешение", "Получено"]], specs: ["Под частный дом", "Открытый вид на море", "Частный подъезд"] },
    e1: { type: "Знаковое здание", place: "Уэска", specs: ["3 100 м²", "Охраняемый каменный фасад", "Подходит под отель", "Передаётся пустым", "Исторический центр"] },
    e2: { type: "Жилое здание", place: "Центр Мадрида", kpis: [["Площадь", "2 650 м²"], ["Единицы", "22 + 2 помещения"], ["Свободно", "60%"]], specs: ["Единый собственник", "Потенциал репозиционирования", "Внутренний двор"] },
    g1: { type: "Уникальный объект", place: "Центр Мадрида", specs: ["Дуплекс 190 м²", "Терраса 120 м²", "Оригинальный фонарь и лепнина", "Вид на исторические крыши", "Здание XIX века"] },
    g2: { type: "Поместье", place: "Майорка", specs: ["38 гектаров", "Вековая оливковая роща", "Главный дом XVIII века", "Собственная вода", "Лицензия агротуризма"] },
    i1: { type: "Инвестиционный актив · Офисы", place: "Мадрид", kpis: [["Заполняемость", "98%"], ["WAULT", "6,2 года"], ["Доходность", "5,4%"]], specs: ["4 200 м² надземной площади", "3 международных арендатора", "Сертификат LEED Gold"] },
    i2: { type: "Доходный отель", place: "Канары", kpis: [["Категория", "4*"], ["Номера", "180"], ["Доходность", "6,1%"]], specs: ["В аренде у международного оператора", "15 лет без права досрочного выхода", "Фиксированная + переменная аренда"] },
  },
  clientes: {
    label: "С кем мы работаем", h: "Главное —", em: "не размер сделки",
    lead: "Мы работаем со всеми, кому важна конфиденциальность, а не только с теми, кто оперирует крупными суммами. От квартиры за 700 000 € до институциональных сделок — с одинаковой закрытостью.",
    perfiles: [
      { t: "Семейные офисы", d: "Капитал с долгосрочным горизонтом." },
      { t: "Private equity", d: "Сделки вне конкурсных процедур." },
      { t: "Инвесторы", d: "Капитал, ищущий доходность без шума." },
      { t: "Частный капитал", d: "Диверсификация в реальные активы." },
      { t: "Частные покупатели", d: "Конкретное жильё, которого нет ни на одном портале." },
      { t: "Собственники", d: "Продажа с абсолютной конфиденциальностью." },
    ],
    ticket_label: "Сделки любого масштаба",
    ticket_names: ["Квартира", "Резиденция", "Статусная квартира", "Здание", "Участок", "Институциональная"],
    situ_label: "Типичные ситуации",
    situaciones: [
      "Продать так, чтобы никто не узнал, что объект продаётся.",
      "Начать предлагать актив до выхода на рынок.",
      "Найти именно то, чего нет ни на одном портале.",
    ],
    cierre: "Мы не портал.", cierre_em: "Мы показываем не всё, что у нас есть.", cta: "Расскажите, что вы ищете",
  },
};

const ar: ActDict = {
  label: "الأصول · مختارات استرشادية",
  h1: "إذا أراد أحدٌ شيئاً،", h2: "نحصل عليه.",
  lead: "أينما كان. هذه ليست بوابة عقارية، بل عيّنة صغيرة من نوع الأصول التي نصل إليها. بلا عناوين ولا بيانات تكشف المالك. وما تبقّى يُشارك بشكل خاص.",
  filters: { todos: "الكل", residencial: "سكني", solares: "أراضٍ", edificios: "مبانٍ", singulares: "فريدة", inversion: "استثمار" },
  ver_todo: "عرض المختارات كاملة", ver_menos: "عرض أقل", info: "طلب معلومات", ref: "مرجع",
  note: "أصول استرشادية. تُؤكَّد المساحات والأسعار والشروط فقط بموجب اتفاقية سرية.",
  encargo_h: "تبحث عن شيء", encargo_em: "غير معروض هنا؟",
  encargo_sub: "صِفه بالتفصيل الذي تريده: المنطقة، المساحة، المواصفات، العائد. سنجده أينما كان.",
  encargo_ph: "مثال: بنتهاوس في تشامبيري، 4 غرف نوم، شرفة، موقف، حتى 2.5 مليون €",
  encargo_btn: "طلب بحث",
  assets: {
    r1: { type: "عقار", place: "وسط مدريد", specs: ["4 غرف نوم", "أسقف بارتفاع 3.8 م", "تدفئة أرضية", "مدخلان", "مدخل خلفي مستقل", "رخام أصلي"] },
    r2: { type: "شقة مميزة", place: "حي سالامانكا", specs: ["285 م²", "مبنى عريق من عام 1912", "شرفات ممتدة على الواجهة", "بوّاب", "موقفان للسيارات", "واجهة جنوبية"] },
    r3: { type: "شقة", place: "تشامبيري", specs: ["3 غرف نوم", "خارجية، الطابق الأخير", "تجديد كامل بتوقيع معماري", "نوافذ خشبية أصلية", "مخزن"] },
    s1: { type: "أرض للتطوير", place: "مدريد", kpis: [["مساحة البناء", "12,400 م²"], ["الاستخدام", "سكني"], ["التخطيط", "معتمد"]], specs: ["تصميم أولي لـ140 وحدة سكنية", "البنية التحتية منفذة", "خالية من الأعباء"] },
    s2: { type: "قطعة أرض", place: "كوستا ديل سول", kpis: [["المساحة", "4,800 م²"], ["معامل البناء", "0.35 م²/م²"], ["الترخيص", "ممنوح"]], specs: ["سكن عائلي مستقل", "إطلالة مفتوحة على البحر", "مدخل خاص"] },
    e1: { type: "مبنى مميز", place: "ويسكا", specs: ["3,100 م² مبنية", "واجهة حجرية محمية", "مناسب للاستخدام الفندقي", "يُسلَّم شاغراً", "المركز التاريخي"] },
    e2: { type: "مبنى سكني", place: "وسط مدريد", kpis: [["المساحة", "2,650 م²"], ["الوحدات", "22 + 2 محلات"], ["شاغر", "60%"]], specs: ["ملكية واحدة غير مقسّمة", "إمكانية إعادة التموضع", "فناء داخلي"] },
    g1: { type: "عقار فريد", place: "وسط مدريد", specs: ["دوبلكس 190 م²", "شرفة 120 م²", "كوة سقفية وزخارف جصية أصلية", "إطلالة على الأسطح التاريخية", "مبنى من القرن التاسع عشر"] },
    g2: { type: "ضيعة", place: "مايوركا", specs: ["38 هكتاراً", "بستان زيتون معمّر", "منزل رئيسي من القرن الثامن عشر", "مصدر مياه خاص", "ترخيص سياحة ريفية"] },
    i1: { type: "أصل استثماري · مكاتب", place: "مدريد", kpis: [["الإشغال", "98%"], ["WAULT", "6.2 سنوات"], ["العائد", "5.4%"]], specs: ["4,200 م² فوق الأرض", "3 مستأجرين متعددي الجنسيات", "شهادة LEED الذهبية"] },
    i2: { type: "فندق مُدرّ للدخل", place: "جزر الكناري", kpis: [["الفئة", "4*"], ["الغرف", "180"], ["العائد", "6.1%"]], specs: ["مؤجّر لمشغّل دولي", "15 سنة التزام إلزامي", "إيجار ثابت + متغير"] },
  },
  clientes: {
    label: "مع من نعمل", h: "المهم", em: "ليس حجم الصفقة",
    lead: "نعمل مع كل من يحتاج إلى السرية، لا مع من يحرّك مبالغ كبيرة فقط. من شقة بقيمة 700,000 € إلى الصفقات المؤسسية، بنفس مستوى الكتمان.",
    perfiles: [
      { t: "المكاتب العائلية", d: "ثروات برؤية طويلة الأمد." },
      { t: "الملكية الخاصة", d: "فرص خارج المزادات التنافسية." },
      { t: "المستثمرون", d: "رأس مال يبحث عن العائد بلا ضجيج." },
      { t: "الثروات الخاصة", d: "تنويع في الأصول الحقيقية." },
      { t: "المشترون الأفراد", d: "مسكن محدد لا يوجد في أي بوابة." },
      { t: "الملّاك", d: "بيع بسرية تامة." },
    ],
    ticket_label: "صفقات بجميع الأحجام",
    ticket_names: ["شقة", "عقار", "شقة مميزة", "مبنى", "أرض", "مؤسسية"],
    situ_label: "حالات شائعة",
    situaciones: [
      "البيع دون أن يعلم أحد أن العقار معروض للبيع.",
      "البدء في تسويق أصل قبل طرحه في السوق.",
      "إيجاد ما لا يظهر في أي بوابة تماماً.",
    ],
    cierre: "لسنا بوابة عقارية.", cierre_em: "لا نعرض كل ما لدينا.", cta: "أخبرنا بما تبحث عنه",
  },
};

const zh: ActDict = {
  label: "资产 · 示例精选",
  h1: "只要有人想要，", h2: "我们就能找到。",
  lead: "无论它在哪里。这里不是房产平台，只是我们可接触资产类型的一小部分示例。不公开地址，也不透露任何可识别业主的信息。其余内容仅私下分享。",
  filters: { todos: "全部", residencial: "住宅", solares: "土地", edificios: "整栋", singulares: "特色", inversion: "投资" },
  ver_todo: "查看完整示例", ver_menos: "收起", info: "索取资料", ref: "编号",
  note: "以上为示例资产。面积、价格及条件仅在签署保密协议后确认。",
  encargo_h: "您要找的", encargo_em: "不在这里？",
  encargo_sub: "尽可详细描述：区域、面积、特征、回报率。无论在哪里，我们都会为您找到。",
  encargo_ph: "例如：Chamberí 顶层公寓，4 卧室，露台，车位，250 万欧元以内",
  encargo_btn: "委托寻找",
  assets: {
    r1: { type: "住宅", place: "马德里市中心", specs: ["4 间卧室", "3.8 米层高", "地暖", "双入口", "独立后门", "原始大理石"] },
    r2: { type: "标志性公寓", place: "萨拉曼卡区", specs: ["285 平方米", "1912 年古典建筑", "通长立面阳台", "专职门房", "2 个车位", "朝南"] },
    r3: { type: "公寓", place: "Chamberí", specs: ["3 间卧室", "临街顶层", "建筑师全面翻新", "原木窗框", "储藏室"] },
    s1: { type: "开发用地", place: "马德里", kpis: [["可建面积", "12,400 m²"], ["用途", "住宅"], ["规划", "已批准"]], specs: ["140 套住宅初步设计", "基础设施已完成", "无产权负担"] },
    s2: { type: "地块", place: "太阳海岸", kpis: [["地块", "4,800 m²"], ["容积率", "0.35"], ["许可证", "已获批"]], specs: ["独栋住宅用途", "开阔海景", "私人通道"] },
    e1: { type: "标志性建筑", place: "韦斯卡", specs: ["建筑面积 3,100 平方米", "受保护石材立面", "可改作酒店", "空置交付", "历史中心"] },
    e2: { type: "住宅楼", place: "马德里市中心", kpis: [["面积", "2,650 m²"], ["单元", "22 套 + 2 商铺"], ["空置", "60%"]], specs: ["整栋单一产权", "具备重新定位潜力", "内庭院"] },
    g1: { type: "特色物业", place: "马德里市中心", specs: ["190 平方米复式", "120 平方米露台", "原始天窗与石膏装饰", "俯瞰历史屋顶", "19 世纪建筑"] },
    g2: { type: "庄园", place: "马略卡", specs: ["38 公顷", "百年橄榄园", "18 世纪主宅", "自有水源", "农旅许可证"] },
    i1: { type: "投资资产 · 写字楼", place: "马德里", kpis: [["出租率", "98%"], ["WAULT", "6.2 年"], ["回报率", "5.4%"]], specs: ["地上 4,200 平方米", "3 家跨国租户", "LEED 金级认证"] },
    i2: { type: "收益型酒店", place: "加那利群岛", kpis: [["等级", "4 星"], ["客房", "180"], ["回报率", "6.1%"]], specs: ["租予国际酒店运营商", "15 年不可撤销租期", "固定 + 浮动租金"] },
  },
  clientes: {
    label: "我们的客户", h: "重要的", em: "不是交易金额",
    lead: "我们服务所有需要保密的人，而不仅是动辄数千万的买家。从 70 万欧元的公寓到机构级交易，保密标准始终如一。",
    perfiles: [
      { t: "家族办公室", d: "着眼长远的财富管理。" },
      { t: "私募股权", d: "竞争性流程之外的机会。" },
      { t: "投资者", d: "低调寻求回报的资本。" },
      { t: "私人财富", d: "配置实物资产、分散风险。" },
      { t: "个人买家", d: "寻找任何平台上都没有的特定住宅。" },
      { t: "业主", d: "以绝对保密的方式出售。" },
    ],
    ticket_label: "各种规模的交易",
    ticket_names: ["公寓", "住宅", "标志性公寓", "整栋", "土地", "机构级"],
    situ_label: "常见情形",
    situaciones: [
      "出售物业，却不让任何人知道它在出售。",
      "在公开上市前先行推介资产。",
      "找到任何平台上都没有的那一处。",
    ],
    cierre: "我们不是房产平台。", cierre_em: "我们不会展示所有资源。", cta: "告诉我们您在找什么",
  },
};

export const ACT: Record<Lang, ActDict> = { es, en, fr, de, it, pt, ru, ar, zh };
