/* global React, Icon, fmt */
const { useState: useStateR, useMemo: useMemoR } = React;

/* ============= RESERVATION WIDGET ============= */
const ReserveScreen = ({ embedded = false, onClose }) => {
  const [step, setStep] = useStateR(1);
  const [people, setPeople] = useStateR(2);
  const [shift, setShift] = useStateR("cena");
  const [date, setDate] = useStateR(null);
  const [time, setTime] = useStateR(null);
  const [name, setName] = useStateR("");
  const [phone, setPhone] = useStateR("");
  const [done, setDone] = useStateR(false);

  const isEvent = people > 8;

  const lunchSlots = ["12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];
  const dinnerSlots = ["18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
  const slots = shift === "almuerzo" ? lunchSlots : dinnerSlots;

  const submit = () => {
    setDone(true);
  };

  const wrapStyle = embedded
    ? { padding: 0 }
    : { maxWidth: 720, margin: "0 auto", padding: "24px 20px 40px" };

  return (
    <div style={wrapStyle}>
      {!embedded && (
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow">Tu mesa te espera</span>
          <h1 className="font-serif" style={{ fontSize: "clamp(36px, 6vw, 52px)", margin: "8px 0 8px", fontWeight: 400 }}>Reservar</h1>
          <p className="muted" style={{ margin: 0, fontSize: 15 }}>Confirmamos en menos de 15 minutos.</p>
        </div>
      )}

      <div style={{ background: "var(--white)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", overflow: "hidden" }}>
        {/* Step indicator */}
        <div className="row" style={{ padding: 16, borderBottom: "1px solid var(--line)", background: "var(--bg-2)", justifyContent: "space-between" }}>
          <div className="row" style={{ gap: 6 }}>
            {[1, 2, 3].map(s => (
              <span key={s} style={{
                width: 22, height: 22, borderRadius: 999, fontSize: 11, fontWeight: 600,
                display: "grid", placeItems: "center",
                background: s <= step ? "var(--ink)" : "var(--bg-3)",
                color: s <= step ? "var(--bg)" : "var(--ink-3)",
              }}>{s < step ? <Icon name="check" size={12} stroke={2.4}/> : s}</span>
            ))}
          </div>
          <span className="tiny muted">Paso {step} de 3</span>
        </div>

        {done ? (
          <SuccessReservation onClose={onClose} info={{ name, people, date, time, shift }} />
        ) : (
          <div style={{ padding: 22 }}>
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {/* People */}
                <div>
                  <label className="label">¿Cuántas personas?</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))", gap: 6 }}>
                    {[1,2,3,4,5,6,7,8,"9+"].map(n => {
                      const num = n === "9+" ? 9 : n;
                      const active = (n === "9+" && people >= 9) || people === n;
                      return (
                        <button key={n} onClick={() => setPeople(n === "9+" ? 9 : n)}
                          className="chip"
                          style={{
                            justifyContent: "center", padding: "12px 0", minHeight: 48,
                            background: active ? "var(--ink)" : "var(--white)",
                            border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
                            color: active ? "var(--bg)" : "var(--ink)",
                            fontWeight: 600,
                          }}>
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Event warning */}
                {isEvent && (
                  <div style={{ display: "flex", gap: 12, padding: 14, background: "var(--accent-soft)", borderRadius: "var(--r-md)", border: "1px solid var(--accent)", color: "var(--ink-2)" }}>
                    <span style={{ flexShrink: 0, color: "var(--accent)" }}><Icon name="users" size={20} /></span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Contacto directo para eventos</div>
                      <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
                        Para grupos de más de 8 personas armamos una experiencia a medida. Escríbenos por WhatsApp y nuestra anfitriona se encarga.
                      </p>
                      <div className="row" style={{ gap: 8 }}>
                        <a className="btn btn-accent btn-sm" href="tel:+5715551234"><Icon name="phone" size={14} /> Llamar</a>
                        <a className="btn btn-ghost btn-sm" href="mailto:eventos@fondanorte.co">Enviar correo</a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shift */}
                <div>
                  <label className="label">Turno</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                      { id: "almuerzo", label: "Almuerzo", sub: "12:30 — 15:30", icon: "sun" },
                      { id: "cena", label: "Cena", sub: "18:30 — 22:30", icon: "moon" },
                    ].map(s => (
                      <button key={s.id} onClick={() => setShift(s.id)}
                        style={{
                          padding: 14, borderRadius: "var(--r-md)",
                          border: `1px solid ${shift === s.id ? "var(--ink)" : "var(--line)"}`,
                          background: shift === s.id ? "var(--ink)" : "var(--white)",
                          color: shift === s.id ? "var(--bg)" : "var(--ink)",
                          textAlign: "left", display: "flex", flexDirection: "column", gap: 6,
                          transition: "all 160ms var(--ease)", minHeight: 72,
                        }}>
                        <Icon name={s.icon} size={20} />
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</div>
                        <div className="tiny" style={{ opacity: 0.7 }}>{s.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="row" style={{ justifyContent: "flex-end", paddingTop: 4 }}>
                  <button className="btn btn-primary btn-lg" disabled={isEvent}
                    onClick={() => setStep(2)}
                    style={isEvent ? { opacity: 0.4, cursor: "not-allowed" } : {}}>
                    Siguiente <Icon name="arrow" size={14} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <Calendar value={date} onChange={setDate} />
                <div>
                  <label className="label">Hora disponible</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))", gap: 6 }}>
                    {slots.map(t => {
                      const taken = ["20:00", "13:00"].includes(t);
                      const active = time === t;
                      return (
                        <button key={t} disabled={taken} onClick={() => setTime(t)}
                          style={{
                            padding: "12px 0", borderRadius: "var(--r-md)",
                            border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
                            background: active ? "var(--ink)" : taken ? "var(--bg-2)" : "var(--white)",
                            color: active ? "var(--bg)" : taken ? "var(--ink-4)" : "var(--ink)",
                            fontWeight: 600, fontSize: 13, minHeight: 44,
                            cursor: taken ? "not-allowed" : "pointer",
                            textDecoration: taken ? "line-through" : "none",
                            transition: "all 140ms var(--ease)",
                          }}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="row" style={{ justifyContent: "space-between", paddingTop: 4 }}>
                  <button className="btn btn-soft" onClick={() => setStep(1)}><Icon name="chevronLeft" size={14}/> Atrás</button>
                  <button className="btn btn-primary btn-lg" disabled={!date || !time}
                    onClick={() => setStep(3)}
                    style={(!date || !time) ? { opacity: 0.4, cursor: "not-allowed" } : {}}>
                    Siguiente <Icon name="arrow" size={14} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <ReservationSummary people={people} shift={shift} date={date} time={time} />
                <div>
                  <label className="label">Nombre completo</label>
                  <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="María Fernanda" />
                </div>
                <div>
                  <label className="label">Teléfono</label>
                  <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+57 300 000 0000" type="tel"/>
                </div>
                <div>
                  <label className="label">Notas (alergias, ocasión especial...)</label>
                  <textarea className="input" rows="3" placeholder="Cumpleaños, mesa cerca de la ventana, etc."/>
                </div>
                <div className="row" style={{ justifyContent: "space-between", paddingTop: 4 }}>
                  <button className="btn btn-soft" onClick={() => setStep(2)}><Icon name="chevronLeft" size={14}/> Atrás</button>
                  <button className="btn btn-accent btn-lg" disabled={!name || !phone}
                    onClick={submit}
                    style={(!name || !phone) ? { opacity: 0.4, cursor: "not-allowed" } : {}}>
                    Confirmar reserva
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ReservationSummary = ({ people, shift, date, time }) => {
  const dateStr = date ? new Date(date).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" }) : "—";
  return (
    <div style={{ background: "var(--bg-2)", borderRadius: "var(--r-md)", padding: 16, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
      {[
        { label: "Personas", value: people, icon: "users" },
        { label: "Turno", value: shift === "almuerzo" ? "Almuerzo" : "Cena", icon: shift === "almuerzo" ? "sun" : "moon" },
        { label: "Fecha", value: dateStr, icon: "cal" },
        { label: "Hora", value: time || "—", icon: "clock" },
      ].map(it => (
        <div key={it.label} className="row" style={{ gap: 10 }}>
          <span style={{ color: "var(--ink-3)" }}><Icon name={it.icon} size={16} /></span>
          <div>
            <div className="tiny muted">{it.label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{it.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SuccessReservation = ({ info, onClose }) => (
  <div style={{ padding: 28, textAlign: "center" }}>
    <div style={{ width: 64, height: 64, borderRadius: 999, background: "var(--success)", color: "#fff", margin: "0 auto 16px", display: "grid", placeItems: "center" }}>
      <Icon name="check" size={32} stroke={2.4}/>
    </div>
    <h3 className="font-serif" style={{ fontSize: 24, margin: "0 0 6px", fontWeight: 500 }}>¡Reserva confirmada!</h3>
    <p className="muted" style={{ margin: "0 0 20px", fontSize: 14 }}>Te enviamos los detalles a tu correo. Te esperamos, {info.name.split(" ")[0]}.</p>
    <ReservationSummary {...info} />
    {onClose && <button className="btn btn-primary btn-lg" onClick={onClose} style={{ marginTop: 20, width: "100%" }}>Listo</button>}
  </div>
);

/* ============= CALENDAR ============= */
const Calendar = ({ value, onChange }) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const [month, setMonth] = useStateR(new Date(today.getFullYear(), today.getMonth(), 1));

  const monthName = month.toLocaleDateString("es-CO", { month: "long", year: "numeric" });
  const firstDay = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  const cells = [];
  const offset = (firstDay + 6) % 7; // start Monday
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));

  const isSameDay = (a, b) => a && b && a.toDateString() === new Date(b).toDateString();

  return (
    <div>
      <label className="label">Selecciona una fecha</label>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
        <button className="btn btn-icon btn-soft" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><Icon name="chevronLeft" size={16}/></button>
        <span className="font-serif" style={{ fontSize: 17, fontWeight: 500, textTransform: "capitalize" }}>{monthName}</span>
        <button className="btn btn-icon btn-soft" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><Icon name="chevronRight" size={16}/></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 6, fontWeight: 600, letterSpacing: 0.04 }}>
        {["L","M","X","J","V","S","D"].map(d => (
          <div key={d} style={{ textAlign: "center", padding: "4px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i}/>;
          const isPast = d < today;
          const isMonday = d.getDay() === 1;
          const disabled = isPast || isMonday;
          const selected = isSameDay(d, value);
          const isToday = isSameDay(d, today);
          return (
            <button key={i} disabled={disabled} onClick={() => onChange(d)}
              style={{
                aspectRatio: "1", borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 600,
                border: `1px solid ${selected ? "var(--ink)" : isToday ? "var(--line-2)" : "transparent"}`,
                background: selected ? "var(--ink)" : disabled ? "transparent" : "var(--bg-2)",
                color: selected ? "var(--bg)" : disabled ? "var(--ink-4)" : "var(--ink)",
                cursor: disabled ? "not-allowed" : "pointer",
                textDecoration: isMonday && !isPast ? "line-through" : "none",
                transition: "all 140ms var(--ease)", minHeight: 40,
              }}
              onMouseEnter={e => !disabled && !selected && (e.currentTarget.style.background = "var(--bg-3)")}
              onMouseLeave={e => !disabled && !selected && (e.currentTarget.style.background = "var(--bg-2)")}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <div className="row tiny muted" style={{ gap: 14, marginTop: 10, flexWrap: "wrap" }}>
        <span className="row" style={{ gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--bg-2)" }}/>Disponible</span>
        <span className="row" style={{ gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--ink)" }}/>Seleccionado</span>
        <span className="row" style={{ gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "transparent", border: "1px solid var(--line-2)" }}/>Cerrado / pasado</span>
      </div>
    </div>
  );
};

Object.assign(window, { ReserveScreen, Calendar });
