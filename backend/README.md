# Backend · Finza

API en Node + TypeScript + Express, con Firestore (firebase-admin) como base
de datos y autenticacion por sesion (JWT en cookie `httpOnly`). Firestore se
elige en vez de SQLite porque el backend corre en Render free tier, que no
tiene disco persistente: un archivo SQLite local se borraba en cada reinicio
del dyno (deploy, o el sleep/wake por inactividad).

**Stack:** Express 4 · TypeScript · firebase-admin (Firestore) · Zod (validaciones) · bcryptjs · jsonwebtoken

## Arquitectura

Capas por modulo, cada una con una responsabilidad:

```
src/
  app.ts                  Configuracion de Express (middlewares, rutas)
  index.ts                Punto de entrada: levanta el servidor HTTP
  config/env.ts           Carga y valida variables de entorno (Zod)
  db/
    firestore.ts            Inicializa firebase-admin y exporta el cliente de Firestore
  lib/                     Utilidades sin estado: errores HTTP, JWT, hashing, cookies
  middleware/              require-auth (protege rutas), error-handler (errores -> JSON)
  modules/
    auth/                  routes -> controller -> service (login, registro, sesion)
    users/                 repository (coleccion `users`) + tipos
    banking/               conexion de cuentas bancarias (conector intercambiable + Firestore)
    assistant/             asistente de IA (stateless, sin base de datos)
  types/express.d.ts       Extiende Request de Express con `user`
```

Flujo de una request protegida: `routes -> middleware (requireAuth) -> controller -> service -> repository -> db`.
El controller solo traduce HTTP <-> dominio; la logica de negocio vive en `service`;
el acceso a Firestore vive en `repository`. Las validaciones de entrada (Zod) ocurren en el
controller, antes de llegar al service.

## Desarrollo local

```bash
cd backend
npm install
cp .env.example .env
# Descarga el service account de tu proyecto Firebase (Firebase Console ->
# Configuracion del proyecto -> Cuentas de servicio -> Generar nueva clave
# privada), guardalo como backend/firebase.json (ya esta en .gitignore) y
# agrega a tu .env: GOOGLE_APPLICATION_CREDENTIALS=./firebase.json
npm run dev          # http://localhost:4000, recarga en caliente con tsx
npm run build        # compila a backend/dist
npm start            # corre el build compilado
npm run lint         # type-check sin emitir
```

Firestore no tiene migraciones: las colecciones (`users`, `bankConnections`,
`bankAccounts`, `rawTransactions`) se crean solas al primer `set()`. En Render
no hace falta disco: las credenciales se inyectan por variable de entorno
(`FIREBASE_SERVICE_ACCOUNT`, ver abajo).

## Variables de entorno

Ver `.env.example`. Las mas importantes:

| Variable | Descripcion |
|---|---|
| `PORT` | Puerto HTTP del servidor (default `4000`) |
| `CORS_ORIGIN` | Origen permitido para CORS (URL del frontend) |
| `GOOGLE_APPLICATION_CREDENTIALS` | (solo local) ruta al JSON del service account de Firebase |
| `FIREBASE_SERVICE_ACCOUNT` | (solo produccion/Render) el JSON del service account completo, como string |
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

- **Firestore vs. SQLite local**: la primera version usaba `node:sqlite` (modulo
  nativo de Node, sin dependencias compiladas), pero Render free tier no da
  disco persistente -> los datos se perdian en cada reinicio del dyno.
  Firestore es un servicio externo administrado: persiste de verdad y no pide
  infraestructura propia. El acceso a datos sigue aislado en
  `modules/*/*.repository.ts`, asi que cambiar de motor otra vez (ej. a
  Postgres) no toca `service`/`controller`.
- **JWT en cookie httpOnly** en vez de `localStorage`: evita que el token sea
  legible por JavaScript en el navegador (mitiga robo via XSS).
- **Contrasenas con bcrypt**, nunca en texto plano ni en los campos `password_hash`
  expuestos al cliente (`toPublicUser` filtra el hash antes de responder).
