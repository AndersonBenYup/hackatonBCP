# Hackatón BCP · Finza

App de educación financiera + IA para jóvenes (inspirada en el caso Tomín).
Incluye un sitio público (Inicio, Nosotros, Giro, Planes, Aplicación) y,
detrás del login, la app con autenticación y vínculo bancario reales
(Firestore) para registrar tus movimientos sin anotarlos a mano.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router (frontend) ·
Express · Firestore (firebase-admin) · Zod · JWT (backend)

## Desarrollo local

El proyecto tiene dos partes que corren por separado. Backend primero (expone
la API en `:4000`), luego frontend (`:5173`):

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env
# Requiere credenciales de Firebase: ver backend/README.md
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
  layouts/      PublicLayout (sitio publico), AppLayout (header + nav inferior, bajo /app)
  components/   BankAggregatorFlow, TransactionKanban, BottomNav, Sidebar, ProtectedRoute, GuestRoute, AdminRoute, charts/, ui/
  context/      AuthContext (sesion), AccountDataContext (movimientos, plan del mes, fecha de referencia)
  pages/
    public/     Landing, Nosotros, Giro, Planes, Aplicacion (sin sesion)
    Login, Register, Home, Transactions, LinkAccount, Forecast, Assistant, Learn, Admin, NotFound
  types/        modelos (Transaction, Goal, Challenge, ChatMessage, User, BankConnection)
  data/         mock.ts (dataset de la cuenta demo), empty.ts (cuenta nueva), banks.ts (bancos del flujo de vinculo)
  lib/          utilidades (api client, formato S/, fechas, ids, localStorage)

backend/src/
  config/       variables de entorno (validadas con Zod)
  db/           cliente de Firestore (firebase-admin)
  lib/          utilidades: errores HTTP, JWT, hashing, cookies
  middleware/   requireAuth, requireAdmin, manejo de errores
  modules/
    auth/       registro, login, logout, sesion actual
    users/      coleccion users (Firestore) y siembra de las cuentas admin y demo
    admin/      listar y eliminar usuarios
    banking/    vinculo de cuentas bancarias (conector intercambiable + Firestore)
    assistant/  asistente de IA (OpenRouter), responde con los movimientos del usuario
```

Alias de import en el frontend: `@/` → `frontend/src/`. Ver `backend/README.md`
para el detalle de la arquitectura, endpoints y decisiones de diseno del
backend (por que Firestore, por que JWT en cookie httpOnly, etc.).

## Rutas y autenticacion

El sitio publico (`/`, `/nosotros`, `/giro`, `/planes`, `/aplicacion`) es
visible sin sesion. Todas las rutas bajo `/app/*` estan protegidas por
`ProtectedRoute`, que redirige a `/login` si no hay sesion activa. La sesion
se valida contra `GET /api/auth/me` del backend usando una cookie `httpOnly`
(no hay tokens en `localStorage`).

Para entrar hay que registrarse primero en `/registro`: el login ya no crea
cuentas. Las excepciones son `admin@finza.app` y `demo@finza.app`, que no se
pueden registrar desde la web: el backend las siembra al arrancar. La demo entra
con `demo@finza.app` / `demo123` (cambiable con `DEMO_PASSWORD`) y muestra el
dataset de ejemplo, fijo en octubre de 2026; las demas cuentas usan la fecha real.
La clave del admin solo cambia si se define `ADMIN_PASSWORD`.

## Despliegue en Vercel

La configuración está en `frontend/vercel.json`. En Vercel, **Root Directory = `frontend`** (Settings → Build and Deployment). Publica `dist` y reescribe todas las rutas a `index.html` para que React Router funcione al recargar.

**Opción A – GitHub:** sube el repo a GitHub → vercel.com → *Add New Project* → importa el repo → en *Root Directory* elige `frontend` → *Deploy*.

**Opción B – CLI:** desde `frontend/`:

```bash
npx vercel          # preview
npx vercel --prod   # producción
```

Variables como `VITE_APP_NAME` se configuran en *Project Settings → Environment Variables*.
