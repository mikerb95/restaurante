/* global React, MENU, CATEGORIES, ALLERGEN_FILTERS, Icon, StarRow, TagBadges, FoodPlaceholder, fmt, useCart */
const { useState: useStateM, useEffect: useEffectM, useMemo: useMemoM } = React;

/* ============= MENU SCREEN ============= */
const MenuScreen = ({ onOpenDish }) => {
  const [cat, setCat] = useStateM("todos");
  const [allergens, setAllergens] = useStateM([]);
  const [search, setSearch] = useStateM("");
  const [loading, setLoading] = useStateM(false);

  // Trigger skeleton when filters change
  useEffectM(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, [cat, allergens, search]);

  const toggleAllergen = (id) => {
    setAllergens(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const filtered = useMemoM(() => {
    return MENU.filter(d => {
      if (cat !== "todos" && d.cat !== cat) return false;
      if (allergens.length && !allergens.every(a => d.tags.includes(a))) return false;
      if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [cat, allergens, search]);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 20px 32px" }}>
      <div style={{ marginBottom: 24 }}>
        <span className="eyebrow">La carta</span>
        <h1 className="font-serif" style={{ fontSize: "clamp(36px, 6vw, 56px)", margin: "8px 0 12px", fontWeight: 400 }}>Menú digital</h1>
        <p className="muted" style={{ maxWidth: 520, fontSize: 15, margin: 0 }}>
          Carta de temporada · Otoño 2026. Toca un plato para ver detalles, maridajes y agregar al pedido.
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 18 }}>
        <Icon name="search" size={16} />
        <input
          className="input"
          placeholder="Buscar plato…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 40 }}
        />
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)", pointerEvents: "none" }}>
          <Icon name="search" size={16} />
        </span>
      </div>

      {/* Categories */}
      <div className="chip-rail" style={{ marginBottom: 12 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} className={`chip ${cat === c.id ? "active" : ""}`} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Allergen filters */}
      <div className="chip-rail" style={{ marginBottom: 24 }}>
        <span className="tiny muted" style={{ alignSelf: "center", marginRight: 4, whiteSpace: "nowrap" }}>Filtrar:</span>
        {ALLERGEN_FILTERS.map(a => (
          <button key={a.id} className={`chip chip-outline ${allergens.includes(a.id) ? "active" : ""}`} onClick={() => toggleAllergen(a.id)}>
            <Icon name={a.id === "sin-gluten" ? "wheat" : "leaf"} size={13} /> {a.label}
          </button>
        ))}
        {(allergens.length > 0 || search) && (
          <button className="chip" style={{ background: "transparent", color: "var(--accent)" }} onClick={() => { setAllergens([]); setSearch(""); }}>
            Limpiar
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <MenuGrid items={filtered} onOpenDish={onOpenDish} />
      )}
    </div>
  );
};

const SkeletonCard = () => (
  <div style={{ background: "var(--white)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", padding: 14 }}>
    <div className="skeleton" style={{ height: 140, borderRadius: "var(--r-md)", marginBottom: 14 }}></div>
    <div className="skeleton" style={{ height: 16, width: "70%", marginBottom: 8 }}></div>
    <div className="skeleton" style={{ height: 12, width: "100%", marginBottom: 6 }}></div>
    <div className="skeleton" style={{ height: 12, width: "80%", marginBottom: 14 }}></div>
    <div className="row" style={{ justifyContent: "space-between" }}>
      <div className="skeleton" style={{ height: 14, width: 70 }}></div>
      <div className="skeleton" style={{ height: 32, width: 32, borderRadius: 999 }}></div>
    </div>
  </div>
);

const SkeletonGrid = () => (
  <div className="menu-grid" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

const EmptyState = () => (
  <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--white)", borderRadius: "var(--r-lg)", border: "1px dashed var(--line-2)" }}>
    <div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div>
    <h3 className="font-serif" style={{ margin: "0 0 6px", fontWeight: 500 }}>Sin resultados</h3>
    <p className="muted" style={{ margin: 0, fontSize: 14 }}>Prueba a quitar algún filtro o cambiar la búsqueda.</p>
  </div>
);

const MenuGrid = ({ items, onOpenDish }) => {
  const { add } = useCart();
  return (
    <div className="menu-grid" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
      {items.map(d => (
        <article key={d.id} onClick={() => onOpenDish(d)}
          style={{
            background: "var(--white)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)",
            cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column",
            transition: "transform 200ms var(--ease), box-shadow 200ms var(--ease), border-color 200ms var(--ease)",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--line-2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "var(--line)"; }}
        >
          <div style={{ position: "relative" }}>
            <FoodPlaceholder label={`// ${d.name}`} height={160} />
            {d.popular && (
              <span style={{ position: "absolute", top: 10, left: 10, padding: "4px 8px", borderRadius: 999, background: "rgba(26,23,20,0.86)", color: "var(--bg)", fontSize: 10, fontWeight: 600, letterSpacing: 0.04 }}>
                POPULAR
              </span>
            )}
          </div>
          <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <h3 className="font-serif" style={{ margin: 0, fontSize: 17, fontWeight: 500, lineHeight: 1.2 }}>{d.name}</h3>
              <span style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>{fmt(d.price)}</span>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: 12.5, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {d.desc}
            </p>
            <div className="row" style={{ justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
              <div className="row" style={{ gap: 6 }}>
                <StarRow rating={d.rating} size={11} />
                <TagBadges tags={d.tags} />
              </div>
              <button onClick={(e) => { e.stopPropagation(); add(d); }} className="btn btn-icon btn-soft" style={{ width: 32, height: 32, minHeight: 32 }} aria-label="Añadir">
                <Icon name="plus" size={14} />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

/* ============= DISH MODAL ============= */
const DishModal = ({ dish, onClose }) => {
  const { add } = useCart();
  const [qty, setQty] = useStateM(1);
  const [added, setAdded] = useStateM(false);

  if (!dish) return null;
  const score = Math.round(dish.rating * 20);

  const handleAdd = () => {
    add(dish, qty);
    setAdded(true);
    setTimeout(() => onClose(), 700);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ position: "relative" }}>
          <FoodPlaceholder label={`// ${dish.name}\nfoto detallada`} height={280} />
          <button onClick={onClose} className="btn btn-icon" style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.92)", color: "var(--ink)" }} aria-label="Cerrar">
            <Icon name="close" size={18} />
          </button>
          {dish.popular && (
            <span style={{ position: "absolute", top: 14, left: 14, padding: "5px 10px", borderRadius: 999, background: "var(--ink)", color: "var(--bg)", fontSize: 10, fontWeight: 600, letterSpacing: 0.06 }}>
              MÁS PEDIDO
            </span>
          )}
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <h2 className="font-serif" style={{ margin: 0, fontSize: 28, fontWeight: 500, lineHeight: 1.1 }}>{dish.name}</h2>
              <span style={{ fontWeight: 600, fontSize: 18, whiteSpace: "nowrap" }}>{fmt(dish.price)}</span>
            </div>
            <div className="row" style={{ gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <TagBadges tags={dish.tags} />
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)" }}>{dish.desc}</p>

          {/* Cata score */}
          <div style={{ background: "var(--bg-2)", borderRadius: "var(--r-md)", padding: 14 }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
              <span className="eyebrow">Puntaje de cata</span>
              <span style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, color: "var(--accent)" }}>{score}<span className="tiny muted" style={{ fontFamily: "var(--sans)", marginLeft: 2, color: "var(--ink-3)" }}>/100</span></span>
            </div>
            <div style={{ height: 6, background: "var(--bg-3)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${score}%`, height: "100%", background: "var(--accent)", borderRadius: 999, transition: "width 600ms var(--ease)" }}></div>
            </div>
            <div className="row" style={{ justifyContent: "space-between", marginTop: 10, fontSize: 12 }}>
              <span className="muted">Aroma</span><span className="muted">Sabor</span><span className="muted">Textura</span><span className="muted">Plato</span>
            </div>
          </div>

          {/* Pairing */}
          <div className="row" style={{ gap: 12, padding: "14px 16px", background: "var(--white)", border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
            <span style={{ width: 36, height: 36, borderRadius: 999, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="spark" size={18} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="eyebrow" style={{ marginBottom: 2 }}>Maridaje sugerido</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{dish.pairing}</div>
            </div>
          </div>

          {/* Qty + add */}
          <div className="row" style={{ justifyContent: "space-between", gap: 12, paddingTop: 4 }}>
            <div className="row" style={{ gap: 0, border: "1px solid var(--line)", borderRadius: 999, padding: 4, background: "var(--white)" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="btn btn-icon" style={{ width: 36, height: 36, minHeight: 36 }}><Icon name="minus" size={14} /></button>
              <span style={{ minWidth: 28, textAlign: "center", fontWeight: 600, fontSize: 15 }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="btn btn-icon" style={{ width: 36, height: 36, minHeight: 36 }}><Icon name="plus" size={14} /></button>
            </div>
            <button onClick={handleAdd} className="btn btn-accent btn-lg" style={{ flex: 1 }}>
              {added ? <><Icon name="check" size={16} /> Añadido</> : <>Añadir · {fmt(dish.price * qty)}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { MenuScreen, DishModal, SkeletonCard });
