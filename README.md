# Hackatón BCP · Finanzas IA

App de educación financiera + IA para jóvenes (inspirada en el caso Tomín).
Frontend en React con un backend propio (Node + SQLite) para autenticación
de usuarios.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router (frontend) ·
Express · node:sqlite · Zod · JWT (backend)

## Desarrollo local

El proyecto tiene dos partes que corren por separado. Backend primero (expone
la API en `:4000`), luego frontend (`:5173`):

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env
npm run dev

# Terminal 2 — frontend
cd frontend
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

Otros comandos por paquete: `npm run build`, `npm run lint` (ambos),
`npm run preview` (frontend), `npm start` (backend, corre el build compilado).

Variables de entorno: cada paquete tiene su propio `.env.example`. En el
frontend solo se exponen al navegador las que empiezan con `VITE_`.

## Estructura

```
frontend/src/
  layouts/      AppLayout (header + nav inferior)
  components/   BottomNav, ProtectedRoute, GuestRoute, ui/ (Button, Card, Input, ProgressBar)
  context/      AuthContext (sesion del usuario autenticado)
  pages/        Login, Register, Home, Transactions, Forecast, Assistant, Learn, NotFound
  types/        modelos (Transaction, Goal, Challenge, ChatMessage, User)
  data/mock.ts  datos de ejemplo (sin backend)
  lib/          utilidades (api client, formato S/, fechas, ids)

backend/src/
  config/       variables de entorno (validadas con Zod)
  db/           conexion SQLite (node:sqlite) y migraciones
  lib/          utilidades: errores HTTP, JWT, hashing, cookies
  middleware/   requireAuth, manejo de errores
  modules/
    auth/       registro, login, logout, sesion actual
    users/      acceso a la tabla users
```

Alias de import en el frontend: `@/` → `frontend/src/`. Ver `backend/README.md`
para el detalle de la arquitectura, endpoints y decisiones de diseno del
backend (por que SQLite local, por que JWT en cookie httpOnly, etc.).

## Autenticacion

El login es requisito para usar la app: todas las rutas de `frontend/src/pages`
(excepto `/login` y `/registro`) estan protegidas por `ProtectedRoute`, que
redirige a `/login` si no hay sesion activa. La sesion se valida contra
`GET /api/auth/me` del backend usando una cookie `httpOnly` (no hay tokens en
`localStorage`).

## Despliegue en Vercel

La configuración está en `frontend/vercel.json`. En Vercel, **Root Directory = `frontend`** (Settings → Build and Deployment). Publica `dist` y reescribe todas las rutas a `index.html` para que React Router funcione al recargar.

**Opción A – GitHub:** sube el repo a GitHub → vercel.com → *Add New Project* → importa el repo → en *Root Directory* elige `frontend` → *Deploy*.

**Opción B – CLI:** desde `frontend/`:

```bash
npx vercel          # preview
npx vercel --prod   # producción
```

Variables como `VITE_APP_NAME` se configuran en *Project Settings → Environment Variables*.
