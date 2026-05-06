/* global React, ReactDOM */
const { useState: useStateApp, useEffect: useEffectApp } = React;

const App = () => {
  const [route, setRoute] = useStateApp("home");
  const [reserveOpen, setReserveOpen] = useStateApp(false);
  const [activeDish, setActiveDish] = useStateApp(null);
  const [adminMode, setAdminMode] = useStateApp(false);

  useEffectApp(() => {
    if (route !== "carrito") window.scrollTo({ top: 0 });
  }, [route, adminMode]);

  if (adminMode) {
    return <AdminScreen onExit={() => setAdminMode(false)} />;
  }

  const navigate = (r) => {
    if (r === "reservar") { setRoute("reservar"); }
    else { setRoute(r); }
  };

  return (
    <CartProvider>
      <div className="screen has-bottom-nav">
        <TopNav
          current={route}
          onNavigate={navigate}
          onOpenCart={() => setRoute("carrito")}
          onOpenReserve={() => setReserveOpen(true)}
        />

        {route === "home" && (
          <Landing
            onNavigate={navigate}
            onOpenDish={(d) => setActiveDish(d)}
            onReserve={() => setReserveOpen(true)}
          />
        )}
        {route === "menu" && (
          <MenuScreen onOpenDish={(d) => setActiveDish(d)} />
        )}
        {route === "reservar" && (
          <ReserveScreen />
        )}
        {route === "domicilios" && (
          <DomiciliosLanding onMenu={() => setRoute("menu")} />
        )}
        {route === "carrito" && (
          <CheckoutScreen onBack={() => setRoute("menu")} onComplete={() => setRoute("home")} />
        )}

        <BottomNav current={route === "carrito" ? "carrito" : route} onNavigate={navigate} />

        {/* Admin trigger (floating, discreet) */}
        <button
          onClick={() => setAdminMode(true)}
          className="btn btn-icon"
          style={{
            position: "fixed", bottom: 96, right: 16, zIndex: 30,
            background: "var(--ink)", color: "var(--bg)", boxShadow: "var(--shadow-lg)",
            width: 48, height: 48, minHeight: 48,
          }}
          aria-label="Panel admin"
          title="Abrir CRM admin"
        >
          <Icon name="settings" size={18} />
        </button>
        <style>{`
          @media (min-width: 768px) {
            button[aria-label="Panel admin"] { bottom: 24px !important; }
          }
        `}</style>

        {/* Modals */}
        {activeDish && <DishModal dish={activeDish} onClose={() => setActiveDish(null)} />}
        {reserveOpen && (
          <div className="modal-backdrop" onClick={() => setReserveOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640, padding: 0 }}>
              <div className="row" style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", justifyContent: "space-between", background: "var(--bg-2)" }}>
                <div className="font-serif" style={{ fontSize: 20, fontWeight: 500 }}>Reserva tu mesa</div>
                <button className="btn btn-icon btn-soft" onClick={() => setReserveOpen(false)}><Icon name="close" size={16}/></button>
              </div>
              <div style={{ padding: 20 }}>
                <ReserveScreen embedded onClose={() => setReserveOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </CartProvider>
  );
};

/* Domicilios mini-landing */
const DomiciliosLanding = ({ onMenu }) => (
  <div style={{ maxWidth: 1024, margin: "0 auto", padding: "24px 20px 40px" }}>
    <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
      <div className="dom-grid" style={{ display: "grid", gridTemplateColumns: "1fr", alignItems: "stretch" }}>
        <div style={{ padding: 28 }}>
          <span className="eyebrow">Domicilios</span>
          <h1 className="font-serif" style={{ fontSize: "clamp(32px, 6vw, 48px)", margin: "8px 0 12px", fontWeight: 400, lineHeight: 1.05 }}>
            Llevamos la mesa a tu casa.
          </h1>
          <p className="muted" style={{ margin: "0 0 20px", fontSize: 15, lineHeight: 1.55 }}>
            Empaque térmico, entrega en 35-45 min, cobertura en el norte de Bogotá. Pedido mínimo $40.000.
          </p>
          <button className="btn btn-accent btn-lg" onClick={onMenu}>Ver carta y pedir</button>
        </div>
        <div style={{ minHeight: 220 }}>
          <FoodPlaceholder label={"// foto domicilios\nempaque del restaurante"} height={"100%"}/>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .dom-grid { grid-template-columns: 1.2fr 1fr !important; }
        }
      `}</style>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
      {[
        { icon: "truck", title: "Cobertura norte", desc: "Calles 70 a 127, oriente y occidente." },
        { icon: "clock", title: "35-45 minutos", desc: "Tiempo promedio en condiciones normales." },
        { icon: "card", title: "Pago en línea", desc: "Tarjeta, PSE o efectivo contra entrega." },
      ].map(c => (
        <div key={c.title} className="card" style={{ padding: 18 }}>
          <span style={{ width: 36, height: 36, borderRadius: "var(--r-md)", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", marginBottom: 10 }}>
            <Icon name={c.icon} size={16} />
          </span>
          <div className="font-serif" style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>{c.title}</div>
          <p className="muted tiny" style={{ margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
