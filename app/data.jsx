/* global React */
const { useState, useEffect, useMemo, useRef, createContext, useContext } = React;

/* ================== DATA ================== */
const MENU = [
  // Entradas
  { id: "e1", cat: "entradas", name: "Burrata de tomate amarillo", price: 32000, tags: ["vegetariano"], rating: 4.8, desc: "Burrata cremosa de búfala sobre cama de tomate amarillo confitado, albahaca morada, aceite de oliva andaluz y hojuelas de sal de Maras.", pairing: "Albariño Rías Baixas 2023", featured: false, popular: true },
  { id: "e2", cat: "entradas", name: "Tartar de remolacha", price: 28000, tags: ["vegano", "sin-gluten"], rating: 4.6, desc: "Remolacha rostizada en tartar con alcaparras, encurtidos de chalota, mostaza dijon y crujiente de quinoa negra.", pairing: "Pinot Noir frío de Loira", featured: false },
  { id: "e3", cat: "entradas", name: "Carpaccio de pulpo", price: 38000, tags: ["sin-gluten"], rating: 4.9, desc: "Pulpo del Pacífico cocido a baja temperatura, laminado fino con aceite de pimentón, limón Meyer y aceitunas Kalamata.", pairing: "Verdejo Rueda 2024", featured: false, popular: true },
  { id: "e4", cat: "entradas", name: "Tostada de aguacate", price: 24000, tags: ["vegano"], rating: 4.4, desc: "Pan de masa madre de fermentación lenta con aguacate Hass, rábano, ají amarillo y semillas tostadas.", pairing: "Sauvignon Blanc Marlborough", featured: false },

  // Fuertes
  { id: "f1", cat: "fuertes", name: "Lomo Wagyu A5", price: 145000, tags: [], rating: 4.95, desc: "Corte de Wagyu japonés A5 sellado en hierro fundido, mantequilla de hueso de res, puré de coliflor ahumada y reducción de Oporto.", pairing: "Malbec Reserva Mendoza 2019", featured: true, popular: true },
  { id: "f2", cat: "fuertes", name: "Risotto de hongos", price: 58000, tags: ["vegetariano", "sin-gluten"], rating: 4.7, desc: "Arborio cremoso con mezcla de hongos silvestres, trufa negra rallada, parmesano Reggiano de 24 meses.", pairing: "Chardonnay Borgoña 2022", featured: true },
  { id: "f3", cat: "fuertes", name: "Pesca del día", price: 78000, tags: ["sin-gluten"], rating: 4.85, desc: "Filete de pesca local del Pacífico, costra de hierbas mediterráneas, vegetales de raíz y beurre blanc cítrico.", pairing: "Albariño Rías Baixas 2023", featured: true, popular: true },
  { id: "f4", cat: "fuertes", name: "Curry de coliflor", price: 46000, tags: ["vegano", "sin-gluten"], rating: 4.5, desc: "Coliflor rostizada en curry rojo de coco, arroz basmati, chutney de mango y cilantro fresco.", pairing: "Riesling Mosela seco", featured: false },
  { id: "f5", cat: "fuertes", name: "Pappardelle al ragú", price: 52000, tags: [], rating: 4.7, desc: "Pasta fresca al huevo con ragú de cordero cocinado 6 horas, gremolata de menta y pecorino añejado.", pairing: "Chianti Classico Riserva", featured: false },

  // Bebidas
  { id: "b1", cat: "bebidas", name: "Negroni de mandarina", price: 28000, tags: ["sin-gluten"], rating: 4.8, desc: "Gin botánico, vermut rojo, Campari infusionado en mandarina valencia, hielo monolítico.", pairing: "Servir con Carpaccio de pulpo", featured: false, popular: true },
  { id: "b2", cat: "bebidas", name: "Kombucha de jengibre", price: 14000, tags: ["vegano", "sin-gluten"], rating: 4.3, desc: "Kombucha artesanal de fermentación 14 días, jengibre fresco, cardamomo y limón orgánico.", pairing: "Aperitivo o tartar", featured: false },
  { id: "b3", cat: "bebidas", name: "Vino de la casa (copa)", price: 22000, tags: ["vegano", "sin-gluten"], rating: 4.5, desc: "Selección rotativa del sommelier. Hoy: Tempranillo Ribera del Duero crianza 2021.", pairing: "Cualquier carne roja", featured: false },
  { id: "b4", cat: "bebidas", name: "Espresso de finca", price: 8000, tags: ["vegano", "sin-gluten"], rating: 4.6, desc: "Café de origen único, finca El Diviso, tueste medio, notas a chocolate negro y panela.", pairing: "Postres", featured: false },
];

const CATEGORIES = [
  { id: "todos", label: "Todo" },
  { id: "entradas", label: "Entradas" },
  { id: "fuertes", label: "Fuertes" },
  { id: "bebidas", label: "Bebidas" },
];

const ALLERGEN_FILTERS = [
  { id: "vegano", label: "Vegano" },
  { id: "vegetariano", label: "Vegetariano" },
  { id: "sin-gluten", label: "Sin gluten" },
];

const TESTIMONIALS = [
  { id: 1, name: "María Restrepo", role: "Crítica gastronómica · El Espectador", quote: "Una cocina que respeta el ingrediente. Cada plato cuenta una historia y el servicio acompaña sin invadir.", rating: 5 },
  { id: 2, name: "James Caldwell", role: "Food & Wine Magazine", quote: "El Wagyu A5 con reducción de Oporto es, sin duda, una de las mejores experiencias de carne en Latinoamérica.", rating: 5 },
  { id: 3, name: "Sofía Henao", role: "Comensal habitual", quote: "Volvemos cada aniversario. La consistencia es admirable y los nuevos platos del menú de temporada nunca decepcionan.", rating: 5 },
];

const HOURS = [
  { day: "Lunes", h: "Cerrado" },
  { day: "Martes — Jueves", h: "12:30 — 22:00" },
  { day: "Viernes — Sábado", h: "12:30 — 23:30" },
  { day: "Domingo", h: "12:30 — 17:00" },
];

/* ================== UTILS ================== */
const fmt = (n) => "$" + n.toLocaleString("es-CO");

const Icon = ({ name, size = 20, stroke = 1.6 }) => {
  const s = size;
  const sw = stroke;
  const common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    menu: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
    close: <><path d="M18 6 6 18M6 6l12 12"/></>,
    cart: <><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 12h12L22 8H6"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    star: <><path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.3 6.5 20.2l1.1-6.2L3 9.6l6.3-.9z"/></>,
    chevronLeft: <><path d="m15 6-6 6 6 6"/></>,
    chevronRight: <><path d="m9 6 6 6-6 6"/></>,
    chevronDown: <><path d="m6 9 6 6 6-6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <><path d="M5 12h14"/></>,
    map: <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1A19.5 19.5 0 0 1 5 13a19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 3.9 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6.3 6.3l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    cal: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    moon: <><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></>,
    leaf: <><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9h6v6c0 5-4 9-9 9z"/><path d="M4 20c2-4 5-7 9-9"/></>,
    wheat: <><path d="M12 2v20M16 6c0 2-2 4-4 4M8 6c0 2 2 4 4 4M16 11c0 2-2 4-4 4M8 11c0 2 2 4 4 4M16 16c0 2-2 4-4 4M8 16c0 2 2 4 4 4"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor"/></>,
    facebook: <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></>,
    twitter: <><path d="M22 5.8a8 8 0 0 1-2.4.7 4 4 0 0 0 1.8-2.3 8 8 0 0 1-2.6 1A4 4 0 0 0 12 9.1a11 11 0 0 1-8-4 4 4 0 0 0 1.2 5.4A4 4 0 0 1 3.4 10v.1a4 4 0 0 0 3.2 4 4 4 0 0 1-1.8 0 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.6 11 11 0 0 0 8 20.4c7.2 0 11.1-6 11.1-11.1V8.8A8 8 0 0 0 22 5.8z"/></>,
    home: <><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6 1 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    bag: <><path d="M5 7h14l-1 14H6z"/><path d="M9 7a3 3 0 1 1 6 0"/></>,
    truck: <><rect x="1" y="6" width="14" height="11" rx="1"/><path d="M15 9h4l3 3v5h-7"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
    check: <><path d="m5 12 5 5 9-11"/></>,
    card: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>,
    bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    spark: <><path d="m12 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
    pin: <><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
  };
  return <svg {...common}>{paths[name] || null}</svg>;
};

const StarRow = ({ rating, size = 13 }) => {
  return (
    <span className="row" style={{ gap: 2, color: "var(--accent)" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={size} stroke={0} />
      ))}
      <span className="muted tiny" style={{ marginLeft: 4, color: "var(--ink-2)", fontWeight: 500 }}>{rating.toFixed(1)}</span>
    </span>
  );
};

const TagBadges = ({ tags = [] }) => (
  <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
    {tags.includes("vegano") && <span className="badge badge-vegan"><Icon name="leaf" size={11} /> Vegano</span>}
    {tags.includes("vegetariano") && !tags.includes("vegano") && <span className="badge badge-vegan"><Icon name="leaf" size={11} /> Veg</span>}
    {tags.includes("sin-gluten") && <span className="badge badge-gf"><Icon name="wheat" size={11} /> Sin gluten</span>}
  </div>
);

/* Image placeholder */
const FoodPlaceholder = ({ label, height = 160, accent }) => (
  <div className="img-placeholder" style={{ height, borderRadius: "var(--r-md)", background: accent || undefined }}>
    {label}
  </div>
);

/* Toggle switch — shared across admin modules */
const Toggle = ({ on, onChange, disabled }) => (
  <button onClick={disabled ? undefined : onChange}
    aria-checked={on} role="switch"
    style={{
      width: 38, height: 22, borderRadius: 999, padding: 2,
      background: on ? "var(--success)" : "var(--bg-3)",
      transition: "background 180ms var(--ease)", display: "flex", alignItems: "center",
      opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer",
    }}>
    <span style={{
      width: 18, height: 18, borderRadius: 999, background: "#fff",
      transform: on ? "translateX(16px)" : "translateX(0)",
      transition: "transform 200ms var(--ease)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    }}/>
  </button>
);

/* Export everything to window */
Object.assign(window, {
  MENU, CATEGORIES, ALLERGEN_FILTERS, TESTIMONIALS, HOURS,
  fmt, Icon, StarRow, TagBadges, FoodPlaceholder, Toggle,
});
