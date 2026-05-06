/* global React, Icon, fmt, useCart, FoodPlaceholder, MENU */
const { useState: useStateCh, useEffect: useEffectCh } = React;

/* ============= CART/CHECKOUT SCREEN ============= */
const CheckoutScreen = ({ onBack, onComplete }) => {
  const { items, setQty, remove, subtotal, delivery, total, count, orderType, setOrderType, clear } = useCart();
  const [step, setStep] = useStateCh("cart"); // cart | shipping | payment | done

  if (count === 0 && step === "cart") {
    return <EmptyCart onBack={onBack} />;
  }

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "16px 20px 32px" }}>
      <div className="row" style={{ marginBottom: 20, gap: 8 }}>
        <button className="btn btn-icon btn-soft" onClick={onBack} aria-label="Volver"><Icon name="chevronLeft" size={18}/></button>
        <div>
          <span className="eyebrow">{step === "done" ? "" : "Tu pedido"}</span>
          <h1 className="font-serif" style={{ fontSize: 28, margin: 0, fontWeight: 500 }}>
            {step === "cart" && "Carrito"}
            {step === "shipping" && "Datos de envío"}
            {step === "payment" && "Pago"}
            {step === "done" && "¡Pedido confirmado!"}
          </h1>
        </div>
      </div>

      {/* Step rail */}
      {step !== "done" && (
        <div className="row" style={{ gap: 6, marginBottom: 20 }}>
          {[
            { id: "cart", label: "Carrito" },
            { id: "shipping", label: "Envío" },
            { id: "payment", label: "Pago" },
          ].map((s, i) => {
            const order = ["cart","shipping","payment"];
            const sIdx = order.indexOf(step);
            const iIdx = order.indexOf(s.id);
            const isActive = step === s.id;
            const isDone = iIdx < sIdx;
            return (
              <div key={s.id} className="row" style={{ flex: 1, gap: 8 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 999, fontSize: 11, fontWeight: 600, display: "grid", placeItems: "center",
                  background: isActive || isDone ? "var(--ink)" : "var(--bg-3)",
                  color: isActive || isDone ? "var(--bg)" : "var(--ink-3)",
                }}>{isDone ? <Icon name="check" size={12} stroke={2.4}/> : i+1}</span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? "var(--ink)" : "var(--ink-3)" }}>{s.label}</span>
                {i < 2 && <span style={{ flex: 1, height: 1, background: isDone ? "var(--ink)" : "var(--line-2)" }}/>}
              </div>
            );
          })}
        </div>
      )}

      {step === "cart" && (
        <CartView items={items} setQty={setQty} remove={remove} subtotal={subtotal} delivery={delivery} total={total} orderType={orderType} setOrderType={setOrderType} onContinue={() => setStep("shipping")} />
      )}
      {step === "shipping" && (
        <ShippingView orderType={orderType} onBack={() => setStep("cart")} onContinue={() => setStep("payment")} />
      )}
      {step === "payment" && (
        <PaymentView total={total} onBack={() => setStep("shipping")} onConfirm={() => { setStep("done"); }} />
      )}
      {step === "done" && (
        <SuccessView total={total} onClose={() => { clear(); onComplete && onComplete(); }} />
      )}
    </div>
  );
};

const EmptyCart = ({ onBack }) => (
  <div style={{ maxWidth: 480, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
    <div style={{ width: 80, height: 80, margin: "0 auto 18px", borderRadius: 999, background: "var(--bg-2)", display: "grid", placeItems: "center", color: "var(--ink-3)" }}>
      <Icon name="bag" size={32} />
    </div>
    <h2 className="font-serif" style={{ fontSize: 28, margin: "0 0 6px", fontWeight: 500 }}>Tu carrito está vacío</h2>
    <p className="muted" style={{ margin: "0 0 20px" }}>Explora nuestra carta y agrega tus platos favoritos.</p>
    <button className="btn btn-accent btn-lg" onClick={onBack}>Ver el menú</button>
  </div>
);

const CartView = ({ items, setQty, remove, subtotal, delivery, total, orderType, setOrderType, onContinue }) => (
  <div className="cart-grid" style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Order type toggle */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, padding: 4, background: "var(--bg-2)", borderRadius: "var(--r-md)" }}>
        {[
          { id: "domicilio", label: "Domicilio", icon: "truck" },
          { id: "recoger", label: "Recoger", icon: "bag" },
        ].map(o => (
          <button key={o.id} onClick={() => setOrderType(o.id)}
            style={{
              padding: "12px 16px", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: orderType === o.id ? "var(--white)" : "transparent",
              boxShadow: orderType === o.id ? "var(--shadow-sm)" : "none",
              fontWeight: 600, fontSize: 14, color: orderType === o.id ? "var(--ink)" : "var(--ink-3)",
              transition: "all 140ms var(--ease)", minHeight: 44,
            }}>
            <Icon name={o.icon} size={16}/> {o.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="card" style={{ overflow: "hidden" }}>
        {items.map((it, idx) => (
          <div key={it.id} className="row" style={{ padding: 14, gap: 14, borderBottom: idx < items.length - 1 ? "1px solid var(--line)" : "none" }}>
            <div style={{ width: 72, height: 72, flexShrink: 0 }}>
              <FoodPlaceholder label={`// ${it.name}`} height={72} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="font-serif" style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.2, marginBottom: 4 }}>{it.name}</div>
              <div className="tiny muted">{fmt(it.price)} c/u</div>
              <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                <div className="row" style={{ gap: 0, border: "1px solid var(--line)", borderRadius: 999, padding: 2, background: "var(--bg)" }}>
                  <button onClick={() => setQty(it.id, it.qty - 1)} className="btn btn-icon" style={{ width: 28, height: 28, minHeight: 28 }}><Icon name="minus" size={12}/></button>
                  <span style={{ minWidth: 24, textAlign: "center", fontWeight: 600, fontSize: 13 }}>{it.qty}</span>
                  <button onClick={() => setQty(it.id, it.qty + 1)} className="btn btn-icon" style={{ width: 28, height: 28, minHeight: 28 }}><Icon name="plus" size={12}/></button>
                </div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{fmt(it.price * it.qty)}</span>
              </div>
            </div>
            <button onClick={() => remove(it.id)} className="btn btn-icon" style={{ color: "var(--ink-3)", width: 32, height: 32, minHeight: 32 }} aria-label="Quitar"><Icon name="trash" size={14}/></button>
          </div>
        ))}
      </div>
    </div>

    <OrderSummary subtotal={subtotal} delivery={delivery} total={total} orderType={orderType}>
      <button className="btn btn-accent btn-lg" onClick={onContinue} style={{ width: "100%" }}>
        Continuar · {fmt(total)}
      </button>
    </OrderSummary>

    <style>{`
      @media (min-width: 880px) {
        .cart-grid { grid-template-columns: 1.5fr 1fr !important; align-items: start; }
      }
    `}</style>
  </div>
);

const OrderSummary = ({ subtotal, delivery, total, orderType, children }) => (
  <div className="card" style={{ padding: 18, position: "sticky", top: 80 }}>
    <div className="font-serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 14 }}>Resumen</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="muted">Subtotal</span><span>{fmt(subtotal)}</span>
      </div>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="muted">{orderType === "domicilio" ? "Envío" : "Recoger en tienda"}</span>
        <span>{delivery > 0 ? fmt(delivery) : "Gratis"}</span>
      </div>
      <div className="divider" style={{ margin: "8px 0" }}></div>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 600 }}>Total</span>
        <span className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>{fmt(total)}</span>
      </div>
    </div>
    <div style={{ marginTop: 18 }}>{children}</div>
    <div className="row" style={{ gap: 6, marginTop: 12, color: "var(--ink-3)", fontSize: 11 }}>
      <Icon name="clock" size={12}/> Tiempo estimado: 35–45 min
    </div>
  </div>
);

const ShippingView = ({ orderType, onBack, onContinue }) => {
  const [form, setForm] = useStateCh({ name: "", phone: "", address: "", details: "", notes: "" });
  const ok = form.name && form.phone && (orderType === "recoger" || form.address);

  return (
    <div className="cart-grid" style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr" }}>
      <div className="card" style={{ padding: 20 }}>
        <div className="font-serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 14 }}>
          {orderType === "domicilio" ? "¿A dónde lo enviamos?" : "Tus datos"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="label">Nombre</label>
              <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
            </div>
            <div>
              <label className="label">Teléfono</label>
              <input className="input" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
            </div>
          </div>
          {orderType === "domicilio" && (
            <>
              <div>
                <label className="label">Dirección</label>
                <input className="input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Calle 85 #11-53"/>
              </div>
              <div>
                <label className="label">Apto / detalles (opcional)</label>
                <input className="input" value={form.details} onChange={e => setForm({...form, details: e.target.value})} placeholder="Apto 302, torre B"/>
              </div>
            </>
          )}
          <div>
            <label className="label">Notas para la cocina (opcional)</label>
            <textarea className="input" rows="3" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Sin cebolla, alergias, etc."/>
          </div>
        </div>
      </div>
      <div className="col" style={{ gap: 12 }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="font-serif" style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{orderType === "domicilio" ? "Domicilio" : "Recoger en tienda"}</div>
          <p className="muted tiny" style={{ margin: 0, lineHeight: 1.5 }}>
            {orderType === "domicilio" ? "Llegamos en 35-45 min. Cobertura limitada al norte de Bogotá." : "Tu pedido estará listo en ~25 min en Calle 85 #11-53."}
          </p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-soft" onClick={onBack}><Icon name="chevronLeft" size={14}/> Atrás</button>
          <button className="btn btn-accent btn-lg" disabled={!ok} onClick={onContinue}
            style={{ flex: 1, ...((!ok) ? { opacity: 0.4, cursor: "not-allowed" } : {}) }}>
            Continuar al pago
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===== PAYMENT GATEWAY ===== */
const PaymentView = ({ total, onBack, onConfirm }) => {
  const [method, setMethod] = useStateCh("card");
  const [card, setCard] = useStateCh({ number: "", name: "", exp: "", cvv: "" });
  const [processing, setProcessing] = useStateCh(false);

  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (v) => v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");

  const cardOk = method !== "card" || (card.number.replace(/\s/g, "").length >= 15 && card.name && card.exp.length >= 5 && card.cvv.length >= 3);

  const submit = () => {
    setProcessing(true);
    setTimeout(() => onConfirm(), 1600);
  };

  return (
    <div className="cart-grid" style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr" }}>
      <div className="card" style={{ padding: 20 }}>
        <div className="font-serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 14 }}>Método de pago</div>

        {/* Method tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
          {[
            { id: "card", label: "Tarjeta", icon: "card" },
            { id: "pse", label: "PSE", icon: "bag" },
            { id: "cash", label: "Efectivo", icon: "truck" },
          ].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              style={{
                padding: 14, borderRadius: "var(--r-md)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                border: `1px solid ${method === m.id ? "var(--ink)" : "var(--line)"}`,
                background: method === m.id ? "var(--bg-2)" : "var(--white)",
                fontSize: 12, fontWeight: 600, transition: "all 160ms var(--ease)", minHeight: 76,
              }}>
              <Icon name={m.icon} size={18}/> {m.label}
            </button>
          ))}
        </div>

        {method === "card" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Visual card */}
            <div style={{
              borderRadius: "var(--r-lg)", padding: 20, color: "#fff", minHeight: 180,
              background: "linear-gradient(135deg, oklch(0.30 0.04 38) 0%, oklch(0.20 0.02 38) 100%)",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              fontFamily: "var(--mono)",
            }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 500 }}>Fonda Norte</span>
                <span style={{ width: 40, height: 26, borderRadius: 4, background: "linear-gradient(135deg, #f4d36b, #c79e34)" }}></span>
              </div>
              <div style={{ fontSize: 18, letterSpacing: "0.12em" }}>
                {(card.number || "•••• •••• •••• ••••").padEnd(19, "•").slice(0, 19)}
              </div>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 11, opacity: 0.8 }}>
                <div>
                  <div style={{ opacity: 0.6, fontSize: 9, textTransform: "uppercase", marginBottom: 2 }}>Titular</div>
                  <div>{card.name || "TITULAR"}</div>
                </div>
                <div>
                  <div style={{ opacity: 0.6, fontSize: 9, textTransform: "uppercase", marginBottom: 2 }}>Vence</div>
                  <div>{card.exp || "MM/AA"}</div>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Número de tarjeta</label>
              <input className="input" inputMode="numeric" value={card.number}
                onChange={e => setCard({...card, number: formatCard(e.target.value)})}
                placeholder="1234 5678 9012 3456"/>
            </div>
            <div>
              <label className="label">Titular</label>
              <input className="input" value={card.name} onChange={e => setCard({...card, name: e.target.value.toUpperCase()})} placeholder="MARÍA RESTREPO"/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="label">Vencimiento</label>
                <input className="input" inputMode="numeric" value={card.exp}
                  onChange={e => setCard({...card, exp: formatExp(e.target.value)})} placeholder="MM/AA"/>
              </div>
              <div>
                <label className="label">CVV</label>
                <input className="input" inputMode="numeric" value={card.cvv}
                  onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4)})} placeholder="123"/>
              </div>
            </div>
          </div>
        )}

        {method === "pse" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label className="label">Banco</label>
              <select className="select">
                <option>Bancolombia</option>
                <option>BBVA</option>
                <option>Davivienda</option>
                <option>Banco de Bogotá</option>
              </select>
            </div>
            <p className="tiny muted" style={{ margin: 0 }}>Te redirigiremos a la pasarela PSE para completar el pago de forma segura.</p>
          </div>
        )}

        {method === "cash" && (
          <div style={{ background: "var(--bg-2)", padding: 14, borderRadius: "var(--r-md)" }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Pago contra entrega</div>
            <p className="tiny muted" style={{ margin: 0 }}>Recibimos efectivo o pago con datáfono al momento de la entrega.</p>
          </div>
        )}

        <div className="row" style={{ gap: 6, marginTop: 18, color: "var(--ink-3)", fontSize: 11 }}>
          <Icon name="check" size={12}/> Pago seguro · cifrado SSL · 3D Secure
        </div>
      </div>

      <div className="col" style={{ gap: 12 }}>
        <OrderSummary subtotal={total - (total > 0 ? 6000 : 0)} delivery={6000} total={total} orderType="domicilio">
          <button className="btn btn-accent btn-lg" disabled={!cardOk || processing} onClick={submit}
            style={{ width: "100%", ...((!cardOk || processing) ? { opacity: 0.7 } : {}) }}>
            {processing ? <><span className="spinner"/> Procesando…</> : <>Pagar {fmt(total)}</>}
          </button>
        </OrderSummary>
        <button className="btn btn-soft" onClick={onBack} disabled={processing}><Icon name="chevronLeft" size={14}/> Atrás</button>
      </div>

      <style>{`
        .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 999px; animation: spin 700ms linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const SuccessView = ({ total, onClose }) => {
  const orderId = "FN-" + Math.floor(Math.random() * 9000 + 1000);
  return (
    <div className="card" style={{ padding: 32, textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ width: 72, height: 72, borderRadius: 999, background: "var(--success)", color: "#fff", margin: "0 auto 18px", display: "grid", placeItems: "center" }}>
        <Icon name="check" size={36} stroke={2.4}/>
      </div>
      <h2 className="font-serif" style={{ fontSize: 26, margin: "0 0 6px", fontWeight: 500 }}>¡Pedido recibido!</h2>
      <p className="muted" style={{ margin: "0 0 20px", fontSize: 14 }}>Pedido <strong style={{ color: "var(--ink)" }}>{orderId}</strong> · Te enviamos la confirmación por WhatsApp.</p>
      <div style={{ background: "var(--bg-2)", borderRadius: "var(--r-md)", padding: 16, marginBottom: 20 }}>
        <div className="row" style={{ justifyContent: "space-between", fontSize: 13 }}>
          <span className="muted">Total cobrado</span>
          <span style={{ fontWeight: 600 }}>{fmt(total)}</span>
        </div>
        <div className="row" style={{ justifyContent: "space-between", fontSize: 13, marginTop: 6 }}>
          <span className="muted">Tiempo estimado</span>
          <span style={{ fontWeight: 600 }}>35-45 min</span>
        </div>
      </div>
      <button className="btn btn-primary btn-lg" onClick={onClose} style={{ width: "100%" }}>Volver al inicio</button>
    </div>
  );
};

Object.assign(window, { CheckoutScreen });
