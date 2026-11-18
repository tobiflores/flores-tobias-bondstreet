# Backend - Galería Bond Street

API REST organizada con el patrón **MVC**, con persistencia temporal en memoria (arrays).

## Ejecución

```bash
npm install
npm start        # o npm run dev (con --watch)
```

El servidor queda escuchando en `http://localhost:3000`.

## Estructura

```text
src/
├── controllers/    # Reciben la request, delegan al service y responden
├── services/       # Lógica de negocio y validaciones
├── repositories/   # Acceso a datos (arrays en memoria)
├── models/         # Clases del dominio
├── routes/         # Definición de endpoints
├── middlewares/    # errorHandler (manejo centralizado) y notFoundHandler
├── responses/      # ApiResponse: formato uniforme de respuestas
├── exceptions/     # AppError y subclases (BadRequest, NotFound, Conflict)
├── enums/          # Messages: mensajes centralizados de la aplicación
└── utils/          # Validadores reutilizables
```

## CRUD de Producto

| Método | Ruta                 | Descripción                 | Acceso |
|--------|----------------------|-----------------------------|--------|
| GET    | `/api/productos`     | Obtener todos los productos | Público |
| GET    | `/api/productos/:id` | Obtener un producto por id  | Público |
| POST   | `/api/productos`     | Crear un producto           | Solo admin |
| PUT    | `/api/productos/:id` | Modificar un producto       | Solo admin |
| DELETE | `/api/productos/:id` | Eliminar un producto        | Solo admin |

## Autenticación y pedidos

| Método | Ruta                 | Descripción                                   | Acceso |
|--------|----------------------|-----------------------------------------------|--------|
| POST   | `/api/auth/registro` | Registrar un cliente (devuelve token)         | Público |
| POST   | `/api/auth/login`    | Iniciar sesión (devuelve token)               | Público |
| POST   | `/api/auth/logout`   | Cerrar sesión                                 | Autenticado |
| POST   | `/api/pedidos`       | Crear pedido con items (talle/color/cantidad) | Autenticado |
| GET    | `/api/pedidos`       | Ver los pedidos propios                       | Autenticado |

- Las rutas protegidas esperan el header `Authorization: Bearer <token>` (sesiones en memoria).
- Los middlewares `autenticar` y `soloAdmin` (en `middlewares/auth.js`) controlan el acceso.
- El precio de cada item del pedido se toma **siempre del servidor**, nunca del cliente.
- Validaciones de registro: email con formato válido y único; contraseña de mínimo 8 caracteres con al menos un caracter especial.
- **Administrador de prueba**: `admin@bondstreet.com.ar` / `Admin#1234` (los registros nuevos siempre son clientes).

Body esperado para POST/PUT:

```json
{
    "nombre": "Buzo Hoodie",
    "descripcion": "Buzo con capucha frisa",
    "precio": 55000,
    "imagen": "buzo-hoodie.jpg",
    "categoria": "Abrigos"
}
```

## Formato de respuestas

Éxito:

```json
{
    "success": true,
    "data": { }
}
```

Error:

```json
{
    "success": false,
    "message": "El producto no existe."
}
```

## Manejo de errores

- `enums/Messages.js`: enum con todos los mensajes de la aplicación.
- `exceptions/AppError.js`: clase base + `BadRequestError` (400), `NotFoundError` (404) y `ConflictError` (409).
- `middlewares/errorHandler.js`: middleware centralizado que traduce los errores al formato uniforme de respuesta.
