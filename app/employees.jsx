/* global React, Icon, Toggle, useAuth, ROLE_LABELS, ROLE_COLORS, ROLE_PERMISSIONS */
const { useState: useStateEmp, useMemo: useMemoEmp } = React;

const DAYS_SHORT  = ["L","M","X","J","V","S","D"];
const DAYS_FULL   = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

const SECTION_LABELS = {
  dashboard: "Dashboard",
  menu:      "Editor de menú",
  reservas:  "Reservas",
  pedidos:   "Pedidos",
  fotos:     "Galería",
  empleados: "Empleados",
  ajustes:   "Ajustes",
};

/* ================== EMPLOYEES MODULE ================== */
const EmpleadosAdmin = () => {
  const { users, setUsers, currentUser } = useAuth();
  const [search, setSearch]         = useStateEmp("");
  const [roleFilter, setRoleFilter] = useStateEmp("todos");
  const [editing, setEditing]       = useStateEmp(null);
  const [profile, setProfile]       = useStateEmp(null);

  const filtered = useMemoEmp(() => {
    return users.filter(u => {
      if (roleFilter !== "todos" && u.role !== roleFilter) return false;
      const q = search.toLowerCase();
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [users, roleFilter, search]);

  const toggleActive = (id) => {
    if (id === currentUser.id) return;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const saveEmployee = (emp) => {
    const initials = emp.name.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join("").toUpperCase();
    if (emp.id === "new") {
      setUsers(prev => [...prev, { ...emp, id: Date.now(), avatar: initials }]);
    } else {
      setUsers(prev => prev.map(u => u.id === emp.id ? { ...emp, avatar: initials } : u));
    }
    setEditing(null);
  };

  const deleteEmployee = (id) => {
    if (id === currentUser.id) return;
    if (!confirm("¿Eliminar este empleado? Esta acción no se puede deshacer.")) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const newEmp = { id: "new", name: "", email: "", password: "", role: "mesero", phone: "", shifts: [1,2,3,4,5], active: true };

  /* Stat cards */
  const statCards = [
    { label: "Total empleados",  value: users.length,                              icon: "users"    },
    { label: "Activos",          value: users.filter(u => u.active).length,        icon: "check"    },
    { label: "Administradores",  value: users.filter(u => u.role === "admin").length,   icon: "settings" },
    { label: "Equipo de sala",   value: users.filter(u => u.role === "mesero").length,  icon: "star"     },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(148px, 1fr))", gap: 12 }}>
        {statCards.map(s => (
          <div key={s.label} className="card" style={{ padding: 16 }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
              <span className="tiny muted">{s.label}</span>
              <span style={{ width: 28, height: 28, borderRadius: "var(--r-sm)", background: "var(--bg-2)", display: "grid", placeItems: "center", color: "var(--ink-3)" }}>
                <Icon name={s.icon} size={13}/>
              </span>
            </div>
            <div className="font-serif" style={{ fontSize: 30, fontWeight: 500 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="card" style={{ overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <input className="input" placeholder="Buscar empleado…" value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 36, minHeight: 36, fontSize: 13, maxWidth: 220 }}/>
              <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)", pointerEvents: "none" }}>
                <Icon name="search" size={14}/>
              </span>
            </div>
            <div className="chip-rail" style={{ gap: 4 }}>
              {[["todos","Todos"],["admin","Admin"],["mesero","Meseros"],["cocinero","Cocina"],["cajero","Caja"]].map(([k,l]) => (
                <button key={k} className={`chip ${roleFilter === k ? "active" : ""}`}
                  style={{ minHeight: 32, padding: "4px 12px", fontSize: 12 }}
                  onClick={() => setRoleFilter(k)}>{l}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setEditing(newEmp)}>
            <Icon name="plus" size={14}/> Nuevo empleado
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
            <thead>
              <tr style={{ background: "var(--bg-2)", fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "left" }}>
                {["Empleado","Rol","Contacto","Turnos","Estado",""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => {
                const rc = ROLE_COLORS[emp.role] || ROLE_COLORS.mesero;
                const isSelf = emp.id === currentUser.id;
                return (
                  <tr key={emp.id} style={{ borderTop: "1px solid var(--line)" }}>

                    {/* Name + email */}
                    <td style={{ padding: "12px 16px" }}>
                      <div className="row" style={{ gap: 10 }}>
                        <span style={{
                          width: 38, height: 38, borderRadius: 999, flexShrink: 0,
                          background: rc.bg, color: rc.text,
                          display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13,
                        }}>{emp.avatar}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>
                            {emp.name}
                            {isSelf && <span className="badge badge-new" style={{ marginLeft: 6, fontSize: 9 }}>TÚ</span>}
                          </div>
                          <div className="tiny muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: "12px 16px" }}>
                      <span className="badge" style={{ background: rc.bg, color: rc.text }}>{ROLE_LABELS[emp.role]}</span>
                    </td>

                    {/* Phone */}
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--ink-2)" }}>
                      {emp.phone || <span className="muted">—</span>}
                    </td>

                    {/* Shifts */}
                    <td style={{ padding: "12px 16px" }}>
                      <div className="row" style={{ gap: 2 }}>
                        {DAYS_SHORT.map((d, i) => {
                          const on = (emp.shifts || []).includes(i);
                          return (
                            <span key={d} style={{
                              width: 22, height: 22, borderRadius: 4, display: "grid", placeItems: "center",
                              fontSize: 9, fontWeight: 700,
                              background: on ? "var(--ink)" : "var(--bg-2)",
                              color: on ? "var(--bg)" : "var(--ink-4)",
                            }}>{d}</span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Active toggle */}
                    <td style={{ padding: "12px 16px" }}>
                      <Toggle on={emp.active} onChange={() => toggleActive(emp.id)} disabled={isSelf}/>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 16px" }}>
                      <div className="row" style={{ gap: 4 }}>
                        <button className="btn btn-icon btn-soft" style={{ width: 30, height: 30, minHeight: 30 }}
                          onClick={() => setProfile(emp)} title="Ver perfil">
                          <Icon name="eye" size={13}/>
                        </button>
                        <button className="btn btn-icon btn-soft" style={{ width: 30, height: 30, minHeight: 30 }}
                          onClick={() => setEditing(emp)} title="Editar">
                          <Icon name="edit" size={13}/>
                        </button>
                        {!isSelf && (
                          <button className="btn btn-icon btn-soft" style={{ width: 30, height: 30, minHeight: 30, color: "var(--danger)" }}
                            onClick={() => deleteEmployee(emp.id)} title="Eliminar">
                            <Icon name="trash" size={13}/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--ink-3)" }}>
              <Icon name="users" size={28}/>
              <div style={{ fontSize: 13, marginTop: 10 }}>No se encontraron empleados</div>
            </div>
          )}
        </div>
      </div>

      {editing  && <EmployeeModal emp={editing}  onClose={() => setEditing(null)}  onSave={saveEmployee} />}
      {profile  && <EmployeeProfile emp={profile} onClose={() => setProfile(null)} onEdit={() => { setEditing(profile); setProfile(null); }} />}
    </div>
  );
};

/* ================== EMPLOYEE MODAL ================== */
const EmployeeModal = ({ emp, onClose, onSave }) => {
  const [d, setD] = useStateEmp({ ...emp });
  const isNew = emp.id === "new";

  const toggleShift = (i) => {
    const s = d.shifts || [];
    setD({ ...d, shifts: s.includes(i) ? s.filter(x => x !== i) : [...s, i].sort((a,b)=>a-b) });
  };

  const valid = d.name.trim() && d.email.trim() && (!isNew || d.password.trim());

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>

        {/* Header */}
        <div className="row" style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)", justifyContent: "space-between", background: "var(--bg-2)" }}>
          <div className="font-serif" style={{ fontSize: 20, fontWeight: 500 }}>
            {isNew ? "Nuevo empleado" : "Editar empleado"}
          </div>
          <button className="btn btn-icon btn-soft" onClick={onClose}><Icon name="close" size={16}/></button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Avatar preview */}
          {!isNew && (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{
                width: 52, height: 52, borderRadius: 999,
                background: (ROLE_COLORS[d.role] || ROLE_COLORS.mesero).bg,
                color: (ROLE_COLORS[d.role] || ROLE_COLORS.mesero).text,
                display: "grid", placeItems: "center", fontWeight: 700, fontSize: 18, flexShrink: 0,
              }}>
                {d.name.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join("").toUpperCase() || "?"}
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{d.name || "—"}</div>
                <span className="badge" style={{ background: (ROLE_COLORS[d.role]||ROLE_COLORS.mesero).bg, color: (ROLE_COLORS[d.role]||ROLE_COLORS.mesero).text, marginTop: 4 }}>
                  {ROLE_LABELS[d.role]}
                </span>
              </div>
            </div>
          )}

          {/* Name + Phone */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="label">Nombre completo *</label>
              <input className="input" value={d.name} onChange={e => setD({...d, name: e.target.value})} placeholder="María García"/>
            </div>
            <div>
              <label className="label">Teléfono</label>
              <input className="input" type="tel" value={d.phone || ""} onChange={e => setD({...d, phone: e.target.value})} placeholder="+57 300 000 0000"/>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label">Correo electrónico *</label>
            <input className="input" type="email" value={d.email} onChange={e => setD({...d, email: e.target.value})} placeholder="nombre@fondanorte.co"/>
          </div>

          {/* Password */}
          <div>
            <label className="label">{isNew ? "Contraseña *" : "Nueva contraseña (dejar vacío para no cambiar)"}</label>
            <input className="input" type="password" value={d.password || ""} onChange={e => setD({...d, password: e.target.value})} placeholder="••••••••"/>
          </div>

          {/* Role */}
          <div>
            <label className="label">Rol y permisos *</label>
            <select className="select" value={d.role} onChange={e => setD({...d, role: e.target.value})}>
              {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="row" style={{ gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              {(ROLE_PERMISSIONS[d.role] || []).map(p => (
                <span key={p} className="badge" style={{ background: "var(--bg-2)", fontSize: 11 }}>
                  <Icon name="check" size={10}/> {SECTION_LABELS[p] || p}
                </span>
              ))}
            </div>
          </div>

          {/* Shifts */}
          <div>
            <label className="label">Turnos de trabajo</label>
            <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
              {DAYS_FULL.map((day, i) => {
                const on = (d.shifts || []).includes(i);
                return (
                  <button key={i} onClick={() => toggleShift(i)} style={{
                    padding: "7px 12px", borderRadius: "var(--r-md)", fontSize: 12, fontWeight: 600, minHeight: 36,
                    background: on ? "var(--ink)" : "var(--white)",
                    color: on ? "var(--bg)" : "var(--ink-2)",
                    border: `1px solid ${on ? "var(--ink)" : "var(--line)"}`,
                    transition: "all 140ms var(--ease)",
                  }}>{day.slice(0, 3)}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="row" style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", justifyContent: "flex-end", gap: 8, background: "var(--bg-2)" }}>
          <button className="btn btn-soft" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => onSave(d)} disabled={!valid}
            style={{ opacity: valid ? 1 : 0.5 }}>
            <Icon name="check" size={14}/> {isNew ? "Crear empleado" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================== EMPLOYEE PROFILE ================== */
const EmployeeProfile = ({ emp, onClose, onEdit }) => {
  const rc = ROLE_COLORS[emp.role] || ROLE_COLORS.mesero;
  const perms = ROLE_PERMISSIONS[emp.role] || [];
  const allSections = Object.keys(SECTION_LABELS);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>

        {/* Header */}
        <div className="row" style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)", justifyContent: "space-between" }}>
          <div className="font-serif" style={{ fontSize: 20, fontWeight: 500 }}>Perfil de empleado</div>
          <button className="btn btn-icon btn-soft" onClick={onClose}><Icon name="close" size={16}/></button>
        </div>

        <div style={{ padding: 24 }}>

          {/* Avatar block */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: 16, background: "var(--bg-2)", borderRadius: "var(--r-lg)" }}>
            <span style={{
              width: 64, height: 64, borderRadius: 999, background: rc.bg, color: rc.text,
              display: "grid", placeItems: "center", fontWeight: 700, fontSize: 22, flexShrink: 0,
            }}>{emp.avatar}</span>
            <div>
              <div className="font-serif" style={{ fontSize: 20, fontWeight: 500 }}>{emp.name}</div>
              <div className="muted tiny" style={{ marginBottom: 6 }}>{emp.email}</div>
              <div className="row" style={{ gap: 6 }}>
                <span className="badge" style={{ background: rc.bg, color: rc.text }}>{ROLE_LABELS[emp.role]}</span>
                <span className="badge" style={{ background: emp.active ? "oklch(0.94 0.06 145)" : "var(--bg-3)", color: emp.active ? "oklch(0.40 0.10 145)" : "var(--ink-3)" }}>
                  {emp.active ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          {emp.phone && (
            <div className="row" style={{ gap: 10, marginBottom: 14, padding: "10px 14px", background: "var(--bg-2)", borderRadius: "var(--r-md)" }}>
              <Icon name="phone" size={16}/>
              <span style={{ fontSize: 14 }}>{emp.phone}</span>
            </div>
          )}

          {/* Schedule */}
          <div style={{ background: "var(--bg-2)", borderRadius: "var(--r-md)", padding: 16, marginBottom: 14 }}>
            <div className="tiny muted" style={{ marginBottom: 10 }}>Turnos asignados</div>
            <div className="row" style={{ gap: 4 }}>
              {DAYS_FULL.map((day, i) => {
                const on = (emp.shifts || []).includes(i);
                return (
                  <div key={i} style={{
                    flex: 1, textAlign: "center", padding: "8px 0", borderRadius: "var(--r-sm)",
                    background: on ? "var(--ink)" : "transparent",
                    color: on ? "var(--bg)" : "var(--ink-4)",
                  }}>
                    <div style={{ fontSize: 9, fontWeight: 700 }}>{DAYS_SHORT[i]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Permissions */}
          <div style={{ background: "var(--bg-2)", borderRadius: "var(--r-md)", padding: 16, marginBottom: 20 }}>
            <div className="tiny muted" style={{ marginBottom: 10 }}>Acceso al panel CRM</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {allSections.map(k => {
                const has = perms.includes(k);
                return (
                  <div key={k} className="row" style={{
                    gap: 7, padding: "7px 10px", borderRadius: "var(--r-sm)",
                    background: has ? "oklch(0.94 0.06 145)" : "var(--bg-3)",
                  }}>
                    <span style={{ color: has ? "oklch(0.40 0.10 145)" : "var(--ink-4)", flexShrink: 0 }}>
                      <Icon name={has ? "check" : "close"} size={11}/>
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: has ? "oklch(0.40 0.10 145)" : "var(--ink-4)" }}>
                      {SECTION_LABELS[k]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="row" style={{ gap: 8, justifyContent: "flex-end" }}>
            <button className="btn btn-soft" onClick={onClose}>Cerrar</button>
            <button className="btn btn-primary" onClick={onEdit}><Icon name="edit" size={14}/> Editar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { EmpleadosAdmin, EmployeeModal, EmployeeProfile });
