// ============================================
// TRADUCCIONES — todo el texto visible de la web vive aquí.
// Si añades un texto nuevo, añádelo en los 9 idiomas.
// ============================================

export type Lang = "es" | "en" | "fr" | "de" | "it" | "pt" | "ru" | "ar" | "zh";

export type AssetKey = "edificio" | "hotel" | "residencial" | "terreno" | "singular";
export type DestKey = "madrid" | "barcelona" | "marbella" | "paris" | "gstaad" | "londres";

export type Dict = {
  tagline: string;
  nav: { activos: string; destinos: string; firma: string; vender: string; contacto: string; menu: string; cerrar: string };
  hero_sub: string;
  scroll: string;
  search: {
    abrir: string; explorar: string; comprar: string; vender: string;
    ubicacion: string; ubicacion_ph: string; tipo: string; seleccionar: string; rango: string; continuar: string; cerrar: string;
  };
  assetOptions: Record<AssetKey, string>;
  activos: { label: string; title: string; note: string; price: string; prev: string; next: string };
  properties: { tag: string; title: string; meta: string }[];
  tipologias: { label: string; h: string; em: string; items: { name: string; desc: string }[] };
  extra: { label: string; title: string; body: string; note: string; cta: string; only: string; badge: string };
  destinos: { label: string; h: string; em: string; desc: string; items: Record<DestKey, { title: string; tag: string; desc: string }> };
  firma: { label: string; h: string; em: string; body: string; btn_contacto: string; btn_valoracion: string };
  vender: { label: string; h: string; em: string; desc: string; placeholder: string; btn: string };
  contacto: {
    label: string; h: string; em: string; desc: string; email_label: string;
    nombre: string; email: string; telefono: string;
    interes: string; comprar: string; vender: string; quitar: string;
    consent_pre: string; consent_link: string; enviar: string; enviando: string;
    ok: string; error: string; required: string; consent_required: string;
  };
  faq: { label: string; h: string; em: string; items: { q: string; a: string }[] };
  footer: {
    desc: string; col_destinos: string; col_activos: string; col_firma: string; col_contacto: string; col_legal: string;
    firma_links: { firma: string; faq: string; vender: string; contacto: string };
    aviso: string; privacidad: string; cookies: string; rights: string;
  };
};

const es: Dict = {
  tagline: "Off-market. On-point.",
  nav: { activos: "Activos", destinos: "Destinos", firma: "La firma", vender: "Vender", contacto: "Contacto", menu: "Menú", cerrar: "Cerrar" },
  hero_sub: "Off-Market Real Estate · Madrid · International",
  scroll: "Scroll",
  search: {
    abrir: "¿Qué tipo de operación busca?", explorar: "Explorar", comprar: "Comprar", vender: "Vender",
    ubicacion: "Ubicación", ubicacion_ph: "Madrid, España, Europa…", tipo: "Tipo de activo", seleccionar: "Seleccionar…",
    rango: "Rango de inversión", continuar: "Continuar", cerrar: "Cerrar",
  },
  assetOptions: { edificio: "Edificio", hotel: "Hotel / Hospitality", residencial: "Residencial de lujo", terreno: "Solar / Terreno", singular: "Activo singular" },
  activos: {
    label: "Selección actual", title: "Activos destacados",
    note: "Esta es la selección que podemos mostrar. Las operaciones que no aparecen aquí requieren una conversación.",
    price: "Precio bajo consulta", prev: "Anterior", next: "Siguiente",
  },
  properties: [
    { tag: "Madrid · Chueca", title: "Residencia de diseño", meta: "Gran lujo · Interiorismo de autor" },
    { tag: "Barcelona · Gràcia", title: "Ático con terraza privada", meta: "Terraza · Piscina · Vistas" },
    { tag: "Madrid · Plaza Mayor", title: "Piso señorial reformado", meta: "Centro histórico · Diseño contemporáneo" },
  ],
  tipologias: {
    label: "Tipologías", h: "Qué", em: "gestionamos",
    items: [
      { name: "Solares", desc: "Parcelas urbanas estratégicas" },
      { name: "Terrenos", desc: "Fincas y terrenos rústicos" },
      { name: "Edificios", desc: "Edificios completos y señoriales" },
      { name: "Hoteles", desc: "Hoteles boutique y de lujo" },
      { name: "Cadenas hoteleras", desc: "Portfolios y cadenas en expansión" },
      { name: "Gran lujo", desc: "Villas y mansiones de alto standing" },
      { name: "Activos singulares", desc: "Palacios, fincas históricas y patrimonio" },
      { name: "Off market", desc: "Lo que no está en ningún portal" },
    ],
  },
  extra: {
    label: "Más allá del inmobiliario", title: "Yates y aviación privada",
    body: "Compraventa y chárter de yates, aviones privados y otros activos de alto valor. Operaciones gestionadas con la misma discreción que un edificio o un hotel.",
    note: "Servicio exclusivo bajo cita previa. Cada solicitud se gestiona de forma privada y confidencial.",
    cta: "Solicitar acceso", only: "Solo cita", badge: "Bajo solicitud",
  },
  destinos: {
    label: "Destinos", h: "Presencia global,", em: "cierre local",
    desc: "Foco principal en Madrid, con operaciones en toda España, Europa y mercados internacionales cuando la operación lo requiere.",
    items: {
      madrid: { title: "MADRID", tag: "Centro de operaciones", desc: "El Viso, Salamanca, Castellana, Chamberí" },
      barcelona: { title: "BARCELONA", tag: "Activos premium", desc: "Eixample, Pedralbes, Sarrià, Diagonal Mar" },
      marbella: { title: "MARBELLA", tag: "Costa del Sol", desc: "La Zagaleta, Sierra Blanca, Puerto Banús" },
      paris: { title: "PARÍS", tag: "Internacional", desc: "XVI arrondissement, Saint-Germain, Marais" },
      gstaad: { title: "GSTAAD", tag: "Alpes suizos", desc: "Chalets exclusivos y estaciones de esquí" },
      londres: { title: "LONDRES", tag: "Capital financiera", desc: "Mayfair, Belgravia, Knightsbridge, Chelsea" },
    },
  },
  firma: {
    label: "La firma", h: "Intermediación en", em: "operaciones off-market de alto valor",
    body: "Intermediación exclusiva en activos inmobiliarios fuera de mercado. Edificios, hoteles, residencial de lujo y activos singulares entre 1M€ y 200M€. Acceso directo a oportunidades que se mueven entre profesionales bajo acuerdo de confidencialidad.",
    btn_contacto: "Hablemos", btn_valoracion: "Solicitar valoración",
  },
  vender: {
    label: "Vender", h: "Su activo", em: "merece discreción",
    desc: "Valoración profesional y comercialización privada. Sin anuncios, sin portales, sin exposición pública. Solo compradores cualificados bajo acuerdo de confidencialidad.",
    placeholder: "Dirección o zona del activo", btn: "Solicitar valoración",
  },
  contacto: {
    label: "Iniciar conversación", h: "El primer paso es", em: "una llamada",
    desc: "Cada solicitud se revisa personalmente. Si el perfil encaja con alguna operación en curso o en desarrollo, el contacto posterior es directo.",
    email_label: "Email", nombre: "Nombre", email: "Email", telefono: "Teléfono",
    interes: "Su solicitud", comprar: "Compra", vender: "Venta", quitar: "Quitar",
    consent_pre: "He leído y acepto la", consent_link: "política de privacidad",
    enviar: "Enviar solicitud", enviando: "Enviando…",
    ok: "Solicitud recibida. Le contactaremos con la mayor brevedad posible.",
    error: "No se ha podido enviar. Inténtelo de nuevo o escriba a",
    required: "Indique nombre y email.", consent_required: "Debe aceptar la política de privacidad.",
  },
  faq: {
    label: "Preguntas frecuentes", h: "Cómo", em: "trabajamos",
    items: [
      { q: "¿Qué es una operación off-market?", a: "Una compraventa que se negocia de forma privada, sin publicarse en portales ni en medios. El activo solo se presenta a compradores cualificados, identificados previamente y bajo acuerdo de confidencialidad." },
      { q: "¿Por qué vender fuera de mercado?", a: "Discreción y control. Sin exposición pública el activo no se desgasta, no hay rebajas visibles y el propietario decide quién accede a la información. Se evitan visitas no cualificadas y ruido innecesario." },
      { q: "¿Cómo es el proceso?", a: "Una primera conversación para entender el activo o la necesidad de inversión. Después, firma de confidencialidad, análisis y valoración, presentación selectiva a contrapartes verificadas y acompañamiento hasta la firma." },
      { q: "¿Qué activos y rangos gestionan?", a: "Edificios completos, hoteles y cadenas hoteleras, residencial de lujo, solares, terrenos y activos singulares, en operaciones de 1M€ a 200M€. Foco en Madrid, con operaciones en España e internacionales." },
      { q: "¿Cómo se protege la confidencialidad?", a: "La información sensible de cada operación solo se comparte tras la firma de un acuerdo de confidencialidad (NDA). Los datos de cada contacto se tratan de forma privada y no se ceden a terceros sin autorización." },
      { q: "¿También operan con yates y aviones?", a: "Sí. Compraventa y chárter de yates, aviación privada y otros activos de alto valor, siempre bajo cita previa y con el mismo nivel de discreción." },
    ],
  },
  footer: {
    desc: "Intermediación en operaciones inmobiliarias off-market de alto valor. Madrid, España e internacional.",
    col_destinos: "Destinos", col_activos: "Activos", col_firma: "La firma", col_contacto: "Contacto", col_legal: "Legal",
    firma_links: { firma: "La firma", faq: "Preguntas frecuentes", vender: "Vender", contacto: "Contacto" },
    aviso: "Aviso legal", privacidad: "Política de privacidad", cookies: "Política de cookies", rights: "Todos los derechos reservados",
  },
};

const en: Dict = {
  tagline: "Off-market. On-point.",
  nav: { activos: "Assets", destinos: "Locations", firma: "The firm", vender: "Sell", contacto: "Contact", menu: "Menu", cerrar: "Close" },
  hero_sub: "Off-Market Real Estate · Madrid · International",
  scroll: "Scroll",
  search: {
    abrir: "What type of transaction are you looking for?", explorar: "Explore", comprar: "Buy", vender: "Sell",
    ubicacion: "Location", ubicacion_ph: "Madrid, Spain, Europe…", tipo: "Asset type", seleccionar: "Select…",
    rango: "Investment range", continuar: "Continue", cerrar: "Close",
  },
  assetOptions: { edificio: "Building", hotel: "Hotel / Hospitality", residencial: "Luxury residential", terreno: "Plot / Land", singular: "Singular asset" },
  activos: {
    label: "Current selection", title: "Featured assets",
    note: "This is the selection we can show. Transactions not listed here require a conversation.",
    price: "Price on request", prev: "Previous", next: "Next",
  },
  properties: [
    { tag: "Madrid · Chueca", title: "Design residence", meta: "Prime luxury · Signature interiors" },
    { tag: "Barcelona · Gràcia", title: "Penthouse with private terrace", meta: "Terrace · Pool · Views" },
    { tag: "Madrid · Plaza Mayor", title: "Refurbished stately apartment", meta: "Historic centre · Contemporary design" },
  ],
  tipologias: {
    label: "Categories", h: "What we", em: "handle",
    items: [
      { name: "Urban plots", desc: "Strategic urban sites" },
      { name: "Land", desc: "Estates and rural land" },
      { name: "Buildings", desc: "Entire and stately buildings" },
      { name: "Hotels", desc: "Boutique and luxury hotels" },
      { name: "Hotel chains", desc: "Portfolios and growing chains" },
      { name: "Prime luxury", desc: "High-end villas and mansions" },
      { name: "Singular assets", desc: "Palaces, historic estates and heritage" },
      { name: "Off market", desc: "What is on no portal" },
    ],
  },
  extra: {
    label: "Beyond real estate", title: "Yachts and private aviation",
    body: "Sale, purchase and charter of yachts, private jets and other high-value assets. Handled with the same discretion as a building or a hotel.",
    note: "Exclusive service by appointment only. Every request is handled privately and confidentially.",
    cta: "Request access", only: "By appointment", badge: "On request",
  },
  destinos: {
    label: "Locations", h: "Global reach,", em: "local close",
    desc: "Main focus on Madrid, with transactions across Spain, Europe and international markets when the deal requires it.",
    items: {
      madrid: { title: "MADRID", tag: "Base of operations", desc: "El Viso, Salamanca, Castellana, Chamberí" },
      barcelona: { title: "BARCELONA", tag: "Premium assets", desc: "Eixample, Pedralbes, Sarrià, Diagonal Mar" },
      marbella: { title: "MARBELLA", tag: "Costa del Sol", desc: "La Zagaleta, Sierra Blanca, Puerto Banús" },
      paris: { title: "PARIS", tag: "International", desc: "16th arrondissement, Saint-Germain, Marais" },
      gstaad: { title: "GSTAAD", tag: "Swiss Alps", desc: "Exclusive chalets and ski resorts" },
      londres: { title: "LONDON", tag: "Financial capital", desc: "Mayfair, Belgravia, Knightsbridge, Chelsea" },
    },
  },
  firma: {
    label: "The firm", h: "Intermediary in", em: "high-value off-market transactions",
    body: "Exclusive intermediation in off-market real estate. Buildings, hotels, luxury residential and singular assets between €1M and €200M. Direct access to opportunities that move between professionals under confidentiality agreements.",
    btn_contacto: "Let's talk", btn_valoracion: "Request valuation",
  },
  vender: {
    label: "Sell", h: "Your asset", em: "deserves discretion",
    desc: "Professional valuation and private marketing. No listings, no portals, no public exposure. Qualified buyers only, under NDA.",
    placeholder: "Property address or area", btn: "Request valuation",
  },
  contacto: {
    label: "Start a conversation", h: "The first step is", em: "a call",
    desc: "Each request is reviewed personally. If the profile matches an ongoing or upcoming transaction, direct contact follows.",
    email_label: "Email", nombre: "Name", email: "Email", telefono: "Phone",
    interes: "Your request", comprar: "Buy", vender: "Sell", quitar: "Remove",
    consent_pre: "I have read and accept the", consent_link: "privacy policy",
    enviar: "Send request", enviando: "Sending…",
    ok: "Request received. We will contact you shortly.",
    error: "The request could not be sent. Please try again or write to",
    required: "Please enter your name and email.", consent_required: "Please accept the privacy policy.",
  },
  faq: {
    label: "FAQ", h: "How", em: "we work",
    items: [
      { q: "What is an off-market transaction?", a: "A sale negotiated privately, never published on portals or in the media. The asset is only presented to qualified, pre-identified buyers under a confidentiality agreement." },
      { q: "Why sell off-market?", a: "Discretion and control. Without public exposure the asset is not overexposed, there are no visible price cuts and the owner decides who accesses the information." },
      { q: "What does the process look like?", a: "A first conversation to understand the asset or investment need. Then NDA, analysis and valuation, selective presentation to verified counterparties and support through to signing." },
      { q: "Which assets and ranges do you cover?", a: "Entire buildings, hotels and hotel chains, luxury residential, plots, land and singular assets, in transactions from €1M to €200M. Focus on Madrid, with deals across Spain and abroad." },
      { q: "How is confidentiality protected?", a: "Sensitive information is only shared after an NDA is signed. Contact details are handled privately and never passed to third parties without consent." },
      { q: "Do you also handle yachts and aircraft?", a: "Yes. Sale, purchase and charter of yachts, private aviation and other high-value assets, by appointment and with the same level of discretion." },
    ],
  },
  footer: {
    desc: "Intermediary for high-value off-market real estate. Madrid, Spain & international.",
    col_destinos: "Locations", col_activos: "Assets", col_firma: "The firm", col_contacto: "Contact", col_legal: "Legal",
    firma_links: { firma: "The firm", faq: "FAQ", vender: "Sell", contacto: "Contact" },
    aviso: "Legal notice", privacidad: "Privacy policy", cookies: "Cookie policy", rights: "All rights reserved",
  },
};

const fr: Dict = {
  tagline: "Off-market. On-point.",
  nav: { activos: "Actifs", destinos: "Destinations", firma: "La firme", vender: "Vendre", contacto: "Contact", menu: "Menu", cerrar: "Fermer" },
  hero_sub: "Immobilier Off-Market · Madrid · International",
  scroll: "Défiler",
  search: {
    abrir: "Quel type d'opération recherchez-vous ?", explorar: "Explorer", comprar: "Acheter", vender: "Vendre",
    ubicacion: "Emplacement", ubicacion_ph: "Madrid, Espagne, Europe…", tipo: "Type d'actif", seleccionar: "Sélectionner…",
    rango: "Tranche d'investissement", continuar: "Continuer", cerrar: "Fermer",
  },
  assetOptions: { edificio: "Immeuble", hotel: "Hôtel / Hospitality", residencial: "Résidentiel de luxe", terreno: "Parcelle / Terrain", singular: "Actif singulier" },
  activos: {
    label: "Sélection actuelle", title: "Actifs en vedette",
    note: "Voici la sélection que nous pouvons montrer. Les opérations qui n'apparaissent pas ici exigent une conversation.",
    price: "Prix sur demande", prev: "Précédent", next: "Suivant",
  },
  properties: [
    { tag: "Madrid · Chueca", title: "Résidence de design", meta: "Grand luxe · Architecture d'intérieur signée" },
    { tag: "Barcelone · Gràcia", title: "Penthouse avec terrasse privée", meta: "Terrasse · Piscine · Vue" },
    { tag: "Madrid · Plaza Mayor", title: "Appartement de maître rénové", meta: "Centre historique · Design contemporain" },
  ],
  tipologias: {
    label: "Typologies", h: "Ce que nous", em: "gérons",
    items: [
      { name: "Parcelles", desc: "Terrains urbains stratégiques" },
      { name: "Terrains", desc: "Domaines et terrains ruraux" },
      { name: "Immeubles", desc: "Immeubles entiers et de prestige" },
      { name: "Hôtels", desc: "Hôtels boutique et de luxe" },
      { name: "Chaînes hôtelières", desc: "Portefeuilles et chaînes en expansion" },
      { name: "Grand luxe", desc: "Villas et demeures d'exception" },
      { name: "Actifs singuliers", desc: "Palais, domaines historiques et patrimoine" },
      { name: "Off market", desc: "Ce qui n'est sur aucun portail" },
    ],
  },
  extra: {
    label: "Au-delà de l'immobilier", title: "Yachts et aviation privée",
    body: "Achat, vente et affrètement de yachts, jets privés et autres actifs de haute valeur. Avec la même discrétion qu'un immeuble ou un hôtel.",
    note: "Service exclusif sur rendez-vous. Chaque demande est traitée de manière privée et confidentielle.",
    cta: "Demander l'accès", only: "Sur rendez-vous", badge: "Sur demande",
  },
  destinos: {
    label: "Destinations", h: "Présence mondiale,", em: "closing local",
    desc: "Priorité à Madrid, avec des opérations dans toute l'Espagne, en Europe et à l'international lorsque l'opération l'exige.",
    items: {
      madrid: { title: "MADRID", tag: "Centre d'opérations", desc: "El Viso, Salamanca, Castellana, Chamberí" },
      barcelona: { title: "BARCELONE", tag: "Actifs premium", desc: "Eixample, Pedralbes, Sarrià, Diagonal Mar" },
      marbella: { title: "MARBELLA", tag: "Costa del Sol", desc: "La Zagaleta, Sierra Blanca, Puerto Banús" },
      paris: { title: "PARIS", tag: "International", desc: "XVIe arrondissement, Saint-Germain, Marais" },
      gstaad: { title: "GSTAAD", tag: "Alpes suisses", desc: "Chalets d'exception et stations de ski" },
      londres: { title: "LONDRES", tag: "Capitale financière", desc: "Mayfair, Belgravia, Knightsbridge, Chelsea" },
    },
  },
  firma: {
    label: "La firme", h: "Intermédiation en", em: "opérations off-market de haute valeur",
    body: "Intermédiation exclusive d'actifs immobiliers hors marché. Immeubles, hôtels, résidentiel de luxe et actifs singuliers entre 1 M€ et 200 M€. Accès direct à des opportunités qui circulent entre professionnels sous accord de confidentialité.",
    btn_contacto: "Parlons-en", btn_valoracion: "Demander une évaluation",
  },
  vender: {
    label: "Vendre", h: "Votre actif", em: "mérite la discrétion",
    desc: "Évaluation professionnelle et commercialisation privée. Sans annonces, sans portails, sans exposition publique. Uniquement des acheteurs qualifiés sous NDA.",
    placeholder: "Adresse ou zone de l'actif", btn: "Demander une évaluation",
  },
  contacto: {
    label: "Initier une conversation", h: "La première étape est", em: "un appel",
    desc: "Chaque demande est examinée personnellement. Si le profil correspond à une opération en cours ou en préparation, le contact est direct.",
    email_label: "Email", nombre: "Nom", email: "Email", telefono: "Téléphone",
    interes: "Votre demande", comprar: "Achat", vender: "Vente", quitar: "Retirer",
    consent_pre: "J'ai lu et j'accepte la", consent_link: "politique de confidentialité",
    enviar: "Envoyer la demande", enviando: "Envoi…",
    ok: "Demande reçue. Nous vous contacterons dans les plus brefs délais.",
    error: "L'envoi a échoué. Réessayez ou écrivez à",
    required: "Indiquez votre nom et votre email.", consent_required: "Vous devez accepter la politique de confidentialité.",
  },
  faq: {
    label: "Questions fréquentes", h: "Notre", em: "méthode",
    items: [
      { q: "Qu'est-ce qu'une opération off-market ?", a: "Une transaction négociée en privé, sans publication sur les portails ni dans les médias. L'actif n'est présenté qu'à des acheteurs qualifiés, identifiés au préalable et sous accord de confidentialité." },
      { q: "Pourquoi vendre hors marché ?", a: "Discrétion et contrôle. Sans exposition publique, l'actif ne s'use pas, aucune baisse de prix n'est visible et le propriétaire décide qui accède à l'information." },
      { q: "Comment se déroule le processus ?", a: "Un premier échange pour comprendre l'actif ou le besoin d'investissement. Puis NDA, analyse et évaluation, présentation sélective à des contreparties vérifiées et accompagnement jusqu'à la signature." },
      { q: "Quels actifs et quelles tranches ?", a: "Immeubles entiers, hôtels et chaînes hôtelières, résidentiel de luxe, parcelles, terrains et actifs singuliers, pour des opérations de 1 M€ à 200 M€. Priorité à Madrid, avec des opérations en Espagne et à l'international." },
      { q: "Comment la confidentialité est-elle protégée ?", a: "Les informations sensibles ne sont partagées qu'après signature d'un accord de confidentialité (NDA). Les données de contact sont traitées de manière privée et jamais cédées sans autorisation." },
      { q: "Traitez-vous aussi les yachts et les avions ?", a: "Oui. Achat, vente et affrètement de yachts, aviation privée et autres actifs de haute valeur, sur rendez-vous et avec la même discrétion." },
    ],
  },
  footer: {
    desc: "Intermédiaire en opérations immobilières off-market de haute valeur. Madrid, Espagne & international.",
    col_destinos: "Destinations", col_activos: "Actifs", col_firma: "La firme", col_contacto: "Contact", col_legal: "Mentions",
    firma_links: { firma: "La firme", faq: "Questions fréquentes", vender: "Vendre", contacto: "Contact" },
    aviso: "Mentions légales", privacidad: "Politique de confidentialité", cookies: "Politique de cookies", rights: "Tous droits réservés",
  },
};

const de: Dict = {
  tagline: "Off-market. On-point.",
  nav: { activos: "Objekte", destinos: "Standorte", firma: "Über uns", vender: "Verkaufen", contacto: "Kontakt", menu: "Menü", cerrar: "Schließen" },
  hero_sub: "Off-Market Immobilien · Madrid · International",
  scroll: "Scrollen",
  search: {
    abrir: "Welche Art von Transaktion suchen Sie?", explorar: "Entdecken", comprar: "Kaufen", vender: "Verkaufen",
    ubicacion: "Standort", ubicacion_ph: "Madrid, Spanien, Europa…", tipo: "Objekttyp", seleccionar: "Auswählen…",
    rango: "Investitionsrahmen", continuar: "Weiter", cerrar: "Schließen",
  },
  assetOptions: { edificio: "Gebäude", hotel: "Hotel / Hospitality", residencial: "Luxuswohnimmobilie", terreno: "Grundstück", singular: "Besonderes Objekt" },
  activos: {
    label: "Aktuelle Auswahl", title: "Ausgewählte Objekte",
    note: "Dies ist die Auswahl, die wir zeigen können. Alle anderen Transaktionen erfordern ein persönliches Gespräch.",
    price: "Preis auf Anfrage", prev: "Zurück", next: "Weiter",
  },
  properties: [
    { tag: "Madrid · Chueca", title: "Design-Residenz", meta: "Luxus · Innenarchitektur mit Handschrift" },
    { tag: "Barcelona · Gràcia", title: "Penthouse mit privater Terrasse", meta: "Terrasse · Pool · Ausblick" },
    { tag: "Madrid · Plaza Mayor", title: "Renovierte Altbauwohnung", meta: "Historisches Zentrum · Zeitgenössisches Design" },
  ],
  tipologias: {
    label: "Kategorien", h: "Was wir", em: "betreuen",
    items: [
      { name: "Baugrundstücke", desc: "Strategische städtische Flächen" },
      { name: "Land", desc: "Fincas und ländliche Grundstücke" },
      { name: "Gebäude", desc: "Komplette und herrschaftliche Gebäude" },
      { name: "Hotels", desc: "Boutique- und Luxushotels" },
      { name: "Hotelketten", desc: "Portfolios und expandierende Ketten" },
      { name: "Luxus", desc: "Villen und Anwesen der Spitzenklasse" },
      { name: "Besondere Objekte", desc: "Paläste, historische Anwesen und Erbe" },
      { name: "Off market", desc: "Was auf keinem Portal steht" },
    ],
  },
  extra: {
    label: "Jenseits von Immobilien", title: "Yachten und Privatflugzeuge",
    body: "Kauf, Verkauf und Charter von Yachten, Privatjets und anderen hochwertigen Vermögenswerten. Mit derselben Diskretion wie ein Gebäude oder ein Hotel.",
    note: "Exklusiver Service nur nach Vereinbarung. Jede Anfrage wird privat und vertraulich behandelt.",
    cta: "Zugang anfragen", only: "Nur nach Termin", badge: "Auf Anfrage",
  },
  destinos: {
    label: "Standorte", h: "Globale Präsenz,", em: "lokaler Abschluss",
    desc: "Schwerpunkt Madrid, mit Transaktionen in ganz Spanien, Europa und international, wenn das Geschäft es erfordert.",
    items: {
      madrid: { title: "MADRID", tag: "Operative Basis", desc: "El Viso, Salamanca, Castellana, Chamberí" },
      barcelona: { title: "BARCELONA", tag: "Premium-Objekte", desc: "Eixample, Pedralbes, Sarrià, Diagonal Mar" },
      marbella: { title: "MARBELLA", tag: "Costa del Sol", desc: "La Zagaleta, Sierra Blanca, Puerto Banús" },
      paris: { title: "PARIS", tag: "International", desc: "16. Arrondissement, Saint-Germain, Marais" },
      gstaad: { title: "GSTAAD", tag: "Schweizer Alpen", desc: "Exklusive Chalets und Skigebiete" },
      londres: { title: "LONDON", tag: "Finanzhauptstadt", desc: "Mayfair, Belgravia, Knightsbridge, Chelsea" },
    },
  },
  firma: {
    label: "Über uns", h: "Vermittlung von", em: "hochwertigen Off-Market-Transaktionen",
    body: "Exklusive Vermittlung von Immobilien außerhalb des Marktes. Gebäude, Hotels, Luxuswohnimmobilien und besondere Objekte zwischen 1 Mio. € und 200 Mio. €. Direkter Zugang zu Gelegenheiten, die unter Fachleuten und unter Vertraulichkeitsvereinbarung gehandelt werden.",
    btn_contacto: "Sprechen wir", btn_valoracion: "Bewertung anfragen",
  },
  vender: {
    label: "Verkaufen", h: "Ihr Objekt", em: "verdient Diskretion",
    desc: "Professionelle Bewertung und private Vermarktung. Keine Anzeigen, keine Portale, keine öffentliche Präsenz. Nur qualifizierte Käufer unter NDA.",
    placeholder: "Adresse oder Lage des Objekts", btn: "Bewertung anfragen",
  },
  contacto: {
    label: "Gespräch beginnen", h: "Der erste Schritt ist", em: "ein Anruf",
    desc: "Jede Anfrage wird persönlich geprüft. Passt das Profil zu einer laufenden oder geplanten Transaktion, erfolgt der Kontakt direkt.",
    email_label: "E-Mail", nombre: "Name", email: "E-Mail", telefono: "Telefon",
    interes: "Ihre Anfrage", comprar: "Kauf", vender: "Verkauf", quitar: "Entfernen",
    consent_pre: "Ich habe die", consent_link: "Datenschutzerklärung gelesen und akzeptiere sie",
    enviar: "Anfrage senden", enviando: "Wird gesendet…",
    ok: "Anfrage erhalten. Wir melden uns in Kürze.",
    error: "Senden fehlgeschlagen. Bitte erneut versuchen oder schreiben an",
    required: "Bitte Name und E-Mail angeben.", consent_required: "Bitte akzeptieren Sie die Datenschutzerklärung.",
  },
  faq: {
    label: "Häufige Fragen", h: "Wie wir", em: "arbeiten",
    items: [
      { q: "Was ist eine Off-Market-Transaktion?", a: "Ein Verkauf, der privat verhandelt und weder auf Portalen noch in Medien veröffentlicht wird. Das Objekt wird nur qualifizierten, vorab identifizierten Käufern unter Vertraulichkeitsvereinbarung vorgestellt." },
      { q: "Warum außerhalb des Marktes verkaufen?", a: "Diskretion und Kontrolle. Ohne öffentliche Präsenz verliert das Objekt nicht an Wert, es gibt keine sichtbaren Preissenkungen und der Eigentümer entscheidet, wer Informationen erhält." },
      { q: "Wie läuft der Prozess ab?", a: "Ein erstes Gespräch, um das Objekt oder den Investitionsbedarf zu verstehen. Danach NDA, Analyse und Bewertung, gezielte Vorstellung bei geprüften Gegenparteien und Begleitung bis zur Unterzeichnung." },
      { q: "Welche Objekte und Volumina betreuen Sie?", a: "Komplette Gebäude, Hotels und Hotelketten, Luxuswohnimmobilien, Grundstücke und besondere Objekte, in Transaktionen von 1 Mio. € bis 200 Mio. €. Schwerpunkt Madrid, mit Geschäften in Spanien und international." },
      { q: "Wie wird die Vertraulichkeit geschützt?", a: "Sensible Informationen werden erst nach Unterzeichnung einer Vertraulichkeitsvereinbarung (NDA) geteilt. Kontaktdaten werden privat behandelt und ohne Zustimmung nicht weitergegeben." },
      { q: "Betreuen Sie auch Yachten und Flugzeuge?", a: "Ja. Kauf, Verkauf und Charter von Yachten, Privatflugzeugen und anderen hochwertigen Vermögenswerten, nach Vereinbarung und mit derselben Diskretion." },
    ],
  },
  footer: {
    desc: "Vermittlung hochwertiger Off-Market-Immobilien. Madrid, Spanien & international.",
    col_destinos: "Standorte", col_activos: "Objekte", col_firma: "Über uns", col_contacto: "Kontakt", col_legal: "Rechtliches",
    firma_links: { firma: "Über uns", faq: "Häufige Fragen", vender: "Verkaufen", contacto: "Kontakt" },
    aviso: "Impressum", privacidad: "Datenschutz", cookies: "Cookie-Richtlinie", rights: "Alle Rechte vorbehalten",
  },
};

const it: Dict = {
  tagline: "Off-market. On-point.",
  nav: { activos: "Attivi", destinos: "Destinazioni", firma: "La firma", vender: "Vendere", contacto: "Contatto", menu: "Menu", cerrar: "Chiudi" },
  hero_sub: "Immobiliare Off-Market · Madrid · Internazionale",
  scroll: "Scorri",
  search: {
    abrir: "Che tipo di operazione sta cercando?", explorar: "Esplora", comprar: "Comprare", vender: "Vendere",
    ubicacion: "Posizione", ubicacion_ph: "Madrid, Spagna, Europa…", tipo: "Tipo di attivo", seleccionar: "Seleziona…",
    rango: "Range di investimento", continuar: "Continua", cerrar: "Chiudi",
  },
  assetOptions: { edificio: "Edificio", hotel: "Hotel / Hospitality", residencial: "Residenziale di lusso", terreno: "Lotto / Terreno", singular: "Attivo singolare" },
  activos: {
    label: "Selezione attuale", title: "Attivi in evidenza",
    note: "Questa è la selezione che possiamo mostrare. Le operazioni che non compaiono qui richiedono una conversazione.",
    price: "Prezzo su richiesta", prev: "Precedente", next: "Successivo",
  },
  properties: [
    { tag: "Madrid · Chueca", title: "Residenza di design", meta: "Gran lusso · Interni d'autore" },
    { tag: "Barcellona · Gràcia", title: "Attico con terrazza privata", meta: "Terrazza · Piscina · Vista" },
    { tag: "Madrid · Plaza Mayor", title: "Appartamento signorile ristrutturato", meta: "Centro storico · Design contemporaneo" },
  ],
  tipologias: {
    label: "Tipologie", h: "Cosa", em: "gestiamo",
    items: [
      { name: "Lotti edificabili", desc: "Aree urbane strategiche" },
      { name: "Terreni", desc: "Tenute e terreni agricoli" },
      { name: "Edifici", desc: "Edifici interi e signorili" },
      { name: "Hotel", desc: "Hotel boutique e di lusso" },
      { name: "Catene alberghiere", desc: "Portafogli e catene in espansione" },
      { name: "Gran lusso", desc: "Ville e dimore di alto livello" },
      { name: "Attivi singolari", desc: "Palazzi, tenute storiche e patrimonio" },
      { name: "Off market", desc: "Ciò che non è su nessun portale" },
    ],
  },
  extra: {
    label: "Oltre l'immobiliare", title: "Yacht e aviazione privata",
    body: "Compravendita e charter di yacht, jet privati e altri beni di alto valore. Con la stessa discrezione di un edificio o di un hotel.",
    note: "Servizio esclusivo su appuntamento. Ogni richiesta è gestita in modo privato e riservato.",
    cta: "Richiedi accesso", only: "Solo su appuntamento", badge: "Su richiesta",
  },
  destinos: {
    label: "Destinazioni", h: "Presenza globale,", em: "chiusura locale",
    desc: "Focus principale su Madrid, con operazioni in tutta la Spagna, in Europa e sui mercati internazionali quando l'operazione lo richiede.",
    items: {
      madrid: { title: "MADRID", tag: "Centro operativo", desc: "El Viso, Salamanca, Castellana, Chamberí" },
      barcelona: { title: "BARCELLONA", tag: "Attivi premium", desc: "Eixample, Pedralbes, Sarrià, Diagonal Mar" },
      marbella: { title: "MARBELLA", tag: "Costa del Sol", desc: "La Zagaleta, Sierra Blanca, Puerto Banús" },
      paris: { title: "PARIGI", tag: "Internazionale", desc: "XVI arrondissement, Saint-Germain, Marais" },
      gstaad: { title: "GSTAAD", tag: "Alpi svizzere", desc: "Chalet esclusivi e stazioni sciistiche" },
      londres: { title: "LONDRA", tag: "Capitale finanziaria", desc: "Mayfair, Belgravia, Knightsbridge, Chelsea" },
    },
  },
  firma: {
    label: "La firma", h: "Intermediazione in", em: "operazioni off-market di alto valore",
    body: "Intermediazione esclusiva in attivi immobiliari fuori mercato. Edifici, hotel, residenziale di lusso e attivi singolari tra 1 M€ e 200 M€. Accesso diretto a opportunità che circolano tra professionisti sotto accordo di riservatezza.",
    btn_contacto: "Parliamone", btn_valoracion: "Richiedi valutazione",
  },
  vender: {
    label: "Vendere", h: "Il suo attivo", em: "merita discrezione",
    desc: "Valutazione professionale e commercializzazione privata. Nessun annuncio, nessun portale, nessuna esposizione pubblica. Solo acquirenti qualificati sotto NDA.",
    placeholder: "Indirizzo o zona dell'attivo", btn: "Richiedi valutazione",
  },
  contacto: {
    label: "Iniziare una conversazione", h: "Il primo passo è", em: "una chiamata",
    desc: "Ogni richiesta viene esaminata personalmente. Se il profilo corrisponde a un'operazione in corso o in preparazione, il contatto è diretto.",
    email_label: "Email", nombre: "Nome", email: "Email", telefono: "Telefono",
    interes: "La sua richiesta", comprar: "Acquisto", vender: "Vendita", quitar: "Rimuovi",
    consent_pre: "Ho letto e accetto la", consent_link: "privacy policy",
    enviar: "Invia richiesta", enviando: "Invio…",
    ok: "Richiesta ricevuta. La contatteremo al più presto.",
    error: "Invio non riuscito. Riprovi o scriva a",
    required: "Indichi nome ed email.", consent_required: "Deve accettare la privacy policy.",
  },
  faq: {
    label: "Domande frequenti", h: "Come", em: "lavoriamo",
    items: [
      { q: "Che cos'è un'operazione off-market?", a: "Una compravendita negoziata in forma privata, senza pubblicazione su portali o media. L'attivo viene presentato solo ad acquirenti qualificati, identificati in anticipo e sotto accordo di riservatezza." },
      { q: "Perché vendere fuori mercato?", a: "Discrezione e controllo. Senza esposizione pubblica l'attivo non si logora, non ci sono ribassi visibili e il proprietario decide chi accede alle informazioni." },
      { q: "Come si svolge il processo?", a: "Un primo colloquio per capire l'attivo o l'esigenza di investimento. Poi NDA, analisi e valutazione, presentazione selettiva a controparti verificate e affiancamento fino alla firma." },
      { q: "Quali attivi e quali importi?", a: "Edifici interi, hotel e catene alberghiere, residenziale di lusso, lotti, terreni e attivi singolari, in operazioni da 1 M€ a 200 M€. Focus su Madrid, con operazioni in Spagna e all'estero." },
      { q: "Come viene tutelata la riservatezza?", a: "Le informazioni sensibili vengono condivise solo dopo la firma di un accordo di riservatezza (NDA). I dati di contatto sono trattati privatamente e mai ceduti senza autorizzazione." },
      { q: "Trattate anche yacht e aerei?", a: "Sì. Compravendita e charter di yacht, aviazione privata e altri beni di alto valore, su appuntamento e con la stessa discrezione." },
    ],
  },
  footer: {
    desc: "Intermediazione in operazioni immobiliari off-market di alto valore. Madrid, Spagna e internazionale.",
    col_destinos: "Destinazioni", col_activos: "Attivi", col_firma: "La firma", col_contacto: "Contatto", col_legal: "Note legali",
    firma_links: { firma: "La firma", faq: "Domande frequenti", vender: "Vendere", contacto: "Contatto" },
    aviso: "Note legali", privacidad: "Privacy policy", cookies: "Cookie policy", rights: "Tutti i diritti riservati",
  },
};

const pt: Dict = {
  tagline: "Off-market. On-point.",
  nav: { activos: "Ativos", destinos: "Destinos", firma: "A firma", vender: "Vender", contacto: "Contacto", menu: "Menu", cerrar: "Fechar" },
  hero_sub: "Imobiliário Off-Market · Madrid · Internacional",
  scroll: "Rolar",
  search: {
    abrir: "Que tipo de operação procura?", explorar: "Explorar", comprar: "Comprar", vender: "Vender",
    ubicacion: "Localização", ubicacion_ph: "Madrid, Espanha, Europa…", tipo: "Tipo de ativo", seleccionar: "Selecionar…",
    rango: "Gama de investimento", continuar: "Continuar", cerrar: "Fechar",
  },
  assetOptions: { edificio: "Edifício", hotel: "Hotel / Hospitality", residencial: "Residencial de luxo", terreno: "Lote / Terreno", singular: "Ativo singular" },
  activos: {
    label: "Seleção atual", title: "Ativos em destaque",
    note: "Esta é a seleção que podemos mostrar. As operações que não aparecem aqui exigem uma conversa.",
    price: "Preço sob consulta", prev: "Anterior", next: "Seguinte",
  },
  properties: [
    { tag: "Madrid · Chueca", title: "Residência de design", meta: "Grande luxo · Interiores de autor" },
    { tag: "Barcelona · Gràcia", title: "Penthouse com terraço privado", meta: "Terraço · Piscina · Vistas" },
    { tag: "Madrid · Plaza Mayor", title: "Apartamento senhorial renovado", meta: "Centro histórico · Design contemporâneo" },
  ],
  tipologias: {
    label: "Tipologias", h: "O que", em: "gerimos",
    items: [
      { name: "Lotes urbanos", desc: "Parcelas urbanas estratégicas" },
      { name: "Terrenos", desc: "Quintas e terrenos rústicos" },
      { name: "Edifícios", desc: "Edifícios completos e senhoriais" },
      { name: "Hotéis", desc: "Hotéis boutique e de luxo" },
      { name: "Cadeias hoteleiras", desc: "Portfólios e cadeias em expansão" },
      { name: "Grande luxo", desc: "Moradias e mansões de alto padrão" },
      { name: "Ativos singulares", desc: "Palácios, quintas históricas e património" },
      { name: "Off market", desc: "O que não está em nenhum portal" },
    ],
  },
  extra: {
    label: "Para além do imobiliário", title: "Iates e aviação privada",
    body: "Compra, venda e fretamento de iates, jatos privados e outros ativos de alto valor. Com a mesma discrição de um edifício ou de um hotel.",
    note: "Serviço exclusivo mediante marcação. Cada pedido é tratado de forma privada e confidencial.",
    cta: "Solicitar acesso", only: "Só com marcação", badge: "Sob pedido",
  },
  destinos: {
    label: "Destinos", h: "Presença global,", em: "fecho local",
    desc: "Foco principal em Madrid, com operações em toda a Espanha, Europa e mercados internacionais quando a operação o exige.",
    items: {
      madrid: { title: "MADRID", tag: "Centro de operações", desc: "El Viso, Salamanca, Castellana, Chamberí" },
      barcelona: { title: "BARCELONA", tag: "Ativos premium", desc: "Eixample, Pedralbes, Sarrià, Diagonal Mar" },
      marbella: { title: "MARBELLA", tag: "Costa del Sol", desc: "La Zagaleta, Sierra Blanca, Puerto Banús" },
      paris: { title: "PARIS", tag: "Internacional", desc: "XVI arrondissement, Saint-Germain, Marais" },
      gstaad: { title: "GSTAAD", tag: "Alpes suíços", desc: "Chalés exclusivos e estâncias de esqui" },
      londres: { title: "LONDRES", tag: "Capital financeira", desc: "Mayfair, Belgravia, Knightsbridge, Chelsea" },
    },
  },
  firma: {
    label: "A firma", h: "Intermediação em", em: "operações off-market de alto valor",
    body: "Intermediação exclusiva em ativos imobiliários fora de mercado. Edifícios, hotéis, residencial de luxo e ativos singulares entre 1 M€ e 200 M€. Acesso direto a oportunidades que circulam entre profissionais sob acordo de confidencialidade.",
    btn_contacto: "Falemos", btn_valoracion: "Solicitar avaliação",
  },
  vender: {
    label: "Vender", h: "O seu ativo", em: "merece discrição",
    desc: "Avaliação profissional e comercialização privada. Sem anúncios, sem portais, sem exposição pública. Apenas compradores qualificados sob NDA.",
    placeholder: "Morada ou zona do ativo", btn: "Solicitar avaliação",
  },
  contacto: {
    label: "Iniciar conversa", h: "O primeiro passo é", em: "uma chamada",
    desc: "Cada pedido é analisado pessoalmente. Se o perfil corresponder a uma operação em curso ou em preparação, o contacto é direto.",
    email_label: "Email", nombre: "Nome", email: "Email", telefono: "Telefone",
    interes: "O seu pedido", comprar: "Compra", vender: "Venda", quitar: "Remover",
    consent_pre: "Li e aceito a", consent_link: "política de privacidade",
    enviar: "Enviar pedido", enviando: "A enviar…",
    ok: "Pedido recebido. Entraremos em contacto com a maior brevidade.",
    error: "Não foi possível enviar. Tente novamente ou escreva para",
    required: "Indique nome e email.", consent_required: "Deve aceitar a política de privacidade.",
  },
  faq: {
    label: "Perguntas frequentes", h: "Como", em: "trabalhamos",
    items: [
      { q: "O que é uma operação off-market?", a: "Uma compra e venda negociada de forma privada, sem publicação em portais ou meios de comunicação. O ativo só é apresentado a compradores qualificados, identificados previamente e sob acordo de confidencialidade." },
      { q: "Porquê vender fora de mercado?", a: "Discrição e controlo. Sem exposição pública, o ativo não se desgasta, não há descidas de preço visíveis e o proprietário decide quem acede à informação." },
      { q: "Como é o processo?", a: "Uma primeira conversa para perceber o ativo ou a necessidade de investimento. Depois, NDA, análise e avaliação, apresentação seletiva a contrapartes verificadas e acompanhamento até à escritura." },
      { q: "Que ativos e montantes gerem?", a: "Edifícios completos, hotéis e cadeias hoteleiras, residencial de luxo, lotes, terrenos e ativos singulares, em operações de 1 M€ a 200 M€. Foco em Madrid, com operações em Espanha e no estrangeiro." },
      { q: "Como se protege a confidencialidade?", a: "A informação sensível só é partilhada após a assinatura de um acordo de confidencialidade (NDA). Os dados de contacto são tratados de forma privada e nunca cedidos sem autorização." },
      { q: "Também trabalham com iates e aviões?", a: "Sim. Compra, venda e fretamento de iates, aviação privada e outros ativos de alto valor, mediante marcação e com a mesma discrição." },
    ],
  },
  footer: {
    desc: "Intermediação em operações imobiliárias off-market de alto valor. Madrid, Espanha e internacional.",
    col_destinos: "Destinos", col_activos: "Ativos", col_firma: "A firma", col_contacto: "Contacto", col_legal: "Legal",
    firma_links: { firma: "A firma", faq: "Perguntas frequentes", vender: "Vender", contacto: "Contacto" },
    aviso: "Aviso legal", privacidad: "Política de privacidade", cookies: "Política de cookies", rights: "Todos os direitos reservados",
  },
};

const ru: Dict = {
  tagline: "Вне рынка. В точку.",
  nav: { activos: "Активы", destinos: "Направления", firma: "О компании", vender: "Продать", contacto: "Контакт", menu: "Меню", cerrar: "Закрыть" },
  hero_sub: "Внерыночная недвижимость · Мадрид · Международный рынок",
  scroll: "Прокрутить",
  search: {
    abrir: "Какой тип сделки вас интересует?", explorar: "Смотреть", comprar: "Купить", vender: "Продать",
    ubicacion: "Местоположение", ubicacion_ph: "Мадрид, Испания, Европа…", tipo: "Тип актива", seleccionar: "Выбрать…",
    rango: "Объём инвестиций", continuar: "Продолжить", cerrar: "Закрыть",
  },
  assetOptions: { edificio: "Здание", hotel: "Отель / Hospitality", residencial: "Элитное жильё", terreno: "Участок / Земля", singular: "Уникальный актив" },
  activos: {
    label: "Текущая подборка", title: "Избранные активы",
    note: "Это подборка, которую мы можем показать. Остальные сделки обсуждаются лично.",
    price: "Цена по запросу", prev: "Назад", next: "Далее",
  },
  properties: [
    { tag: "Мадрид · Чуэка", title: "Дизайнерская резиденция", meta: "Премиум · Авторский интерьер" },
    { tag: "Барселона · Грасия", title: "Пентхаус с частной террасой", meta: "Терраса · Бассейн · Виды" },
    { tag: "Мадрид · Пласа-Майор", title: "Отреставрированная квартира", meta: "Исторический центр · Современный дизайн" },
  ],
  tipologias: {
    label: "Категории", h: "С чем мы", em: "работаем",
    items: [
      { name: "Участки", desc: "Стратегические городские участки" },
      { name: "Земля", desc: "Поместья и сельские угодья" },
      { name: "Здания", desc: "Целые и исторические здания" },
      { name: "Отели", desc: "Бутик-отели и отели класса люкс" },
      { name: "Гостиничные сети", desc: "Портфели и растущие сети" },
      { name: "Премиум", desc: "Виллы и особняки высокого класса" },
      { name: "Уникальные активы", desc: "Дворцы, исторические поместья, наследие" },
      { name: "Off market", desc: "То, чего нет ни на одном портале" },
    ],
  },
  extra: {
    label: "За пределами недвижимости", title: "Яхты и частная авиация",
    body: "Покупка, продажа и чартер яхт, частных самолётов и других ценных активов. С той же конфиденциальностью, что и сделка со зданием или отелем.",
    note: "Эксклюзивный сервис по предварительной записи. Каждый запрос обрабатывается конфиденциально.",
    cta: "Запросить доступ", only: "Только по записи", badge: "По запросу",
  },
  destinos: {
    label: "Направления", h: "Глобальное присутствие,", em: "локальное закрытие",
    desc: "Основной фокус — Мадрид, а также сделки по всей Испании, в Европе и на международных рынках, когда этого требует операция.",
    items: {
      madrid: { title: "МАДРИД", tag: "Центр операций", desc: "Эль-Висо, Саламанка, Кастельяна, Чамбери" },
      barcelona: { title: "БАРСЕЛОНА", tag: "Премиальные активы", desc: "Эшампле, Педральбес, Сарриа, Диагональ-Мар" },
      marbella: { title: "МАРБЕЛЬЯ", tag: "Коста-дель-Соль", desc: "Ла-Сагалета, Сьерра-Бланка, Пуэрто-Банус" },
      paris: { title: "ПАРИЖ", tag: "Международный", desc: "XVI округ, Сен-Жермен, Маре" },
      gstaad: { title: "ГШТААД", tag: "Швейцарские Альпы", desc: "Эксклюзивные шале и горнолыжные курорты" },
      londres: { title: "ЛОНДОН", tag: "Финансовая столица", desc: "Мейфэр, Белгравия, Найтсбридж, Челси" },
    },
  },
  firma: {
    label: "О компании", h: "Посредничество в", em: "крупных внерыночных сделках",
    body: "Эксклюзивное посредничество во внерыночных сделках с недвижимостью. Здания, отели, элитное жильё и уникальные активы стоимостью от 1 до 200 млн €. Прямой доступ к возможностям, которые передаются между профессионалами по соглашению о конфиденциальности.",
    btn_contacto: "Обсудить", btn_valoracion: "Запросить оценку",
  },
  vender: {
    label: "Продать", h: "Ваш актив", em: "заслуживает конфиденциальности",
    desc: "Профессиональная оценка и закрытая продажа. Без объявлений, без порталов, без огласки. Только квалифицированные покупатели по NDA.",
    placeholder: "Адрес или район объекта", btn: "Запросить оценку",
  },
  contacto: {
    label: "Начать разговор", h: "Первый шаг —", em: "звонок",
    desc: "Каждый запрос рассматривается лично. Если профиль соответствует текущей или готовящейся сделке, с вами свяжутся напрямую.",
    email_label: "Email", nombre: "Имя", email: "Email", telefono: "Телефон",
    interes: "Ваш запрос", comprar: "Покупка", vender: "Продажа", quitar: "Убрать",
    consent_pre: "Я прочитал(а) и принимаю", consent_link: "политику конфиденциальности",
    enviar: "Отправить запрос", enviando: "Отправка…",
    ok: "Запрос получен. Мы свяжемся с вами в ближайшее время.",
    error: "Не удалось отправить. Попробуйте ещё раз или напишите на",
    required: "Укажите имя и email.", consent_required: "Необходимо принять политику конфиденциальности.",
  },
  faq: {
    label: "Частые вопросы", h: "Как мы", em: "работаем",
    items: [
      { q: "Что такое внерыночная (off-market) сделка?", a: "Сделка, которая ведётся конфиденциально, без публикации на порталах и в СМИ. Объект представляется только заранее проверенным квалифицированным покупателям по соглашению о конфиденциальности." },
      { q: "Зачем продавать вне рынка?", a: "Конфиденциальность и контроль. Без публичности объект не «выгорает», нет видимых снижений цены, а владелец сам решает, кто получает информацию." },
      { q: "Как устроен процесс?", a: "Первый разговор, чтобы понять объект или инвестиционную задачу. Затем NDA, анализ и оценка, адресная презентация проверенным контрагентам и сопровождение до подписания." },
      { q: "С какими активами и объёмами вы работаете?", a: "Целые здания, отели и гостиничные сети, элитное жильё, участки, земля и уникальные активы — сделки от 1 до 200 млн €. Фокус на Мадриде, а также сделки в Испании и за рубежом." },
      { q: "Как обеспечивается конфиденциальность?", a: "Чувствительная информация передаётся только после подписания соглашения о конфиденциальности (NDA). Контактные данные не передаются третьим лицам без согласия." },
      { q: "Вы работаете с яхтами и самолётами?", a: "Да. Покупка, продажа и чартер яхт, частная авиация и другие ценные активы — по предварительной записи и с той же конфиденциальностью." },
    ],
  },
  footer: {
    desc: "Посредничество в крупных внерыночных сделках с недвижимостью. Мадрид, Испания и международный рынок.",
    col_destinos: "Направления", col_activos: "Активы", col_firma: "О компании", col_contacto: "Контакт", col_legal: "Правовая информация",
    firma_links: { firma: "О компании", faq: "Частые вопросы", vender: "Продать", contacto: "Контакт" },
    aviso: "Правовая информация", privacidad: "Политика конфиденциальности", cookies: "Политика cookies", rights: "Все права защищены",
  },
};

const ar: Dict = {
  tagline: "خارج السوق. في الصميم.",
  nav: { activos: "الأصول", destinos: "الوجهات", firma: "عن الشركة", vender: "البيع", contacto: "اتصل", menu: "القائمة", cerrar: "إغلاق" },
  hero_sub: "عقارات خارج السوق · مدريد · دولي",
  scroll: "تمرير",
  search: {
    abrir: "ما نوع الصفقة التي تبحث عنها؟", explorar: "استكشاف", comprar: "شراء", vender: "بيع",
    ubicacion: "الموقع", ubicacion_ph: "مدريد، إسبانيا، أوروبا…", tipo: "نوع الأصل", seleccionar: "اختر…",
    rango: "نطاق الاستثمار", continuar: "متابعة", cerrar: "إغلاق",
  },
  assetOptions: { edificio: "مبنى", hotel: "فندق / ضيافة", residencial: "سكني فاخر", terreno: "قطعة أرض", singular: "أصل فريد" },
  activos: {
    label: "الاختيار الحالي", title: "الأصول المميزة",
    note: "هذا ما يمكننا عرضه. الصفقات غير المعروضة هنا تتطلب محادثة خاصة.",
    price: "السعر عند الطلب", prev: "السابق", next: "التالي",
  },
  properties: [
    { tag: "مدريد · تشويكا", title: "مسكن بتصميم مميز", meta: "فخامة عالية · تصميم داخلي مميز" },
    { tag: "برشلونة · غراسيا", title: "بنتهاوس مع شرفة خاصة", meta: "شرفة · مسبح · إطلالات" },
    { tag: "مدريد · بلازا مايور", title: "شقة كلاسيكية مجددة", meta: "المركز التاريخي · تصميم معاصر" },
  ],
  tipologias: {
    label: "الفئات", h: "ما", em: "نديره",
    items: [
      { name: "قطع أراضٍ حضرية", desc: "مواقع حضرية استراتيجية" },
      { name: "أراضٍ", desc: "مزارع وأراضٍ ريفية" },
      { name: "مبانٍ", desc: "مبانٍ كاملة وتاريخية" },
      { name: "فنادق", desc: "فنادق بوتيك وفاخرة" },
      { name: "سلاسل فندقية", desc: "محافظ وسلاسل في توسع" },
      { name: "فخامة عالية", desc: "فلل وقصور راقية" },
      { name: "أصول فريدة", desc: "قصور وضياع تاريخية وتراث" },
      { name: "خارج السوق", desc: "ما لا يوجد في أي بوابة" },
    ],
  },
  extra: {
    label: "ما بعد العقارات", title: "اليخوت والطيران الخاص",
    body: "شراء وبيع واستئجار اليخوت والطائرات الخاصة وغيرها من الأصول عالية القيمة، بنفس السرية التي نتعامل بها مع مبنى أو فندق.",
    note: "خدمة حصرية بموعد مسبق. يُعالج كل طلب بشكل خاص وسري.",
    cta: "طلب الوصول", only: "بموعد فقط", badge: "عند الطلب",
  },
  destinos: {
    label: "الوجهات", h: "حضور عالمي،", em: "إغلاق محلي",
    desc: "تركيز رئيسي على مدريد، مع صفقات في جميع أنحاء إسبانيا وأوروبا والأسواق الدولية عندما تتطلب الصفقة ذلك.",
    items: {
      madrid: { title: "مدريد", tag: "مركز العمليات", desc: "El Viso، Salamanca، Castellana، Chamberí" },
      barcelona: { title: "برشلونة", tag: "أصول متميزة", desc: "Eixample، Pedralbes، Sarrià، Diagonal Mar" },
      marbella: { title: "ماربيا", tag: "كوستا ديل سول", desc: "La Zagaleta، Sierra Blanca، Puerto Banús" },
      paris: { title: "باريس", tag: "دولي", desc: "الدائرة 16، Saint-Germain، Marais" },
      gstaad: { title: "غشتاد", tag: "جبال الألب السويسرية", desc: "شاليهات حصرية ومنتجعات تزلج" },
      londres: { title: "لندن", tag: "العاصمة المالية", desc: "Mayfair، Belgravia، Knightsbridge، Chelsea" },
    },
  },
  firma: {
    label: "عن الشركة", h: "وساطة في", em: "صفقات خارج السوق عالية القيمة",
    body: "وساطة حصرية في الأصول العقارية خارج السوق. مبانٍ وفنادق وعقارات سكنية فاخرة وأصول فريدة بين مليون و200 مليون يورو. وصول مباشر إلى فرص تتداول بين المحترفين بموجب اتفاقية سرية.",
    btn_contacto: "لنتحدث", btn_valoracion: "طلب تقييم",
  },
  vender: {
    label: "البيع", h: "أصلك", em: "يستحق السرية",
    desc: "تقييم مهني وتسويق خاص. بدون إعلانات، بدون بوابات، بدون ظهور علني. مشترون مؤهلون فقط بموجب اتفاقية سرية.",
    placeholder: "عنوان العقار أو المنطقة", btn: "طلب تقييم",
  },
  contacto: {
    label: "ابدأ محادثة", h: "الخطوة الأولى هي", em: "مكالمة",
    desc: "يُراجع كل طلب شخصياً. إذا توافق الملف مع صفقة جارية أو قيد الإعداد، يكون التواصل مباشراً.",
    email_label: "البريد الإلكتروني", nombre: "الاسم", email: "البريد الإلكتروني", telefono: "الهاتف",
    interes: "طلبك", comprar: "شراء", vender: "بيع", quitar: "إزالة",
    consent_pre: "لقد قرأت وأوافق على", consent_link: "سياسة الخصوصية",
    enviar: "إرسال الطلب", enviando: "جارٍ الإرسال…",
    ok: "تم استلام الطلب. سنتواصل معك في أقرب وقت.",
    error: "تعذر الإرسال. حاول مرة أخرى أو راسلنا على",
    required: "يرجى إدخال الاسم والبريد الإلكتروني.", consent_required: "يجب الموافقة على سياسة الخصوصية.",
  },
  faq: {
    label: "الأسئلة الشائعة", h: "كيف", em: "نعمل",
    items: [
      { q: "ما هي الصفقة خارج السوق؟", a: "عملية بيع تُفاوض بشكل خاص دون نشرها في البوابات أو وسائل الإعلام. لا يُعرض الأصل إلا على مشترين مؤهلين ومحددين مسبقاً بموجب اتفاقية سرية." },
      { q: "لماذا البيع خارج السوق؟", a: "السرية والتحكم. بدون ظهور علني لا يفقد الأصل قيمته، ولا توجد تخفيضات سعرية ظاهرة، ويقرر المالك من يطّلع على المعلومات." },
      { q: "كيف تسير العملية؟", a: "محادثة أولى لفهم الأصل أو الاحتياج الاستثماري، ثم اتفاقية سرية، وتحليل وتقييم، وعرض انتقائي على أطراف موثوقة، ومرافقة حتى التوقيع." },
      { q: "ما الأصول والنطاقات التي تديرونها؟", a: "مبانٍ كاملة وفنادق وسلاسل فندقية وعقارات سكنية فاخرة وأراضٍ وأصول فريدة، في صفقات من مليون إلى 200 مليون يورو. التركيز على مدريد مع صفقات في إسبانيا وخارجها." },
      { q: "كيف تتم حماية السرية؟", a: "لا تُشارك المعلومات الحساسة إلا بعد توقيع اتفاقية سرية. تُعالج بيانات الاتصال بشكل خاص ولا تُشارك مع أطراف ثالثة دون إذن." },
      { q: "هل تعملون أيضاً في اليخوت والطائرات؟", a: "نعم. شراء وبيع واستئجار اليخوت والطيران الخاص وغيرها من الأصول عالية القيمة، بموعد مسبق وبنفس مستوى السرية." },
    ],
  },
  footer: {
    desc: "وساطة في صفقات العقارات خارج السوق عالية القيمة. مدريد، إسبانيا والسوق الدولي.",
    col_destinos: "الوجهات", col_activos: "الأصول", col_firma: "عن الشركة", col_contacto: "اتصل", col_legal: "قانوني",
    firma_links: { firma: "عن الشركة", faq: "الأسئلة الشائعة", vender: "البيع", contacto: "اتصل" },
    aviso: "إشعار قانوني", privacidad: "سياسة الخصوصية", cookies: "سياسة ملفات تعريف الارتباط", rights: "جميع الحقوق محفوظة",
  },
};

const zh: Dict = {
  tagline: "场外交易。精准到位。",
  nav: { activos: "资产", destinos: "目的地", firma: "关于我们", vender: "出售", contacto: "联系", menu: "菜单", cerrar: "关闭" },
  hero_sub: "场外房地产 · 马德里 · 国际",
  scroll: "滚动",
  search: {
    abrir: "您在寻找哪种类型的交易？", explorar: "探索", comprar: "购买", vender: "出售",
    ubicacion: "位置", ubicacion_ph: "马德里、西班牙、欧洲…", tipo: "资产类型", seleccionar: "请选择…",
    rango: "投资范围", continuar: "继续", cerrar: "关闭",
  },
  assetOptions: { edificio: "整栋建筑", hotel: "酒店", residencial: "豪华住宅", terreno: "地块 / 土地", singular: "特色资产" },
  activos: {
    label: "当前精选", title: "精选资产",
    note: "以上是可以公开展示的部分。其余交易需当面沟通。",
    price: "价格面议", prev: "上一个", next: "下一个",
  },
  properties: [
    { tag: "马德里 · Chueca", title: "设计师住宅", meta: "顶级豪宅 · 名家室内设计" },
    { tag: "巴塞罗那 · Gràcia", title: "带私人露台的顶层公寓", meta: "露台 · 泳池 · 景观" },
    { tag: "马德里 · 马约尔广场", title: "翻新古典公寓", meta: "历史中心 · 当代设计" },
  ],
  tipologias: {
    label: "类别", h: "我们", em: "经营的资产",
    items: [
      { name: "城市地块", desc: "战略性城市用地" },
      { name: "土地", desc: "庄园与农用地" },
      { name: "整栋建筑", desc: "整栋及古典建筑" },
      { name: "酒店", desc: "精品及豪华酒店" },
      { name: "连锁酒店", desc: "酒店组合及扩张中的连锁" },
      { name: "顶级豪宅", desc: "高端别墅与府邸" },
      { name: "特色资产", desc: "宫殿、历史庄园与遗产" },
      { name: "场外资产", desc: "任何平台上都没有的资产" },
    ],
  },
  extra: {
    label: "房地产之外", title: "游艇与私人航空",
    body: "游艇、私人飞机及其他高价值资产的买卖与包租，以与建筑或酒店交易同等的保密方式处理。",
    note: "仅限预约的专属服务。每项请求均以私密方式处理。",
    cta: "申请访问", only: "仅限预约", badge: "按需提供",
  },
  destinos: {
    label: "目的地", h: "全球布局，", em: "本地成交",
    desc: "以马德里为核心，并根据交易需要覆盖西班牙全境、欧洲及国际市场。",
    items: {
      madrid: { title: "马德里", tag: "运营中心", desc: "El Viso、Salamanca、Castellana、Chamberí" },
      barcelona: { title: "巴塞罗那", tag: "优质资产", desc: "Eixample、Pedralbes、Sarrià、Diagonal Mar" },
      marbella: { title: "马贝拉", tag: "太阳海岸", desc: "La Zagaleta、Sierra Blanca、Puerto Banús" },
      paris: { title: "巴黎", tag: "国际", desc: "第十六区、圣日耳曼、玛黑区" },
      gstaad: { title: "格施塔德", tag: "瑞士阿尔卑斯", desc: "高端木屋与滑雪胜地" },
      londres: { title: "伦敦", tag: "金融之都", desc: "梅菲尔、贝尔格莱维亚、骑士桥、切尔西" },
    },
  },
  firma: {
    label: "关于我们", h: "专注于", em: "高价值场外交易中介",
    body: "场外房地产资产的独家中介。整栋建筑、酒店、豪华住宅及特色资产，交易金额100万至2亿欧元。在保密协议下，直接接触专业人士之间流通的机会。",
    btn_contacto: "洽谈", btn_valoracion: "申请估值",
  },
  vender: {
    label: "出售", h: "您的资产", em: "值得保密",
    desc: "专业估值与私密营销。无广告、无平台、无公开曝光。仅向签署保密协议的合格买家展示。",
    placeholder: "资产地址或区域", btn: "申请估值",
  },
  contacto: {
    label: "开始对话", h: "第一步是", em: "一通电话",
    desc: "每项请求均由专人审核。如与进行中或筹备中的交易匹配，我们将直接联系您。",
    email_label: "电子邮件", nombre: "姓名", email: "电子邮件", telefono: "电话",
    interes: "您的需求", comprar: "购买", vender: "出售", quitar: "移除",
    consent_pre: "我已阅读并接受", consent_link: "隐私政策",
    enviar: "发送请求", enviando: "发送中…",
    ok: "请求已收到，我们将尽快与您联系。",
    error: "发送失败。请重试或发送邮件至",
    required: "请填写姓名和电子邮件。", consent_required: "请接受隐私政策。",
  },
  faq: {
    label: "常见问题", h: "我们的", em: "工作方式",
    items: [
      { q: "什么是场外（off-market）交易？", a: "以私密方式洽谈、不在任何平台或媒体上公开的买卖。资产仅在保密协议下向事先确认的合格买家展示。" },
      { q: "为什么选择场外出售？", a: "保密与掌控。没有公开曝光，资产不会被过度消耗，不会出现可见的降价，业主决定谁能获取信息。" },
      { q: "流程是怎样的？", a: "首先沟通了解资产或投资需求，然后签署保密协议、分析估值、向经核实的交易对手定向展示，并全程陪同至签约。" },
      { q: "经营哪些资产和金额范围？", a: "整栋建筑、酒店及连锁酒店、豪华住宅、地块、土地及特色资产，交易金额100万至2亿欧元。以马德里为核心，同时覆盖西班牙及海外。" },
      { q: "如何保障保密性？", a: "敏感信息仅在签署保密协议（NDA）后提供。联系人信息私密处理，未经授权不会提供给第三方。" },
      { q: "也经营游艇和飞机吗？", a: "是的。游艇、私人航空及其他高价值资产的买卖与包租，均需预约，保密标准相同。" },
    ],
  },
  footer: {
    desc: "高价值场外房地产交易中介。马德里、西班牙及国际市场。",
    col_destinos: "目的地", col_activos: "资产", col_firma: "关于我们", col_contacto: "联系", col_legal: "法律信息",
    firma_links: { firma: "关于我们", faq: "常见问题", vender: "出售", contacto: "联系" },
    aviso: "法律声明", privacidad: "隐私政策", cookies: "Cookie 政策", rights: "版权所有",
  },
};

export const T: Record<Lang, Dict> = { es, en, fr, de, it, pt, ru, ar, zh };

export const LANG_OPTIONS: { code: Lang; flag: string; label: string }[] = [
  { code: "es", flag: "🇪🇸", label: "Español" }, { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" }, { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "it", flag: "🇮🇹", label: "Italiano" }, { code: "pt", flag: "🇵🇹", label: "Português" },
  { code: "ru", flag: "🇷🇺", label: "Русский" }, { code: "ar", flag: "🇸🇦", label: "العربية" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
];

export function isLang(v: string | null): v is Lang {
  return !!v && v in T;
}
