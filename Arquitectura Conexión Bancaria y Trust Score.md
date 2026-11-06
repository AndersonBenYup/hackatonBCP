# Arquitectura: Conexión Bancaria y Trust Score

Nov 3, 2026

> **Estado actual:** este documento es la propuesta de arquitectura, no una descripción del sistema. Ya existe `modules/banking` con el conector simulador, y la base de datos es Firestore, no `node:sqlite`, así que lo que aquí se dice de tablas y migraciones se aplica como colecciones. Prometeo, el Trust Score y los módulos `transactions`, `categorization`, `goals`, `trust-score` y `partners` no están construidos. Los dos diagramas originales se perdieron al exportar el documento. Para ver lo que existe hoy, consulta `backend/README.md`.

## Resumen ejecutivo

La app pasa de ser un registro manual de metas a un hub financiero conectado: el usuario vincula sus cuentas (Yape, cuentas de ahorro, tarjetas) una sola vez, y la app lee sus movimientos reales para calcular el avance hacia sus metas automáticamente.

Esa misma data, agregada y con consentimiento explícito, alimenta un **Trust Score** financiero que bancos aliados pueden consultar para evaluar precalificación de crédito — el gancho de negocio que convierte la app en un canal B2B2C para BCP.

La arquitectura se construye en capas desacopladas: un **conector bancario** que abstrae el origen de los datos (agregador real o simulador), un **motor de categorización IA** que no depende de qué banco los entregó, y un **motor de Trust Score** que solo expone señales agregadas, nunca movimientos crudos, a terceros.

## Flujo de usuario end-to-end

1. El usuario crea una meta (ej. "Laptop nueva, S/ 3,000").
2. Vincula una o más cuentas (Yape, cuenta de ahorros, tarjeta de crédito) mediante el flujo de consentimiento del conector bancario.
3. El conector sincroniza movimientos nuevos en segundo plano (webhook o polling periódico).
4. El motor de categorización IA clasifica cada movimiento (tipo, categoría, ¿aporta a una meta?) y lo guarda normalizado.
5. El progreso de la meta se recalcula automáticamente con cada movimiento relevante — sin que el usuario anote nada a mano.
6. Al llegar al 100%, el usuario confirma "Meta cumplida": la meta se archiva con su evidencia (movimientos que la financiaron) y queda como constancia histórica.
7. El usuario crea la siguiente meta y el ciclo se repite; cada ciclo cumplido suma al Trust Score.

&#91;embedded content: arquitectura modular: 4 capas + 2 sistemas externos\]

El frontend solo habla con el backend; el backend es el único que conversa con el agregador bancario y con el banco aliado, y nunca expone movimientos crudos hacia afuera, solo el Trust Score agregado.

## Conexión bancaria: cómo se lee el movimiento real

La app nunca habla directo con Yape o con el banco. Habla con un **conector** detrás de una interfaz propia (`BankConnector`), para poder cambiar de proveedor sin tocar el resto del sistema:

```
interface BankConnector {
  startLinkFlow(userId): LinkSession
  listAccounts(connectionId): Account[]
  syncTransactions(connectionId, since): RawTransaction[]
  revoke(connectionId): void
}
```

Tres implementaciones posibles de esa interfaz, para distintas etapas:

| Opción | Qué es | Cuándo usarla |
| --- | --- | --- |
| Simulador interno | Genera movimientos sintéticos realistas para una cuenta "demo" | Paso 1 del PMV: construir y probar todo el flujo sin depender de un proveedor ni de una cuenta real |
| Agregador LatAm (Prometeo) | API de terceros que ya resuelve el login bancario y entrega movimientos normalizados. En Perú, Prometeo anuncia conexión con BCP, Interbank, BBVA y Scotiabank y ofrece sandbox (Belvo y Fintoc tienen poca o ninguna cobertura en Perú) | Paso 2 del PMV (obligatorio): vinculación y movimientos reales, primero en sandbox y luego en producción |
| Integración directa con BCP / Yape | Acceso vía una API propia del banco (si BCP decide exponerla) | Única opción realista a largo plazo si el banco es el aliado estratégico |

**Decisión para el PMV del hackathon:** se construye en dos pasos detrás de la misma interfaz `BankConnector`. Paso 1: el simulador (Fase 0) genera movimientos sintéticos de Yape, cuenta de ahorros y tarjeta, para tener todo el producto funcionando. Paso 2: se agrega un `PrometeoConnector` y el PMV lee cuentas reales; cambiar de proveedor es solo configuración ([cobertura de Prometeo en Perú](https://www.expreso.com.pe/tecnologia/prometeo-plataforma-open-banking-conecta-a-bancos-peruanos-tecnologia-peru-bancos/)).

**Paso 2 — integración con el agregador (obligatoria):** conectar Prometeo para vincular cuentas y leer sus movimientos; el simulador queda como respaldo y para pruebas.

1. Crear la cuenta de desarrollador en Prometeo y guardar la API key de sandbox en el `.env` del backend.
2. Implementar en `PrometeoConnector` los cuatro métodos de `BankConnector`, empezando por la vinculación (`startLinkFlow`, `listAccounts`) y luego `syncTransactions` y `revoke`.
3. En la pantalla "Vincular cuenta", agregar la opción "Banco de prueba (Prometeo)" junto a la cuenta simulada.
4. Probar con el usuario y la clave de prueba del sandbox, mostrar las cuentas que devuelve y sincronizar sus movimientos.
5. Guardar la conexión en `bank_connections` con `provider = 'prometeo'`.

Con esto el PMV pasa de datos simulados a cuentas vinculadas de verdad, y el resto del sistema (categorización, metas, Trust Score) no cambia.

El flujo de consentimiento (`startLinkFlow`) siempre corre en una ventana del proveedor (estilo OAuth), nunca pidiendo la clave del banco dentro de la app — ese patrón ya lo resuelven los agregadores y es el estándar de seguridad esperado.

La sincronización (`syncTransactions`) corre por un **job en segundo plano** (polling cada N horas, o webhook si el proveedor lo soporta), no en el request del usuario — evita que abrir la app se sienta lento.

## Ingestión y categorización con IA

Cada movimiento que llega del conector bancario pasa por un pipeline de tres pasos antes de tocar la base de datos de la app:

1. **Normalización**: el formato propio de cada banco/agregador se traduce a un esquema único (`external_id`, `amount`, `currency`, `merchant_raw`, `date`, `account_id`). El `external_id` evita duplicar un movimiento si la sincronización se repite.
2. **Categorización**: un modelo clasifica el movimiento en una categoría (comida, transporte, servicios, etc.) y detecta si corresponde a un aporte de una meta activa. Para el hackathon, un clasificador por reglas + palabras clave del comercio cubre la mayoría de los casos; un LLM (few-shot, el mismo proveedor que usaría el asistente) resuelve los casos ambiguos y mejora con el tiempo.
3. **Revisión del usuario**: toda categoría asignada por IA queda editable — si el usuario la corrige, esa corrección se guarda como ejemplo para mejorar la clasificación futura (feedback loop simple, no reentrenamiento en vivo).

El motor de categorización es un módulo propio (`modules/categorization`) que no sabe de qué banco vino el movimiento — solo recibe el esquema normalizado. Así, agregar un banco nuevo nunca toca esta capa.

## Metas y progreso automático

Una meta deja de ser un número que el usuario actualiza a mano. Pasa a ser una consulta sobre movimientos reales:

- Al crear una meta, el usuario puede **etiquetarla** con una o más cuentas/categorías que cuentan hacia ella (ej. "todo lo que entre a mi cuenta de ahorros Interbank cuenta para 'Laptop nueva'").
- Cada movimiento categorizado que coincide con esas reglas se registra como un `goal_contribution`, con referencia al movimiento origen — nunca se duplica el monto, se referencia.
- El avance (`saved / target`) se recalcula on-the-fly a partir de la suma de contribuciones, no se guarda como un campo editable.
- Botón **"Meta cumplida"**: disponible cuando `saved >= target`. Al presionarlo, la meta cambia de estado a `completed`, se congela su lista de contribuciones como evidencia, y se emite un evento `goal.completed` que alimenta el Trust Score.
- Una meta completada queda visible en un historial — es la "constancia" que el usuario (y potencialmente un banco) puede revisar.

## Trust Score: la señal para bancos aliados

El Trust Score es una capa de **solo-lectura agregada**, nunca un canal que expone movimientos crudos a un tercero. Se calcula a partir de señales ya existentes en la app:

| Señal | Qué mide | Fuente |
| --- | --- | --- |
| Consistencia de ahorro | % de meses con aporte neto positivo a alguna meta | `goal_contributions` |
| Tasa de cumplimiento de metas | Metas completadas / metas creadas | tabla `goals` |
| Estabilidad de ingresos | Varianza de ingresos detectados mes a mes | `categorized_transactions` |
| Disciplina de gasto | Gasto real vs. proyección de fin de mes | motor de forecast existente |
| Antigüedad de la cuenta vinculada | Meses desde la primera sincronización | `bank_connections` |

Estas señales se combinan en un score (0–1000, estilo buró) recalculado por un job periódico (`trust-score.worker`), nunca en tiempo real por request.

**Exposición a bancos**: un banco aliado nunca llama directo a la base de datos de la app. Se le expone un endpoint `GET /api/partners/trust-score/:consentToken` que requiere:

1. **Consentimiento explícito y revocable** del usuario (pantalla "Comparte tu Trust Score con BCP para precalificación" — opt-in, nunca automático).
2. Un token de consentimiento de un solo propósito, con expiración, emitido por la app — no una credencial del banco hacia los datos del usuario.
3. Respuesta mínima: el score, su fecha de cálculo y 2-3 señales resumen (ej. "cumplió 3 de 3 metas") — nunca la lista de movimientos.

Cada consulta de un banco queda en un `audit_log` que el usuario puede ver ("BCP consultó tu score el 12/11").

## Modelo de datos

El esquema actual solo tiene `users` (autenticación real). Todo lo demás vive hoy como mock en el frontend. La propuesta agrega estas tablas, todas con `user_id` como llave foránea:

| Tabla | Propósito | Columnas clave |
| --- | --- | --- |
| `bank_connections` | Una cuenta vinculada por el usuario a un proveedor | `id`, `user_id`, `provider`, `access_token_encrypted`, `status`, `linked_at` |
| `bank_accounts` | Cuentas/tarjetas dentro de una conexión | `id`, `connection_id`, `type`, `last4`, `alias` |
| `raw_transactions` | Movimiento tal como llegó del proveedor, cifrado | `id`, `account_id`, `external_id` (único), `amount`, `date`, `merchant_raw` |
| `categorized_transactions` | Movimiento normalizado + categoría asignada | `id`, `raw_transaction_id`, `category`, `type`, `confidence`, `corrected_by_user` |
| `goals` | Metas del usuario (reemplaza el mock actual) | `id`, `user_id`, `name`, `target`, `status` (`active`/`completed`) |
| `goal_contributions` | Qué movimiento aportó a qué meta | `id`, `goal_id`, `categorized_transaction_id`, `amount` |
| `partner_consents` | Consentimiento de un usuario para compartir su Trust Score con un banco | `id`, `user_id`, `partner`, `token`, `expires_at`, `revoked_at` |
| `trust_score_snapshots` | Historial de scores calculados | `id`, `user_id`, `score`, `signals_json`, `calculated_at` |
| `partner_access_log` | Auditoría de cada consulta de un banco | `id`, `consent_id`, `queried_at` |

`external_id` único en `raw_transactions` es lo que hace la sincronización idempotente — repetir un sync nunca duplica un movimiento.

## Seguridad, privacidad y cumplimiento

- **Ley peruana de protección de datos personales (Ley N.° 29733)** exige consentimiento informado y finalidad específica para compartir datos financieros con un tercero (el banco aliado) — el flujo de consentimiento del Trust Score debe declarar esa finalidad explícitamente, no esconderla en términos y condiciones genéricos.
- **Nunca se guarda el PAN de una tarjeta ni credenciales bancarias en texto plano** — el conector bancario (agregador) maneja esa parte; la app solo guarda un token de acceso cifrado al agregador, revocable.
- **Minimización de datos**: el Trust Score expuesto a bancos es agregado, no movimientos. Internamente, los movimientos crudos se cifran en reposo (columna o base cifrada, no solo el disco).
- **Consentimiento revocable en cualquier momento**: desvincular una cuenta borra sus tokens de acceso y detiene la sincronización de inmediato; no borra el historial ya usado para metas completadas (es evidencia histórica del usuario, no del banco).
- **SBS (Superintendencia de Banca, Seguros y AFP)**: cualquier integración formal con un banco real para precalificación de crédito necesita validación legal/regulatoria del lado de BCP — este documento asume que ese paso existe aparte, en el roadmap, no lo resuelve.

## Integración con el stack actual

El backend ya sigue un patrón modular por dominio (`modules/auth`, `modules/users`) sobre Express + `node:sqlite`, con migraciones idempotentes en `db/migrate.ts` y JWT en cookie httpOnly. La propuesta extiende ese mismo patrón, no lo reemplaza:

- `modules/banking` — conexión de cuentas, conectores por proveedor, sincronización.
- `modules/transactions` — ingestión normalizada y persistida (hoy solo vive como mock en `frontend/src/data/mock.ts`; pasa a ser real).
- `modules/categorization` — clasificador de movimientos.
- `modules/goals` — metas y sus contribuciones (hoy también mock).
- `modules/trust-score` — cálculo y exposición a partners.
- `modules/partners` — gestión de consentimientos y API para bancos.

Cada módulo nuevo agrega sus tablas a `runMigrations()` siguiendo el mismo patrón `CREATE TABLE IF NOT EXISTS` ya usado para `users`.

En el frontend, `Transactions.tsx`, `Forecast.tsx` y `Home.tsx` dejan de leer `mock.ts` y pasan a consumir los nuevos endpoints vía `lib/api.ts` (mismo patrón que ya usa `lib/auth-api.ts`). Se agrega una pantalla nueva de **"Vincular cuenta"** con el flujo de consentimiento del agregador.

&#91;embedded content: roadmap de 4 fases con 3 gates\]

La Fase 0 corre hoy sin depender de ningún banco real; cada fase siguiente se habilita solo si se cumple el gate que la precede.

## Riesgos y preguntas abiertas

- **No existe Open Finance maduro en Perú todavía** — no hay una API pública de Yape ni de los bancos para leer movimientos de terceros con consentimiento. Ningún agregador expone Yape. Entre los agregadores LatAm, Prometeo es el que anuncia conexión con bancos peruanos; Belvo y Fintoc tienen poca o ninguna cobertura en Perú. Antes de un piloto real hay que confirmar con Prometeo qué datos entrega de BCP.
- **¿BCP ya tiene o planea una API de Open Finance interna?** Si el hackathon es con BCP, vale la pena preguntar directo al equipo técnico del banco en vez de asumir un agregador externo. Mientras no haya respuesta, el PMV arranca con el simulador y luego pasa a Prometeo.
- **Responsabilidad legal si el Trust Score se usa para decisiones de crédito reales** — un score mal calculado que afecta el acceso a crédito de alguien es un riesgo serio; el piloto debería declararse explícitamente como señal de apoyo, no como decisión automática de crédito.
- **Costo de los agregadores** — suelen cobrar por cuenta conectada o por sincronización; el modelo de negocio con el banco aliado debería cubrir ese costo, no el usuario.
- **UX de confianza**: pedirle a un joven de 18-25 años que vincule su cuenta bancaria a una app de hackathon es un salto de confianza grande — probablemente necesita el respaldo visible de BCP (marca, no solo colores) para que el usuario acepte vincular cuentas reales.
