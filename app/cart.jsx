/* global React */
const { useState: useStateC, useEffect: useEffectC, createContext: createContextC, useContext: useContextC } = React;

/* Cart Context */
const CartContext = createContextC();

const CartProvider = ({ children }) => {
  const [items, setItems] = useStateC([]);
  const [orderType, setOrderType] = useStateC("domicilio"); // "domicilio" | "recoger"

  const add = (dish, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === dish.id);
      if (existing) return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...dish, qty }];
    });
  };
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const setQty = (id, qty) => {
    if (qty <= 0) return remove(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };
  const clear = () => setItems([]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = orderType === "domicilio" && items.length ? 6000 : 0;
  const total = subtotal + delivery;
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, subtotal, delivery, total, count, orderType, setOrderType }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContextC(CartContext);

window.CartProvider = CartProvider;
window.useCart = useCart;
