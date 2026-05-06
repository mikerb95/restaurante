/* global React, MENU, TESTIMONIALS, HOURS, Icon, StarRow, TagBadges, FoodPlaceholder, fmt, useCart */
const { useState: useStateL, useEffect: useEffectL } = React;

/* ============= NAV (Top + Bottom) ============= */
const TopNav = ({ onNavigate, current, onOpenCart, onOpenReserve }) => {
  const { count } = useCart();
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(250,246,240,0.85)",
      backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <button onClick={() => onNavigate("home")} className="row" style={{ gap: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ink)", color: "var(--bg)", display: "grid", placeItems: "center", fontFamily: "var(--serif)", fontSize: 18, fontWeight: 600 }}>F</span>
          <span className="font-serif" style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em" }}>Fonda Norte</span>
        </button>

        <nav className="row" style={{ gap: 4, display: "none" }} className-md="row">
          {[["home","Inicio"],["menu","Menú"],["reservar","Reservar"],["domicilios","Domicilios"]].map(([k,l]) => (
            <button key={k} onClick={() => onNavigate(k)} className="btn btn-sm"
              style={{ background: current === k ? "var(--bg-2)" : "transparent", color: "var(--ink)", borderRadius: "var(--r-full)" }}>
              {l}
            </button>
          ))}
        </nav>

        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={onOpenReserve} style={{ display: "none" }} data-desktop>
            <Icon name="cal" size={16} /> Reservar
          </button>
          <button className="btn btn-icon" onClick={onOpenCart} style={{ background: "var(--ink)", color: "var(--bg)", position: "relative" }} aria-label="Carrito">
            <Icon name="cart" size={18} />
            {count > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 600, minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999, display: "grid", placeItems: "center" }}>
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          header nav { display: flex !important; }
          header [data-desktop] { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
};

const BottomNav = ({ current, onNavigate }) => {
  const { count } = useCart();
  const items = [
    { id: "home", label: "Inicio", icon: "home" },
    { id: "menu", label: "Menú", icon: "grid" },
    { id: "reservar", label: "Reservar", icon: "cal" },
    { id: "domicilios", label: "Pedir", icon: "truck" },
    { id: "carrito", label: "Carrito", icon: "cart", badge: count },
  ];
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
      background: "rgba(250,246,240,0.95)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      borderTop: "1px solid var(--line)",
      paddingBottom: "env(safe-area-inset-bottom)",
    }} className="bottom-nav">
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, padding: "8px 4px" }}>
        {items.map(it => (
          <button key={it.id} onClick={() => onNavigate(it.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 4px",
              color: current === it.id ? "var(--ink)" : "var(--ink-3)",
              fontWeight: current === it.id ? 600 : 500, fontSize: 10, letterSpacing: 0.02, position: "relative", minHeight: 56,
              transition: "color 160ms var(--ease)",
            }}>
            <span style={{ position: "relative" }}>
              <Icon name={it.icon} size={22} stroke={current === it.id ? 1.8 : 1.4} />
              {it.badge > 0 && (
                <span style={{ position: "absolute", top: -4, right: -8, background: "var(--accent)", color: "#fff", fontSize: 9, fontWeight: 600, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 999, display: "grid", placeItems: "center" }}>{it.badge}</span>
              )}
            </span>
            {it.label}
          </button>
        ))}
      </div>
      <style>{`
        @media (min-width: 768px) { .bottom-nav { display: none !important; } }
      `}</style>
    </nav>
  );
};

/* ============= HERO ============= */
const Hero = ({ onReserve, onMenu }) => {
  return (
    <section style={{ padding: "32px 20px 48px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "grid", gap: 28, gridTemplateColumns: "1fr" }} className="hero-grid">
        <div style={{ paddingTop: 12 }}>
          <span className="eyebrow row" style={{ gap: 8 }}>
            <span style={{ width: 24, height: 1, background: "var(--ink-3)" }}></span>
            Cocina de temporada · Bogotá
          </span>
          <h1 className="font-serif" style={{ fontSize: "clamp(44px, 9vw, 92px)", lineHeight: 0.95, fontWeight: 400, margin: "16px 0 20px" }}>
            Un menú<br/>
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>vivo</em>, una mesa<br/>
            que se siente como casa.
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 480, lineHeight: 1.55, margin: "0 0 28px" }}>
            Cocina contemporánea con producto local. Cambiamos la carta cada estación según lo que cosechan nuestros agricultores aliados.
          </p>
          <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-accent btn-lg" onClick={onReserve}>
              Reservar ahora <Icon name="arrow" size={16} />
            </button>
            <button className="btn btn-ghost btn-lg" onClick={onMenu}>
              Ver el menú
            </button>
          </div>
          <div className="row" style={{ gap: 22, marginTop: 36, flexWrap: "wrap" }}>
            <div>
              <div className="row" style={{ gap: 4, color: "var(--accent)" }}>
                {Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" size={14} stroke={0} />)}
              </div>
              <div className="tiny muted" style={{ marginTop: 4 }}>4.9 · 1.284 reseñas</div>
            </div>
            <div className="divider" style={{ width: 1, height: 32 }}></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Mesa Selecta 2025</div>
              <div className="tiny muted" style={{ marginTop: 4 }}>Top 50 restaurantes</div>
            </div>
          </div>
        </div>

        <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: "var(--r-xl)", overflow: "hidden", background: "var(--bg-3)" }}>
          <FoodPlaceholder label={"// HERO IMAGE\nfoto de plato estrella\n4:5 alta resolución"} height={"100%"} />
          <div style={{ position: "absolute", left: 16, bottom: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end", color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
            <div>
              <div className="font-serif" style={{ fontSize: 26, fontWeight: 500 }}>Plato del día</div>
              <div style={{ opacity: 0.9, fontSize: 13 }}>Lomo Wagyu A5 · Reducción de Oporto</div>
            </div>
          </div>
          <div style={{ position: "absolute", top: 16, right: 16, padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.92)", color: "var(--ink)", fontSize: 11, fontWeight: 600, letterSpacing: 0.04 }}>
            ABIERTO HOY · 12:30 — 22:00
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) {
          .hero-grid { grid-template-columns: 1.05fr 1fr !important; gap: 56px !important; align-items: center; }
        }
      `}</style>
    </section>
  );
};

/* ============= FEATURED DISHES ============= */
const FeaturedDishes = ({ onView }) => {
  const featured = MENU.filter(m => m.featured).slice(0, 3);
  return (
    <section style={{ padding: "48px 20px", maxWidth: 1280, margin: "0 auto" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <span className="eyebrow">Menú destacado</span>
          <h2 className="font-serif" style={{ fontSize: "clamp(32px, 5vw, 48px)", margin: "8px 0 0", fontWeight: 400 }}>
            Tres platos estrella
          </h2>
        </div>
        <button className="btn btn-ghost" onClick={() => onView("menu")}>
          Ver todo el menú <Icon name="arrow" size={14} />
        </button>
      </div>

      <div className="featured-grid" style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>
        {featured.map((d, i) => (
          <DishCard key={d.id} dish={d} large={i === 0} onView={onView} />
        ))}
      </div>
      <style>{`
        @media (min-width: 768px) {
          .featured-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </section>
  );
};

const DishCard = ({ dish, large, onView }) => {
  const { add } = useCart();
  const [added, setAdded] = useStateL(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    add(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article
      onClick={() => onView && onView(dish)}
      style={{
        background: "var(--white)", borderRadius: "var(--r-lg)", overflow: "hidden",
        border: "1px solid var(--line)", cursor: "pointer",
        transition: "transform 240ms var(--ease), box-shadow 240ms var(--ease), border-color 240ms var(--ease)",
        display: "flex", flexDirection: "column",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; e.currentTarget.style.borderColor = "var(--line-2)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "var(--line)"; }}
    >
      <div style={{ position: "relative" }}>
        <FoodPlaceholder label={`// ${dish.name}\nfoto del plato`} height={large ? 260 : 200} />
        {dish.popular && (
          <span style={{ position: "absolute", top: 12, left: 12, padding: "5px 10px", borderRadius: 999, background: "var(--ink)", color: "var(--bg)", fontSize: 10, fontWeight: 600, letterSpacing: 0.06 }}>
            MÁS PEDIDO
          </span>
        )}
      </div>
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <h3 className="font-serif" style={{ margin: 0, fontSize: 20, fontWeight: 500, lineHeight: 1.15 }}>{dish.name}</h3>
          <span style={{ fontWeight: 600, fontSize: 15, whiteSpace: "nowrap" }}>{fmt(dish.price)}</span>
        </div>
        <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {dish.desc}
        </p>
        <div className="row" style={{ justifyContent: "space-between", marginTop: "auto", paddingTop: 8 }}>
          <div className="row" style={{ gap: 8 }}>
            <StarRow rating={dish.rating} />
            <TagBadges tags={dish.tags} />
          </div>
          <button onClick={handleAdd} className="btn btn-icon btn-soft" aria-label="Añadir" style={{ width: 36, height: 36 }}>
            <Icon name={added ? "check" : "plus"} size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

/* ============= TESTIMONIALS ============= */
const Testimonials = () => {
  return (
    <section style={{ padding: "48px 20px", background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <span className="eyebrow">Lo que dicen</span>
        <h2 className="font-serif" style={{ fontSize: "clamp(32px, 5vw, 48px)", margin: "8px 0 36px", fontWeight: 400, maxWidth: 700 }}>
          La crítica y nuestros<br/>comensales coinciden.
        </h2>
        <div className="testimonial-grid" style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>
          {TESTIMONIALS.map(t => (
            <blockquote key={t.id} style={{ margin: 0, background: "var(--white)", padding: 24, borderRadius: "var(--r-lg)", border: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="row" style={{ gap: 2, color: "var(--accent)" }}>
                {Array.from({ length: t.rating }).map((_, i) => <Icon key={i} name="star" size={14} stroke={0} />)}
              </div>
              <p className="font-serif" style={{ fontSize: 19, lineHeight: 1.4, margin: 0, fontWeight: 400 }}>
                "{t.quote}"
              </p>
              <footer style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                <div className="muted tiny" style={{ marginTop: 2 }}>{t.role}</div>
              </footer>
            </blockquote>
          ))}
        </div>
        <style>{`
          @media (min-width: 768px) {
            .testimonial-grid { grid-template-columns: repeat(3, 1fr) !important; }
          }
        `}</style>
      </div>
    </section>
  );
};

/* ============= INSTAGRAM FEED ============= */
const InstagramFeed = () => {
  const posts = [
    "// post 1\nAmuse-bouche\nde temporada",
    "// post 2\nNuestro\nsommelier",
    "// post 3\nFermentaciones\ndel laboratorio",
    "// post 4\nEvento\nprivado",
    "// post 5\nCosecha\ndel huerto",
    "// post 6\nEspresso\nde finca",
  ];
  return (
    <section style={{ padding: "48px 20px", maxWidth: 1280, margin: "0 auto" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <span className="eyebrow">@fondanorte</span>
          <h2 className="font-serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: "8px 0 0", fontWeight: 400 }}>
            Síguenos en Instagram
          </h2>
        </div>
        <a className="btn btn-ghost" href="#">
          <Icon name="instagram" size={16} /> @fondanorte
        </a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }} className="ig-grid">
        {posts.map((p, i) => (
          <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--r-md)", overflow: "hidden", cursor: "pointer", transition: "transform 200ms var(--ease)" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}>
            <FoodPlaceholder label={p} height={"100%"} />
          </div>
        ))}
      </div>
      <style>{`
        @media (min-width: 768px) {
          .ig-grid { grid-template-columns: repeat(6, 1fr) !important; }
        }
      `}</style>
    </section>
  );
};

/* ============= FOOTER (Mapa, horarios, redes) ============= */
const Footer = () => {
  return (
    <footer style={{ background: "var(--ink)", color: "var(--bg)", padding: "48px 20px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gap: 32, gridTemplateColumns: "1fr" }}>
          <div>
            <div className="row" style={{ gap: 10, marginBottom: 18 }}>
              <span style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg)", color: "var(--ink)", display: "grid", placeItems: "center", fontFamily: "var(--serif)", fontSize: 20, fontWeight: 600 }}>F</span>
              <span className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>Fonda Norte</span>
            </div>
            <p style={{ color: "rgba(250,246,240,0.6)", fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>
              Cocina contemporánea de producto local. Una mesa, una historia, una temporada a la vez.
            </p>
            <div className="row" style={{ gap: 10, marginTop: 20 }}>
              {["instagram", "facebook", "twitter"].map(n => (
                <a key={n} href="#" className="btn btn-icon" style={{ background: "rgba(250,246,240,0.08)", color: "var(--bg)" }} aria-label={n}>
                  <Icon name={n} size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{ color: "rgba(250,246,240,0.5)", marginBottom: 14 }}>Visítanos</div>
            <div style={{ fontSize: 14, lineHeight: 1.7 }}>
              <div>Calle 85 #11-53</div>
              <div>Bogotá, Colombia</div>
              <div style={{ marginTop: 12 }}><a href="tel:+5715551234" style={{ borderBottom: "1px solid rgba(250,246,240,0.3)" }}>+57 (1) 555 1234</a></div>
              <div><a href="mailto:hola@fondanorte.co" style={{ borderBottom: "1px solid rgba(250,246,240,0.3)" }}>hola@fondanorte.co</a></div>
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{ color: "rgba(250,246,240,0.5)", marginBottom: 14 }}>Horarios</div>
            <div style={{ fontSize: 14, lineHeight: 1.9 }}>
              {HOURS.map(h => (
                <div key={h.day} className="row" style={{ justifyContent: "space-between", gap: 16, borderBottom: "1px solid rgba(250,246,240,0.08)", padding: "4px 0" }}>
                  <span>{h.day}</span>
                  <span style={{ color: "rgba(250,246,240,0.6)" }}>{h.h}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{ color: "rgba(250,246,240,0.5)", marginBottom: 14 }}>Encuéntranos</div>
            <MapEmbed />
          </div>
        </div>

        <div className="row" style={{ justifyContent: "space-between", marginTop: 40, paddingTop: 20, borderTop: "1px solid rgba(250,246,240,0.1)", flexWrap: "wrap", gap: 8 }}>
          <span className="tiny" style={{ color: "rgba(250,246,240,0.5)" }}>© 2026 Fonda Norte. Todos los derechos reservados.</span>
          <span className="tiny" style={{ color: "rgba(250,246,240,0.5)" }}>Diseñado con cuidado en Bogotá.</span>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .footer-grid { grid-template-columns: 1.2fr 1fr 1fr 1.4fr !important; gap: 48px !important; }
          }
        `}</style>
      </div>
    </footer>
  );
};

/* Pseudo map */
const MapEmbed = () => (
  <div style={{ position: "relative", aspectRatio: "16/10", borderRadius: "var(--r-md)", overflow: "hidden", background: "#2a241e" }}>
    <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="320" height="200" fill="#2a241e"/>
      <g stroke="rgba(250,246,240,0.10)" strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => <line key={"v"+i} x1={i*30} y1="0" x2={i*30} y2="200" />)}
        {Array.from({ length: 8 }).map((_, i) => <line key={"h"+i} x1="0" y1={i*30} x2="320" y2={i*30} />)}
      </g>
      <path d="M0 80 L320 90" stroke="rgba(250,246,240,0.20)" strokeWidth="3" fill="none"/>
      <path d="M150 0 L160 200" stroke="rgba(250,246,240,0.20)" strokeWidth="3" fill="none"/>
      <path d="M40 40 Q120 100 280 60" stroke="rgba(250,246,240,0.15)" strokeWidth="2" fill="none"/>
      <circle cx="160" cy="100" r="22" fill="oklch(0.58 0.12 38 / 0.2)"/>
      <circle cx="160" cy="100" r="10" fill="oklch(0.58 0.12 38)"/>
      <circle cx="160" cy="100" r="4" fill="#fff"/>
    </svg>
    <div style={{ position: "absolute", left: 12, bottom: 12, padding: "6px 10px", background: "rgba(250,246,240,0.95)", color: "var(--ink)", fontSize: 11, fontWeight: 600, borderRadius: 6 }}>
      <Icon name="pin" size={12} /> Calle 85 #11-53
    </div>
  </div>
);

/* ============= LANDING PAGE ============= */
const Landing = ({ onNavigate, onOpenDish, onReserve }) => {
  return (
    <div>
      <Hero onReserve={onReserve} onMenu={() => onNavigate("menu")} />
      <FeaturedDishes onView={(d) => typeof d === "string" ? onNavigate(d) : onOpenDish(d)} />
      <Testimonials />
      <InstagramFeed />
      <Footer />
    </div>
  );
};

Object.assign(window, { TopNav, BottomNav, Landing, DishCard, Footer, MapEmbed });
