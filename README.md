# Hackatón BCP · Finanzas IA

App de educación financiera + IA para jóvenes (inspirada en el caso Tomín). Por ahora solo frontend.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router

## Desarrollo local

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc + build a frontend/dist
npm run preview    # sirve el build
npm run lint
```

Variables de entorno: copia `frontend/.env.example` a `frontend/.env`. Solo se exponen al navegador las que empiezan con `VITE_`.

## Estructura

```
frontend/src/
  layouts/      AppLayout (header + nav inferior)
  components/   BottomNav, ui/ (Button, Card, ProgressBar)
  pages/        Home, Transactions, Forecast, Assistant, Learn, NotFound
  types/        modelos (Transaction, Goal, Challenge, ChatMessage)
  data/mock.ts  datos de ejemplo (sin backend)
  lib/          utilidades (formato S/, fechas, ids)
```

Alias de import: `@/` → `frontend/src/`.

## Despliegue en Vercel

La configuración está en `vercel.json` (raíz): instala y construye `frontend/`, publica `frontend/dist` y reescribe todas las rutas a `index.html` para que React Router funcione al recargar.

**Opción A – GitHub:** sube el repo a GitHub → vercel.com → *Add New Project* → importa el repo → *Deploy* (no cambies Root Directory; deja la raíz).

**Opción B – CLI:** desde la raíz del repo:

```bash
npx vercel          # preview
npx vercel --prod   # producción
```

Variables como `VITE_APP_NAME` se configuran en *Project Settings → Environment Variables*.
