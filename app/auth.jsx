/* global React */
const { useState: useStateAuth, useEffect: useEffectAuth, createContext: createContextAuth, useContext: useContextAuth } = React;

/* ================== ROLES & PERMISSIONS ================== */
const ROLE_LABELS = {
  admin:     "Administrador",
  mesero:    "Mesero/a",
  cocinero:  "Cocinero/a",
  cajero:    "Cajero/a",
};

const ROLE_COLORS = {
  admin:    { bg: "var(--ink)",                         text: "var(--bg)" },
  mesero:   { bg: "oklch(0.94 0.06 38)",               text: "oklch(0.40 0.12 38)" },
  cocinero: { bg: "oklch(0.94 0.06 145)",              text: "oklch(0.40 0.10 145)" },
  cajero:   { bg: "oklch(0.92 0.06 260)",              text: "oklch(0.35 0.15 260)" },
};

const ROLE_PERMISSIONS = {
  admin:    ["dashboard", "menu", "reservas", "pedidos", "fotos", "empleados", "ajustes"],
  mesero:   ["pedidos", "reservas"],
  cocinero: ["pedidos"],
  cajero:   ["pedidos", "reservas"],
};

/* ================== DEFAULT USERS ================== */
const DEFAULT_USERS = [
  { id: 1, name: "Juan Arango",      email: "admin@fondanorte.co",   password: "admin123", role: "admin",    avatar: "JA", phone: "+57 310 100 0001", shifts: [1,2,3,4,5],    active: true },
  { id: 2, name: "Valentina Mesa",   email: "mesero@fondanorte.co",  password: "val123",   role: "mesero",   avatar: "VM", phone: "+57 310 100 0002", shifts: [2,3,4,5,6],    active: true },
  { id: 3, name: "Ricardo Pardo",    email: "cocina@fondanorte.co",  password: "ric123",   role: "cocinero", avatar: "RP", phone: "+57 310 100 0003", shifts: [1,2,3,4,5,6],  active: true },
  { id: 4, name: "Camila Ruiz",      email: "caja@fondanorte.co",    password: "cam123",   role: "cajero",   avatar: "CR", phone: "+57 310 100 0004", shifts: [3,4,5,6],       active: true },
  { id: 5, name: "Andrés Morales",   email: "mesero2@fondanorte.co", password: "and123",   role: "mesero",   avatar: "AM", phone: "+57 310 100 0005", shifts: [0,5,6],         active: true },
];

/* ================== AUTH CONTEXT ================== */
const AuthContext = createContextAuth();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useStateAuth(null);
  const [users, setUsers] = useStateAuth(() => {
    try { return JSON.parse(localStorage.getItem("fn_users")) || DEFAULT_USERS; }
    catch { return DEFAULT_USERS; }
  });

  /* Restore session */
  useEffectAuth(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("fn_session"));
      if (saved) {
        const found = (JSON.parse(localStorage.getItem("fn_users")) || DEFAULT_USERS).find(u => u.id === saved.id && u.active);
        if (found) setCurrentUser(found);
      }
    } catch {}
  }, []);

  /* Persist users */
  useEffectAuth(() => {
    localStorage.setItem("fn_users", JSON.stringify(users));
    /* Keep session in sync if current user was edited */
    if (currentUser) {
      const updated = users.find(u => u.id === currentUser.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentUser)) setCurrentUser(updated);
    }
  }, [users]);

  const login = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.active);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("fn_session", JSON.stringify({ id: user.id }));
      return { ok: true, user };
    }
    return { ok: false };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("fn_session");
  };

  const canAccess = (section) => {
    if (!currentUser) return false;
    return (ROLE_PERMISSIONS[currentUser.role] || []).includes(section);
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, setUsers, login, logout, canAccess, ROLE_LABELS, ROLE_COLORS, ROLE_PERMISSIONS }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContextAuth(AuthContext);

/* ================== LOGIN SCREEN ================== */
const LoginScreen = ({ onBack }) => {
  const { login } = useAuth();
  const [email, setEmail] = useStateAuth("");
  const [password, setPassword] = useStateAuth("");
  const [error, setError] = useStateAuth("");
  const [loading, setLoading] = useStateAuth(false);
  const [showPw, setShowPw] = useStateAuth(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.ok) {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
        setLoading(false);
      }
      /* On success, AuthProvider sets currentUser and App re-renders to AdminScreen */
    }, 700);
  };

  const quickFill = (role) => {
    const map = {
      admin:    ["admin@fondanorte.co",   "admin123"],
      mesero:   ["mesero@fondanorte.co",  "val123"],
      cocinero: ["cocina@fondanorte.co",  "ric123"],
      cajero:   ["caja@fondanorte.co",    "cam123"],
    };
    setEmail(map[role][0]);
    setPassword(map[role][1]);
    setError("");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--ink)", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      {/* Back to site */}
      {onBack && (
        <button onClick={onBack} className="btn btn-icon"
          style={{ position: "fixed", top: 20, left: 20, background: "rgba(250,246,240,0.10)", color: "var(--bg)" }}
          title="Volver al sitio">
          <Icon name="chevronLeft" size={18}/>
        </button>
      )}

      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{
            width: 56, height: 56, borderRadius: 14, background: "var(--bg)", color: "var(--ink)",
            display: "inline-grid", placeItems: "center", fontFamily: "var(--serif)", fontSize: 28, fontWeight: 600, marginBottom: 14,
          }}>F</span>
          <div className="font-serif" style={{ fontSize: 24, fontWeight: 500, color: "var(--bg)", letterSpacing: "-0.02em" }}>Fonda Norte</div>
          <div style={{ fontSize: 12, color: "rgba(250,246,240,0.45)", marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Panel de administración</div>
        </div>

        {/* Card */}
        <div style={{ background: "var(--bg)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ padding: "24px 24px 20px" }}>
            <div className="font-serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 18 }}>Iniciar sesión</div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="label">Correo electrónico</label>
                <input className="input" type="email" value={email} autoFocus required
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="nombre@fondanorte.co" />
              </div>
              <div>
                <label className="label">Contraseña</label>
                <div style={{ position: "relative" }}>
                  <input className="input" type={showPw ? "text" : "password"} value={password} required
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••" style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer" }}>
                    <Icon name={showPw ? "eye" : "eye"} size={16}/>
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ padding: "10px 14px", background: "oklch(0.96 0.03 25)", border: "1px solid oklch(0.88 0.08 25)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--danger)" }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !email || !password}
                style={{ width: "100%", marginTop: 2, opacity: (loading || !email || !password) ? 0.6 : 1 }}>
                {loading
                  ? <><span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(250,246,240,0.3)", borderTopColor: "var(--bg)", borderRadius: 999, animation: "spin 700ms linear infinite" }}/> Verificando…</>
                  : "Entrar al panel"
                }
              </button>
            </form>
          </div>

          {/* Demo access */}
          <div style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", padding: "16px 24px" }}>
            <div className="tiny muted" style={{ marginBottom: 10 }}>Acceso rápido — demo:</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[
                { role: "admin",    label: "Administrador" },
                { role: "mesero",   label: "Mesero/a" },
                { role: "cocinero", label: "Cocinero/a" },
                { role: "cajero",   label: "Cajero/a" },
              ].map(d => {
                const rc = ROLE_COLORS[d.role];
                return (
                  <button key={d.role} onClick={() => quickFill(d.role)} className="btn btn-ghost btn-sm"
                    style={{ fontSize: 12, justifyContent: "flex-start", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: rc.bg === "var(--ink)" ? "var(--ink)" : rc.text, flexShrink: 0 }}/>
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

Object.assign(window, { AuthProvider, useAuth, LoginScreen, ROLE_LABELS, ROLE_COLORS, ROLE_PERMISSIONS });
