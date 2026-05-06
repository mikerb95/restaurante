# Restaurante Digital Completo

_Started 2026-05-03 16:28 UTC_

---

## User

crea una pagina web para un restaurante, incluye la parte de menu, ubicacion, domicilios, carrito de compras, pasarela de pago, un panel para el admin bien elaborado tipo CRM, donde puede editar el menu, datos de contacto, fotos, etc. Debe tener una estetica limpa, bien elaborada, concisa pero no corta. Añade micro-interacciones a los botones (hover effects) y una animación de carga (skeleton screen) para cuando se filtran los platos del menú. Asegúrate de que el diseño sea 'Mobile First', optimizando la navegación para dedos en pantallas pequeñas. Crea un widget de reservas interactivo. El usuario debe poder seleccionar fecha en un calendario, número de personas y turno (almuerzo/cena). Si es para más de 8 personas, muestra un aviso de 'Contacto directo para eventos'. Diseña un componente de Menú Digital categorizado (Entradas, Fuertes, Bebidas). Debe permitir filtrar por alérgenos (vegano, sin gluten) y mostrar una ventana emergente (modal) con el detalle del plato y su puntaje de cata o maridaje sugerido. Crea el layout de una landing page funcional que incluya:  Hero Section: Con espacio para una imagen de alta resolución y un botón de 'Reserva Ahora'.  Menú Destacado: Una cuadrícula interactiva con los 3 platos estrella.  Social Proof: Sección de testimonios y feed de Instagram.  Footer: Con mapa de ubicación integrado, horarios y enlaces a redes sociales."

## Assistant

Voy a crear una página web completa para un restaurante con todas las características que mencionas. Como no me proporcionaste un sistema de diseño o referencias específicas, voy a usar una estética limpia y moderna basada en la guía por defecto.

**Sistema de diseño que usaré:**
- **Tipografía**: "Fraunces" (serif elegante para títulos) + "Inter" (sans-serif para UI/cuerpo)
- **Paleta**: Crema cálido (#FAF6F0), tinta oscura (#1A1714), acento terracota (oklch en tono cálido)
- **Estética**: Restaurante elegante, mobile-first, microinteracciones sutiles

Crearé una experiencia diseñada como prototipo interactivo, con vistas para: Cliente (landing, menú, reservas, carrito, checkout) y Admin (CRM).

_[tool: update_todos]_

Voy a empezar construyendo la estructura.

_[tool: write_file]_

Ahora voy a crear los componentes principales. Los dividiré en archivos separados para mantenerlos manejables.

_[tool: write_file]_

_[tool: write_file]_

Ahora la landing page:

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

Continuando con el widget de reservas y el carrito/checkout.

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

Listo. Creé **Fonda Norte**, un sitio web completo con CRM administrativo.

**Lo que incluye:**

🍽️ **Sitio público** (mobile-first)
- **Landing**: Hero con plato del día, 3 platos destacados, testimonios, feed de Instagram, footer con mapa, horarios y redes.
- **Menú digital**: categorías (Entradas/Fuertes/Bebidas), filtros por alérgenos (vegano, vegetariano, sin gluten), búsqueda y **skeleton screens** al filtrar.
- **Modal de plato**: detalle, puntaje de cata animado y maridaje sugerido.
- **Widget de reservas**: calendario, selector de personas (1-9+), turno almuerzo/cena, slots de hora, y aviso "Contacto directo para eventos" si son más de 8 personas.
- **Carrito + checkout en 3 pasos**: domicilio/recoger, datos de envío, pasarela de pago con tarjeta visual interactiva, PSE y efectivo.

🛠️ **CRM Admin** (botón flotante con engrane abajo a la derecha)
- Dashboard con KPIs, gráfica de ingresos, platos top y actividad reciente.
- Editor de menú (tabla + modal de edición con etiquetas).
- Reservas con estados.
- Pedidos en tablero Kanban (Nuevos → Cocina → Ruta → Entregados).
- Galería con drag & drop.
- Ajustes de contacto, horarios, redes y branding.

**Estética**: serif Fraunces + Inter, paleta crema/tinta con acento terracota, microinteracciones en hover/click, navegación inferior fija en mobile y barra superior en desktop.

**Próximos pasos sugeridos**: agregar fotos reales de platos (los placeholders rayados las marcan), conectar la pasarela a un proveedor real (Wompi/PayU), e integrar un mapa real (Google/Mapbox) reemplazando el SVG decorativo del footer.

