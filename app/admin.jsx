/* global React, Icon, fmt, MENU, FoodPlaceholder */
const { useState: useStateA, useMemo: useMemoA } = React;

/* ============= ADMIN CRM ============= */
const AdminScreen = ({ onExit }) => {
  const [section, setSection] = useStateA("dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-2)", display: "grid", gridTemplateColumns: "1fr" }} className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{
        background: "var(--ink)", color: "var(--bg)", padding: "20px 14px",
        position: "sticky", top: 0, alignSelf: "start", height: "auto",
        display: "flex", flexDirection: "row", overflowX: "auto", gap: 4,
        borderBottom: "1px solid rgba(250,246,240,0.1)",
      }}>
        <div className="row" style={{ gap: 10, padding: "0 6px", flexShrink: 0 }} data-brand>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg)", color: "var(--ink)", display: "grid", placeItems: "center", fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600 }}>F</span>
          <div data-brand-text style={{ display: "none" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 500 }}>Fonda Norte</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Admin · CRM</div>
          </div>
        </div>
        {[
          { id: "dashboard", label: "Dashboard", icon: "chart" },
          { id: "menu", label: "Menú", icon: "grid" },
          { id: "reservas", label: "Reservas", icon: "cal" },
          { id: "pedidos", label: "Pedidos", icon: "truck" },
          { id: "fotos", label: "Galería", icon: "image" },
          { id: "ajustes", label: "Ajustes", icon: "settings" },
        ].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className="admin-nav-btn"
            style={{
              padding: "10px 14px", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", gap: 10,
              background: section === s.id ? "rgba(250,246,240,0.12)" : "transparent",
              color: section === s.id ? "var(--bg)" : "rgba(250,246,240,0.65)",
              fontWeight: 500, fontSize: 13, transition: "all 140ms var(--ease)", whiteSpace: "nowrap",
              flexShrink: 0,
            }}>
            <Icon name={s.icon} size={16}/> <span data-label>{s.label}</span>
          </button>
        ))}
        <div style={{ flex: 1 }}></div>
        <button onClick={onExit} className="admin-nav-btn" style={{ padding: "10px 14px", borderRadius: "var(--r-md)", color: "rgba(250,246,240,0.65)", display: "flex", alignItems: "center", gap: 10, fontSize: 13, flexShrink: 0 }}>
          <Icon name="arrow" size={16}/> <span data-label>Volver al sitio</span>
        </button>
      </aside>

      {/* Content */}
      <main style={{ padding: "24px 20px", overflow: "hidden" }}>
        <AdminTopbar section={section}/>
        <div style={{ marginTop: 18 }}>
          {section === "dashboard" && <Dashboard/>}
          {section === "menu" && <MenuAdmin/>}
          {section === "reservas" && <ReservasAdmin/>}
          {section === "pedidos" && <PedidosAdmin/>}
          {section === "fotos" && <FotosAdmin/>}
          {section === "ajustes" && <AjustesAdmin/>}
        </div>
      </main>

      <style>{`
        @media (min-width: 900px) {
          .admin-shell { grid-template-columns: 240px 1fr !important; }
          .admin-sidebar { flex-direction: column !important; height: 100vh !important; padding: 22px 14px !important; gap: 4px !important; overflow-x: hidden !important; }
          .admin-sidebar [data-brand] { padding: 6px 6px 18px !important; border-bottom: 1px solid rgba(250,246,240,0.1); margin-bottom: 8px; }
          .admin-sidebar [data-brand-text] { display: block !important; }
          .admin-sidebar .admin-nav-btn { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

const AdminTopbar = ({ section }) => {
  const titles = {
    dashboard: { title: "Dashboard", sub: "Resumen del negocio · Hoy, 3 mayo 2026" },
    menu: { title: "Editor de menú", sub: "Gestiona platos, precios y disponibilidad" },
    reservas: { title: "Reservas", sub: "12 reservas para hoy" },
    pedidos: { title: "Pedidos en curso", sub: "4 pedidos activos · 2 por entregar" },
    fotos: { title: "Galería", sub: "Imágenes del restaurante e Instagram" },
    ajustes: { title: "Ajustes generales", sub: "Datos de contacto, horarios, redes" },
  };
  const { title, sub } = titles[section];
  return (
    <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div>
        <h1 className="font-serif" style={{ fontSize: "clamp(24px, 4vw, 32px)", margin: 0, fontWeight: 500 }}>{title}</h1>
        <div className="muted tiny" style={{ marginTop: 4 }}>{sub}</div>
      </div>
      <div className="row" style={{ gap: 8 }}>
        <button className="btn btn-icon" style={{ background: "var(--white)", border: "1px solid var(--line)" }}><Icon name="bell" size={16}/></button>
        <div className="row" style={{ gap: 8, padding: "4px 12px 4px 4px", background: "var(--white)", border: "1px solid var(--line)", borderRadius: 999 }}>
          <span style={{ width: 28, height: 28, borderRadius: 999, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 12 }}>JA</span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Juan A.</span>
        </div>
      </div>
    </div>
  );
};

/* ===== Dashboard ===== */
const Dashboard = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
      {[
        { label: "Ingresos (hoy)", value: "$2.840.000", delta: "+12.4%", up: true },
        { label: "Pedidos", value: "47", delta: "+8", up: true },
        { label: "Reservas", value: "12", delta: "−2", up: false },
        { label: "Cubierto medio", value: "$98.500", delta: "+3.1%", up: true },
      ].map(s => (
        <div key={s.label} className="card" style={{ padding: 16 }}>
          <div className="tiny muted">{s.label}</div>
          <div className="font-serif" style={{ fontSize: 26, fontWeight: 500, margin: "6px 0 4px" }}>{s.value}</div>
          <div className="tiny" style={{ color: s.up ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>{s.delta} vs ayer</div>
        </div>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="dash-row">
      <div className="card" style={{ padding: 20 }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
          <div className="font-serif" style={{ fontSize: 18, fontWeight: 500 }}>Ingresos · últimos 7 días</div>
          <div className="row" style={{ gap: 4 }}>
            {["7D", "30D", "90D"].map((p, i) => (
              <button key={p} className="chip" style={{ padding: "4px 10px", minHeight: 28, background: i === 0 ? "var(--ink)" : "var(--bg-2)", color: i === 0 ? "var(--bg)" : "var(--ink)" }}>{p}</button>
            ))}
          </div>
        </div>
        <Chart/>
      </div>
      <div className="card" style={{ padding: 20 }}>
        <div className="font-serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 14 }}>Platos top</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MENU.filter(m => m.popular).slice(0, 4).map((d, i) => (
            <div key={d.id} className="row" style={{ gap: 12 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", width: 16 }}>0{i+1}</span>
              <div style={{ width: 36, height: 36, flexShrink: 0 }}>
                <FoodPlaceholder label="" height={36} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
                <div className="tiny muted">{Math.round(20 + Math.random() * 30)} órdenes</div>
              </div>
              <div className="tiny" style={{ fontWeight: 600 }}>{fmt(d.price)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="card" style={{ padding: 20 }}>
      <div className="font-serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 14 }}>Actividad reciente</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { t: "Hace 2 min", e: "Nuevo pedido #FN-1842", d: "$124.000 · Domicilio · Calle 90 #15-22", icon: "truck" },
          { t: "Hace 8 min", e: "Reserva confirmada", d: "Sofía Henao · 4 personas · Cena 20:00", icon: "cal" },
          { t: "Hace 14 min", e: "Pedido entregado #FN-1839", d: "$78.500 · Calificación 5 ⭐", icon: "check" },
          { t: "Hace 22 min", e: "Plato fuera de stock", d: "Lomo Wagyu A5 marcado como agotado", icon: "bell" },
          { t: "Hace 41 min", e: "Nuevo testimonio", d: "James Caldwell · 5 estrellas", icon: "star" },
        ].map((a, i) => (
          <div key={i} className="row" style={{ gap: 14, padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--line)" : "none" }}>
            <span style={{ width: 32, height: 32, borderRadius: 999, background: "var(--bg-2)", display: "grid", placeItems: "center", color: "var(--ink-2)", flexShrink: 0 }}>
              <Icon name={a.icon} size={14}/>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{a.e}</div>
              <div className="tiny muted">{a.d}</div>
            </div>
            <span className="tiny muted" style={{ whiteSpace: "nowrap" }}>{a.t}</span>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      @media (min-width: 900px) {
        .dash-row { grid-template-columns: 2fr 1fr !important; }
      }
    `}</style>
  </div>
);

const Chart = () => {
  const data = [42, 58, 51, 72, 64, 89, 76];
  const days = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 80}`).join(" ");
  return (
    <div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 180, display: "block" }}>
        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.58 0.12 38)" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="oklch(0.58 0.12 38)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${points} 100,100`} fill="url(#grad)"/>
        <polyline points={points} fill="none" stroke="oklch(0.58 0.12 38)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
        {data.map((v, i) => (
          <circle key={i} cx={(i / (data.length - 1)) * 100} cy={100 - (v / max) * 80} r="0.8" fill="oklch(0.58 0.12 38)" vectorEffect="non-scaling-stroke" stroke="#fff" strokeWidth="0.4"/>
        ))}
      </svg>
      <div className="row" style={{ justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--ink-3)", padding: "0 4px" }}>
        {days.map(d => <span key={d}>{d}</span>)}
      </div>
    </div>
  );
};

/* ===== Menu Admin ===== */
const MenuAdmin = () => {
  const [items, setItems] = useStateA(MENU);
  const [editing, setEditing] = useStateA(null);
  const [filter, setFilter] = useStateA("todos");

  const filtered = filter === "todos" ? items : items.filter(i => i.cat === filter);

  const toggleAvail = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, unavailable: !i.unavailable } : i));
  };

  return (
    <>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="row" style={{ padding: 14, justifyContent: "space-between", flexWrap: "wrap", gap: 10, borderBottom: "1px solid var(--line)" }}>
          <div className="row" style={{ gap: 6 }}>
            {[["todos","Todos"],["entradas","Entradas"],["fuertes","Fuertes"],["bebidas","Bebidas"]].map(([k,l]) => (
              <button key={k} onClick={() => setFilter(k)} className={`chip ${filter === k ? "active" : ""}`} style={{ padding: "6px 12px", minHeight: 32, fontSize: 12 }}>{l}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setEditing({ id: "new", name: "", price: 0, cat: "entradas", desc: "", tags: [], rating: 4.5, pairing: "" })}>
            <Icon name="plus" size={14}/> Nuevo plato
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "var(--bg-2)", textAlign: "left", fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.04 }}>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Plato</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Categoría</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Precio</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Disponible</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div className="row" style={{ gap: 10 }}>
                      <div style={{ width: 40, height: 40, flexShrink: 0 }}><FoodPlaceholder label="" height={40}/></div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div>
                        <div className="tiny muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 280 }}>{d.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 12, textTransform: "capitalize" }}>{d.cat}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600 }}>{fmt(d.price)}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <Toggle on={!d.unavailable} onChange={() => toggleAvail(d.id)}/>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div className="row" style={{ gap: 4 }}>
                      <button className="btn btn-icon btn-soft" style={{ width: 30, height: 30, minHeight: 30 }} onClick={() => setEditing(d)}><Icon name="edit" size={13}/></button>
                      <button className="btn btn-icon btn-soft" style={{ width: 30, height: 30, minHeight: 30, color: "var(--danger)" }}><Icon name="trash" size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && <DishEditor dish={editing} onClose={() => setEditing(null)} onSave={(d) => {
        setItems(prev => editing.id === "new" ? [...prev, { ...d, id: "new"+Date.now() }] : prev.map(i => i.id === d.id ? d : i));
        setEditing(null);
      }}/>}
    </>
  );
};

const Toggle = ({ on, onChange }) => (
  <button onClick={onChange} style={{
    width: 38, height: 22, borderRadius: 999, padding: 2,
    background: on ? "var(--success)" : "var(--bg-3)",
    transition: "background 160ms var(--ease)", display: "flex", alignItems: "center",
  }}>
    <span style={{
      width: 18, height: 18, borderRadius: 999, background: "#fff",
      transform: on ? "translateX(16px)" : "translateX(0)",
      transition: "transform 200ms var(--ease)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    }}/>
  </button>
);

const DishEditor = ({ dish, onClose, onSave }) => {
  const [d, setD] = useStateA(dish);
  const toggle = (t) => setD({ ...d, tags: d.tags.includes(t) ? d.tags.filter(x => x !== t) : [...d.tags, t] });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="row" style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)", justifyContent: "space-between" }}>
          <div className="font-serif" style={{ fontSize: 20, fontWeight: 500 }}>{dish.id === "new" ? "Nuevo plato" : "Editar plato"}</div>
          <button className="btn btn-icon btn-soft" onClick={onClose}><Icon name="close" size={16}/></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <FoodPlaceholder label={"// arrastra una foto\nformato 4:3"} height={140}/>
          <button className="btn btn-soft btn-sm"><Icon name="image" size={14}/> Subir imagen</button>
          <div>
            <label className="label">Nombre del plato</label>
            <input className="input" value={d.name} onChange={e => setD({...d, name: e.target.value})}/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="label">Categoría</label>
              <select className="select" value={d.cat} onChange={e => setD({...d, cat: e.target.value})}>
                <option value="entradas">Entradas</option>
                <option value="fuertes">Fuertes</option>
                <option value="bebidas">Bebidas</option>
              </select>
            </div>
            <div>
              <label className="label">Precio (COP)</label>
              <input className="input" type="number" value={d.price} onChange={e => setD({...d, price: +e.target.value})}/>
            </div>
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea className="input" rows="3" value={d.desc} onChange={e => setD({...d, desc: e.target.value})}/>
          </div>
          <div>
            <label className="label">Maridaje</label>
            <input className="input" value={d.pairing} onChange={e => setD({...d, pairing: e.target.value})}/>
          </div>
          <div>
            <label className="label">Etiquetas</label>
            <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
              {["vegano","vegetariano","sin-gluten"].map(t => (
                <button key={t} onClick={() => toggle(t)} className={`chip ${d.tags.includes(t) ? "active" : "chip-outline"}`} style={{ minHeight: 32, padding: "4px 12px", fontSize: 12 }}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="row" style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", justifyContent: "flex-end", gap: 8, background: "var(--bg-2)" }}>
          <button className="btn btn-soft" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => onSave(d)}>Guardar cambios</button>
        </div>
      </div>
    </div>
  );
};

/* ===== Reservas Admin ===== */
const ReservasAdmin = () => {
  const reservas = [
    { id: 1, name: "María Restrepo", phone: "+57 300 123 4567", people: 2, time: "13:00", shift: "almuerzo", date: "Hoy", status: "confirmada", notes: "Aniversario" },
    { id: 2, name: "Carlos Méndez", phone: "+57 310 987 6543", people: 4, time: "14:30", shift: "almuerzo", date: "Hoy", status: "confirmada", notes: "" },
    { id: 3, name: "Sofía Henao", phone: "+57 320 555 1234", people: 6, time: "20:00", shift: "cena", date: "Hoy", status: "pendiente", notes: "Mesa cerca de ventana" },
    { id: 4, name: "James Caldwell", phone: "+57 301 444 7890", people: 2, time: "21:30", shift: "cena", date: "Hoy", status: "confirmada", notes: "" },
    { id: 5, name: "Andrea Vélez", phone: "+57 315 666 1122", people: 3, time: "13:30", shift: "almuerzo", date: "Mañana", status: "confirmada", notes: "Sin gluten" },
    { id: 6, name: "Daniel Torres", phone: "+57 312 234 5678", people: 8, time: "20:30", shift: "cena", date: "Mañana", status: "pendiente", notes: "Cumpleaños" },
  ];

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="row" style={{ padding: 14, justifyContent: "space-between", flexWrap: "wrap", gap: 10, borderBottom: "1px solid var(--line)" }}>
        <div className="row" style={{ gap: 6 }}>
          {["Todas","Hoy","Mañana","Esta semana"].map((t, i) => (
            <button key={t} className={`chip ${i === 1 ? "active" : ""}`} style={{ minHeight: 32, padding: "6px 12px", fontSize: 12 }}>{t}</button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm"><Icon name="plus" size={14}/> Reserva manual</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {reservas.map((r, i) => (
          <div key={r.id} className="row" style={{ padding: "14px 16px", gap: 14, borderTop: i > 0 ? "1px solid var(--line)" : "none", flexWrap: "wrap" }}>
            <span style={{ width: 40, height: 40, borderRadius: 999, background: "var(--bg-2)", color: "var(--ink-2)", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 13, flexShrink: 0 }}>
              {r.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </span>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
              <div className="tiny muted">{r.phone} {r.notes && <>· <span style={{ color: "var(--accent)" }}>{r.notes}</span></>}</div>
            </div>
            <div className="row" style={{ gap: 10, fontSize: 12 }}>
              <span className="row" style={{ gap: 4 }}><Icon name="users" size={12}/> {r.people}</span>
              <span className="row" style={{ gap: 4 }}><Icon name={r.shift === "almuerzo" ? "sun" : "moon"} size={12}/> {r.time}</span>
              <span className="muted">{r.date}</span>
            </div>
            <span className="badge" style={{
              background: r.status === "confirmada" ? "oklch(0.94 0.06 145)" : "oklch(0.94 0.06 80)",
              color: r.status === "confirmada" ? "oklch(0.40 0.10 145)" : "oklch(0.40 0.10 80)",
            }}>
              {r.status}
            </span>
            <div className="row" style={{ gap: 4 }}>
              <button className="btn btn-icon btn-soft" style={{ width: 30, height: 30, minHeight: 30 }}><Icon name="check" size={13}/></button>
              <button className="btn btn-icon btn-soft" style={{ width: 30, height: 30, minHeight: 30 }}><Icon name="phone" size={13}/></button>
              <button className="btn btn-icon btn-soft" style={{ width: 30, height: 30, minHeight: 30, color: "var(--danger)" }}><Icon name="close" size={13}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===== Pedidos Admin ===== */
const PedidosAdmin = () => {
  const cols = [
    { id: "nuevos", label: "Nuevos", color: "oklch(0.94 0.06 80)", text: "oklch(0.40 0.10 80)" },
    { id: "cocina", label: "En cocina", color: "var(--bg-3)", text: "var(--ink-2)" },
    { id: "ruta", label: "En ruta", color: "var(--accent-soft)", text: "var(--accent)" },
    { id: "entregados", label: "Entregados", color: "oklch(0.94 0.06 145)", text: "oklch(0.40 0.10 145)" },
  ];
  const orders = {
    nuevos: [
      { id: "FN-1842", name: "Laura M.", total: 124000, items: 3, time: "Hace 2 min", type: "domicilio" },
      { id: "FN-1843", name: "Pedro V.", total: 78000, items: 2, time: "Hace 5 min", type: "recoger" },
    ],
    cocina: [
      { id: "FN-1840", name: "Carlos M.", total: 198000, items: 5, time: "12 min", type: "domicilio" },
      { id: "FN-1841", name: "Diana R.", total: 56000, items: 2, time: "8 min", type: "recoger" },
    ],
    ruta: [
      { id: "FN-1839", name: "Andrés P.", total: 145000, items: 4, time: "ETA 8 min", type: "domicilio" },
    ],
    entregados: [
      { id: "FN-1838", name: "Sofía H.", total: 92000, items: 3, time: "13:42", type: "domicilio" },
      { id: "FN-1837", name: "Miguel L.", total: 64000, items: 2, time: "13:28", type: "recoger" },
    ],
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
      {cols.map(c => (
        <div key={c.id} style={{ background: "var(--white)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", display: "flex", flexDirection: "column" }}>
          <div className="row" style={{ padding: "12px 14px", justifyContent: "space-between", borderBottom: "1px solid var(--line)" }}>
            <span className="row" style={{ gap: 8, fontWeight: 600, fontSize: 13 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: c.text }}/> {c.label}
            </span>
            <span className="tiny" style={{ background: c.color, color: c.text, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>{orders[c.id].length}</span>
          </div>
          <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {orders[c.id].map(o => (
              <div key={o.id} className="card" style={{ padding: 12, background: "var(--bg)", borderColor: "var(--line)", cursor: "grab" }}>
                <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{o.id}</span>
                  <span className="tiny muted">{o.time}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{o.name}</div>
                <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                  <span className="tiny muted row" style={{ gap: 4 }}>
                    <Icon name={o.type === "domicilio" ? "truck" : "bag"} size={11}/> {o.items} ítems
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{fmt(o.total)}</span>
                </div>
              </div>
            ))}
            {orders[c.id].length === 0 && (
              <div className="tiny muted" style={{ padding: 16, textAlign: "center", border: "1px dashed var(--line-2)", borderRadius: "var(--r-md)" }}>Sin pedidos</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ===== Fotos Admin ===== */
const FotosAdmin = () => (
  <div>
    <div className="card" style={{ padding: 18, marginBottom: 14, borderStyle: "dashed", borderColor: "var(--line-2)", textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: 999, background: "var(--bg-2)", color: "var(--ink-3)", margin: "0 auto 10px", display: "grid", placeItems: "center" }}>
        <Icon name="image" size={20}/>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Arrastra fotos aquí o haz click para subir</div>
      <div className="tiny muted">JPG / PNG · máx 8MB · 1920×1080 recomendado</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--r-md)", overflow: "hidden", cursor: "pointer" }}>
          <FoodPlaceholder label={`// foto ${i+1}`} height={"100%"}/>
          <div className="row" style={{ position: "absolute", top: 6, right: 6, gap: 4 }}>
            <button className="btn btn-icon" style={{ width: 26, height: 26, minHeight: 26, background: "rgba(255,255,255,0.92)", color: "var(--ink)" }}><Icon name="eye" size={12}/></button>
            <button className="btn btn-icon" style={{ width: 26, height: 26, minHeight: 26, background: "rgba(255,255,255,0.92)", color: "var(--danger)" }}><Icon name="trash" size={12}/></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ===== Ajustes Admin ===== */
const AjustesAdmin = () => {
  const [contact, setContact] = useStateA({
    name: "Fonda Norte", phone: "+57 (1) 555 1234", email: "hola@fondanorte.co",
    address: "Calle 85 #11-53, Bogotá", instagram: "@fondanorte", facebook: "fondanorterestaurante",
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }} className="settings-grid">
      <div className="card" style={{ padding: 20 }}>
        <div className="font-serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Información del restaurante</div>
        <p className="tiny muted" style={{ margin: "0 0 16px" }}>Estos datos aparecen en el footer y la página de contacto.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["name","Nombre del restaurante"],
            ["phone","Teléfono"],
            ["email","Email"],
            ["address","Dirección"],
          ].map(([k,l]) => (
            <div key={k}>
              <label className="label">{l}</label>
              <input className="input" value={contact[k]} onChange={e => setContact({...contact, [k]: e.target.value})}/>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="font-serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Horarios de atención</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"].map((d, i) => (
            <div key={d} className="row" style={{ gap: 10, justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 600, width: 90 }}>{d}</span>
              <Toggle on={i !== 0} onChange={() => {}}/>
              <input className="input" defaultValue={i === 0 ? "" : "12:30"} placeholder="Apertura" disabled={i === 0} style={{ minHeight: 36, fontSize: 13, padding: "6px 10px", maxWidth: 100 }}/>
              <input className="input" defaultValue={i === 0 ? "" : (i >= 5 ? "23:30" : "22:00")} placeholder="Cierre" disabled={i === 0} style={{ minHeight: 36, fontSize: 13, padding: "6px 10px", maxWidth: 100 }}/>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="font-serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Redes sociales</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["instagram","Instagram","@usuario"],
            ["facebook","Facebook","facebook.com/..."],
          ].map(([k,l,p]) => (
            <div key={k}>
              <label className="label">{l}</label>
              <div className="row" style={{ gap: 8 }}>
                <span style={{ width: 40, height: 40, borderRadius: "var(--r-md)", background: "var(--bg-2)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon name={k} size={16}/>
                </span>
                <input className="input" value={contact[k] || ""} onChange={e => setContact({...contact, [k]: e.target.value})} placeholder={p}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="font-serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Branding</div>
        <p className="tiny muted" style={{ margin: "0 0 16px" }}>Logo, color principal y tipografía.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          <div>
            <label className="label">Logo</label>
            <div style={{ aspectRatio: "1", borderRadius: "var(--r-md)", border: "1px dashed var(--line-2)", display: "grid", placeItems: "center", color: "var(--ink-3)", background: "var(--bg-2)" }}>
              <Icon name="image" size={24}/>
            </div>
          </div>
          <div>
            <label className="label">Color principal</label>
            <div className="row" style={{ flexWrap: "wrap", gap: 6 }}>
              {["oklch(0.58 0.12 38)", "oklch(0.50 0.10 145)", "oklch(0.45 0.15 260)", "oklch(0.55 0.18 25)"].map((c, i) => (
                <button key={i} style={{ width: 36, height: 36, borderRadius: 999, background: c, border: i === 0 ? "3px solid var(--ink)" : "2px solid transparent", boxShadow: "inset 0 0 0 2px var(--bg)" }}/>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Tipografía</label>
            <select className="select">
              <option>Fraunces + Inter</option>
              <option>Cormorant + Helvetica</option>
              <option>Playfair + Lato</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
        <button className="btn btn-soft">Descartar</button>
        <button className="btn btn-primary"><Icon name="check" size={14}/> Guardar cambios</button>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .settings-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

Object.assign(window, { AdminScreen });
