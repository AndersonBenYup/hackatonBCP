# Backend · Finza

API en Node + TypeScript + Express, con SQLite local (modulo nativo
[`node:sqlite`](https://nodejs.org/api/sqlite.html), sin dependencias
compiladas) como base de datos y autenticacion por sesion (JWT en cookie
`httpOnly`).

**Stack:** Express 4 · TypeScript · node:sqlite · Zod (validaciones) · bcryptjs · jsonwebtoken

## Arquitectura

Capas por modulo, cada una con una responsabilidad:

```
src/
  app.ts                  Configuracion de Express (middlewares, rutas)
  index.ts                Punto de entrada: levanta el servidor HTTP
  config/env.ts           Carga y valida variables de entorno (Zod)
  db/
    client.ts              Conexion a SQLite (node:sqlite)
    migrate.ts              Migraciones idempotentes del esquema
  lib/                     Utilidades sin estado: errores HTTP, JWT, hashing, cookies
  middleware/              require-auth (protege rutas), error-handler (errores -> JSON)
  modules/
    auth/                  routes -> controller -> service (login, registro, sesion)
    users/                 repository (acceso a la tabla users) + tipos
  types/express.d.ts       Extiende Request de Express con `user`
```

Flujo de una request protegida: `routes -> middleware (requireAuth) -> controller -> service -> repository -> db`.
El controller solo traduce HTTP <-> dominio; la logica de negocio vive en `service`;
el acceso a SQL vive en `repository`. Las validaciones de entrada (Zod) ocurren en el
controller, antes de llegar al service.

## Desarrollo local

```bash
cd backend
npm install
cp .env.example .env
npm run dev          # http://localhost:4000, recarga en caliente con tsx
npm run build        # compila a backend/dist
npm start            # corre el build compilado
npm run lint         # type-check sin emitir
```

La base de datos SQLite se crea automaticamente en `DATABASE_PATH` (por defecto
`backend/data/app.sqlite`) la primera vez que se levanta el servidor; las
migraciones (`src/db/migrate.ts`) crean las tablas si no existen.

## Variables de entorno

Ver `.env.example`. Las mas importantes:

| Variable | Descripcion |
|---|---|
| `PORT` | Puerto HTTP del servidor (default `4000`) |
| `CORS_ORIGIN` | Origen permitido para CORS (URL del frontend) |
| `DATABASE_PATH` | Ruta del archivo SQLite |
| `JWT_SECRET` | Secreto para firmar los JWT de sesion (**cambiar en produccion**) |
| `JWT_EXPIRES_IN` | Duracion de la sesion (ej. `7d`) |

## Endpoints

Todas las respuestas son JSON. Las rutas de auth usan una cookie `httpOnly`
llamada `session_token`; el frontend debe llamar con `credentials: 'include'`.

| Metodo | Ruta | Auth | Body | Descripcion |
|---|---|---|---|---|
| GET | `/api/health` | No | - | Chequeo de salud |
| POST | `/api/auth/register` | No | `{ name, email, password }` | Crea el usuario, inicia sesion |
| POST | `/api/auth/login` | No | `{ email, password }` | Valida credenciales, inicia sesion |
| POST | `/api/auth/logout` | No | - | Limpia la cookie de sesion |
| GET | `/api/auth/me` | Si | - | Devuelve el usuario autenticado |

### Validaciones (Zod, en `modules/auth/auth.schemas.ts`)

- `name`: 2-80 caracteres.
- `email`: formato de correo valido, normalizado a minusculas.
- `password`: 8-72 caracteres, al menos una letra y un numero.

Errores de validacion devuelven `400` con `{ error, details }` (`details` trae
el detalle por campo que arma Zod). Credenciales invalidas devuelven `401`;
un correo ya registrado devuelve `409`.

## Decisiones de diseno

- **SQLite local vs. servidor de DB**: para el alcance del hackathon, un solo
  archivo (via `node:sqlite`, el modulo nativo de Node, sincrono y sin pasos
  de compilacion ni dependencias de red) es suficiente y evita infraestructura
  adicional. Si el proyecto crece a multiples instancias, migrar a Postgres es
  sencillo porque el acceso a datos esta aislado en `modules/*/*.repository.ts`.
- **JWT en cookie httpOnly** en vez de `localStorage`: evita que el token sea
  legible por JavaScript en el navegador (mitiga robo via XSS).
- **Contrasenas con bcrypt**, nunca en texto plano ni en los campos `password_hash`
  expuestos al cliente (`toPublicUser` filtra el hash antes de responder).
