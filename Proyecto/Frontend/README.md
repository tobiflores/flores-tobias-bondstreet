# Frontend - Galería Bond Street

Interfaz del sistema desarrollada con **React + Vite**, conectada a la API de la Entrega 2.

## Ejecución

> Requiere el backend corriendo en `http://localhost:3000` (ver `../Backend`).

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Estructura

```text
src/
├── assets/        # Logo y recursos visuales
├── components/    # Componentes reutilizables (Header, Footer, ProductCard, ProductForm, Modal, ConfirmDialog, Loader, Notifications, ProductDetail)
├── pages/         # Pantallas: HomePage, CatalogPage, AdminPage
├── services/      # productos.service.js: toda la comunicación con la API
├── utils/         # formato.js (precios) y validaciones.js (formularios)
├── styles/        # global.css, components.css, pages.css
├── App.jsx        # Navegación y organización general (React Router)
└── main.jsx       # Punto de entrada
```

## Pantallas

- **Inicio** (`/`): respeta el wireframe original — header con logo y menú, sección de bienvenida (hero), productos destacados con botón "Más info" y sección "Sobre nosotros"; footer con ubicación, mail, teléfono y redes. Suma cinta marquee y chips de categorías (derivadas dinámicamente de la API).
- **Catálogo** (`/catalogo`): grilla de productos desde la API con buscador por nombre/categoría. El detalle de cada producto permite elegir **talle, color y cantidad** y agregarlo al carrito.
- **Carrito** (`/carrito`): items con talle/color, cantidades editables, quitar con confirmación, dirección de entrega, cupón de descuento y **confirmación del pedido** contra la API (requiere sesión iniciada). Los talles/colores que se ofrecen salen del stock real.
- **Mis pedidos** (`/mis-pedidos`): historial del cliente con estado, detalle, envío y código de seguimiento. Permite cancelar mientras el pedido no fue despachado.
- **Admin → Pedidos** (`/admin/pedidos`): todos los pedidos; el admin los avanza por el flujo Confirmado → En preparación → Enviado → Entregado o los cancela.
- **Admin → Cupones** (`/admin/cupones`): alta y activación/desactivación de cupones.
- **Admin → Stock**: desde la tabla de productos, botón "Stock" para editar cantidades y agregar variantes.
- **Login** (`/login`) y **Registro** (`/registro`): autenticación con validaciones (email válido, contraseña de 8+ caracteres con caracter especial).
- **Administración** (`/admin`): CRUD completo de productos. **Solo accesible con rol administrador** (ruta protegida + API protegida con token). Credenciales de prueba: `admin@bondstreet.com.ar` / `Admin#1234`.

La sesión y el carrito persisten en `localStorage` (contextos `AuthContext` y `CartContext`). El header muestra el contador del carrito, el saludo al usuario y oculta "Administración" a quienes no son admins.

## Decisiones de diseño

Estética **zine/punk neo-brutalista**, inspirada en la galería real: pasillos tapizados de graffitis y stickers, flyers y cinta de peligro.

- **Paleta** del boceto original: `#FC46F5` (principal), `#62EA07` (secundario), `#FF302D` (acento) sobre fondo tinta con ruido (SVG `feTurbulence`) y resplandores de neón.
- **Tipografías**: el boceto usa *Splatpunk* y *Coolvetica* (dafont). Se usan equivalentes web que preservan la identidad con contraste alto: **Rubik Spray Paint** (títulos graffiti) + **Archivo** (texto) + **Space Mono** (etiquetas, precios, botones). Las originales quedan primeras en el *font stack*.
- **Lenguaje visual**: sombras duras desplazadas, bordes gruesos sin radio, tarjetas y chips levemente rotados como stickers, cinta *marquee* animada, título del hero con "impresión desregistrada" (serigrafía barata), cinta adhesiva en "Sobre nosotros".
- **Motion**: reveals escalonados al cargar (`animation-delay`), stickers que se "estampan", micro-interacciones en botones y links. Respeta `prefers-reduced-motion`.
- **Contenido real de la Bond**: el catálogo refleja lo que se vende en la galería — tattoo, piercing, vinilos inéditos, cómics, stickers, pines, skate, ropa gótica y diseño independiente — no solo indumentaria.
- **Placeholder de imágenes**: los productos sin URL real muestran un recuadro con gradientes de la paleta (3 variantes) y la inicial del producto.

## Experiencia de usuario

- Estados de carga con spinner (`Loader`).
- Notificaciones laterales unificadas para éxitos y errores (`Notifications`, sin `alert()`).
- Validación de formularios con mensajes por campo.
- Confirmación modal antes de eliminar (`ConfirmDialog`).

## Accesibilidad

- HTML semántico (`header`, `nav`, `main`, `footer`, `article`, `table` con `caption`).
- Todos los `label` asociados a sus `input` (`htmlFor`/`id`).
- Errores de formulario con `role="alert"` y `aria-invalid`/`aria-describedby`.
- Notificaciones con `aria-live`, modales con `role="dialog"` y cierre con Escape.
- Textos alternativos en imágenes y foco visible en botones y enlaces.
