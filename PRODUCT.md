# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Jóvenes de 18 a 25 años en Perú que recién empiezan a manejar su propio dinero: estudiantes universitarios o personas en su primer empleo, con primer sueldo, primera tarjeta, y decisiones de ahorro que nunca tuvieron que tomar antes.

## Product Purpose

Finza ayuda a este usuario a entender y organizar su dinero: registra ingresos/gastos, define metas de ahorro, ve una proyección simple de fin de mes, aprende conceptos financieros reales (TCEA, fecha de corte, etc.) a través de retos gamificados con puntos/niveles/rachas, y puede preguntarle a un asistente de IA sobre sus propias finanzas. Éxito significa que alguien sin experiencia financiera previa termine entendiendo sus propios números y tomando mejores decisiones de ahorro/gasto.

## Positioning

No es un tracker de gastos genérico: combina educación financiera gamificada (retos que enseñan conceptos reales, no solo "anota tus gastos") con un asistente de IA que responde sobre los datos propios del usuario, no consejos financieros genéricos. Ese cruce — aprender haciendo + un asistente que conoce tu situación — es lo que un tracker de presupuesto convencional no ofrece.

## Operating Context

Construido para el Innovathon BCP (hackathon de 24 horas de Banco de Crédito del Perú para LatAm, enfocado en IA y educación financiera para jóvenes). El contexto inmediato de uso es la evaluación del jurado del hackathon; el usuario final declarado (jóvenes 18-25) es la audiencia de producto a largo plazo.

Frontend (React 19 + Vite + Tailwind v4 + React Router) despliega a Vercel (`frontend/vercel.json`, root directory `frontend`). Backend (Express + `node:sqlite` + JWT en cookie httpOnly) corre localmente (`localhost:4000`) sin target de despliegue resuelto todavía — ver `backend/README.md`.

## Capabilities and Constraints

- Registro de transacciones (ingreso/gasto) por categoría, con historial.
- Metas de ahorro con progreso (ahorrado / objetivo).
- Proyección simple de fin de mes (gasto diario promedio × días del mes) — el propio código la marca como provisional, a reemplazar por un modelo real.
- Aprendizaje gamificado: retos con puntos, niveles y racha de registro diaria; los retos enseñan conceptos financieros reales (ej. "¿Qué es la TCEA?", "Tarjeta de crédito 101: fecha de corte vs. fecha de pago").
- Asistente conversacional de IA sobre finanzas personales — **hoy es una respuesta simulada en el frontend (`mockReply` en `Assistant.tsx`), sin integración real a un modelo todavía.** Esto es una decisión de producto pendiente, no un hecho confirmado: cuándo y con qué proveedor se conecta un LLM real queda abierto.
- Autenticación obligatoria: todas las rutas excepto `/login` y `/registro` están protegidas; sesión validada contra `GET /api/auth/me` vía cookie httpOnly (sin tokens en `localStorage`).
- Todos los montos en Soles (S/); copy en español (es-PE); terminología financiera peruana real (TCEA, fecha de corte).
- Alcance de datos del hackathon es deliberado: toda la app corre hoy sobre datos simulados (`frontend/src/data/mock.ts`) excepto autenticación, que sí es real (SQLite). No hay integración bancaria real y no se debe asumir que es un descuido a resolver — es el límite declarado de esta entrega.

## Brand Commitments

- Nombre de producto: "Finza" (configurable vía `VITE_APP_NAME`, no un nombre de marca fijo e inmutable).
- Identidad visual ya en uso y confirmada como vinculante por el usuario a lo largo de este proyecto: azul institucional y coral extraídos directamente del isotipo oficial de BCP (`frontend/public/bcp.jpg`), con un motivo decorativo de chevrón que hace eco del isotipo (`BrandChevrons.tsx`). El producto pide apoyarse en la identidad de BCP (la institución que auspicia el hackathon) sin imitar la operativa bancaria real — sigue siendo una app complementaria, no una banca en línea.

## Evidence on Hand

- Datos de ejemplo para transacciones, metas, retos y chat en `frontend/src/data/mock.ts` — representativos del tono y escala esperados (montos en soles de rango estudiantil/primer sueldo), no datos reales de usuarios.
- Assets de marca reales: `frontend/public/bcp.jpg`, `bcp2.jpg` (isotipo BCP, fuente de la paleta extraída).
- No hay testimonios, casos de estudio, cifras de prensa ni benchmarks reales — ningún trabajo futuro debe inventarlos.

## Product Principles

1. Enseñar haciendo, no exponiendo: los conceptos financieros aterrizan a través de retos gamificados y de un tracking que se siente real, no de contenido estático para leer.
2. El asistente de IA habla sobre los datos propios del usuario, no da consejos financieros genéricos desconectados de su situación.
3. Diseñar para quien recibe su primer sueldo: sin asumir alfabetización financiera previa, en español, en soles, mobile-first.
4. Tomar prestada la confianza institucional de BCP sin imitar su operativa completa: la identidad visual hace eco del patrocinador: el producto sigue siendo una app enfocada, no una réplica de banca en línea.
5. El alcance con datos simulados es una frontera deliberada de esta entrega de hackathon, no un atajo a disculpar ni a "completar" sin que el usuario lo pida.
