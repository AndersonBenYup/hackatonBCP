/*
 * Ilustraciones propias, en el mismo lenguaje visual que BrandChevrons:
 * formas planas, paleta de marca, nada de fotos de stock ni capturas de
 * otros productos. Cada una es una escena pequeña (2-4 capas), pensada para
 * reemplazar bloques de puro texto/icono por algo con más carácter.
 */

interface Props {
  className?: string
}

/** Alcancía con moneda cayendo: metas de ahorro. */
export function SavingsIllustration({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="142" rx="64" ry="10" fill="var(--color-brand-100)" opacity="0.6" />
      <circle cx="152" cy="34" r="20" fill="var(--color-accent-100)" />
      <circle cx="30" cy="112" r="14" fill="var(--color-cat-teal-tint)" />
      <path
        d="M52 108c0-26 22-46 50-46s50 20 50 46-14 30-14 30H66s-14-4-14-30Z"
        fill="var(--color-brand-200)"
      />
      <path d="M100 62c6-10 18-16 30-14-4 10-14 18-26 18" fill="var(--color-brand-300)" />
      <circle cx="128" cy="72" r="5" fill="var(--color-brand-900)" />
      <rect x="94" y="118" width="14" height="18" rx="4" fill="var(--color-brand-300)" />
      <rect x="120" y="118" width="14" height="18" rx="4" fill="var(--color-brand-300)" />
      <rect x="88" y="90" width="26" height="8" rx="4" fill="var(--color-brand-100)" />
      <g>
        <circle cx="146" cy="64" r="11" fill="var(--color-accent-500)" />
        <text x="146" y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">
          S/
        </text>
      </g>
      <circle cx="166" cy="92" r="4" fill="var(--color-accent-300)" />
      <circle cx="44" cy="40" r="5" fill="var(--color-cat-teal-ink)" opacity="0.4" />
    </svg>
  )
}

/** Celular conectándose a un banco vía señal: vínculo bancario / agregador. */
export function BankLinkIllustration({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="146" rx="70" ry="8" fill="var(--color-brand-100)" opacity="0.5" />
      {/* Edificio del banco */}
      <rect x="18" y="56" width="70" height="72" rx="6" fill="var(--color-brand-200)" />
      <path d="M18 56 L53 30 L88 56Z" fill="var(--color-brand-300)" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={30 + i * 18} y={72} width="10" height="44" rx="2" fill="var(--color-brand-50)" />
      ))}
      {/* Ondas de conexion */}
      <path d="M100 70a26 26 0 0 1 0 36" stroke="var(--color-accent-400)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M108 60a42 42 0 0 1 0 56" stroke="var(--color-accent-300)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Celular */}
      <rect x="120" y="42" width="54" height="94" rx="12" fill="var(--color-brand-900)" />
      <rect x="127" y="52" width="40" height="66" rx="4" fill="var(--color-cat-blue-tint)" />
      <circle cx="147" cy="126" r="4" fill="var(--color-brand-50)" />
      <circle cx="147" cy="78" r="12" fill="var(--color-success-500)" />
      <path d="M142 78l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="132" y="98" width="30" height="6" rx="3" fill="var(--color-brand-200)" />
      <rect x="132" y="108" width="20" height="6" rx="3" fill="var(--color-brand-200)" />
      <circle cx="177" cy="36" r="5" fill="var(--color-accent-300)" />
    </svg>
  )
}

/** Burbuja de chat con destello: asistente de IA. */
export function ChatAIIllustration({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="146" rx="70" ry="8" fill="var(--color-brand-100)" opacity="0.5" />
      <rect x="30" y="34" width="112" height="76" rx="22" fill="var(--color-brand-700)" />
      <path d="M58 110l-10 20 26-14Z" fill="var(--color-brand-700)" />
      <circle cx="64" cy="70" r="7" fill="var(--color-brand-50)" />
      <circle cx="86" cy="70" r="7" fill="var(--color-brand-50)" />
      <circle cx="108" cy="70" r="7" fill="var(--color-accent-400)" />
      <g transform="translate(140,30)">
        <path
          d="M18 0l4.6 11.4L34 16l-11.4 4.6L18 32l-4.6-11.4L2 16l11.4-4.6Z"
          fill="var(--color-accent-400)"
        />
      </g>
      <circle cx="40" cy="128" r="5" fill="var(--color-cat-teal-tint)" />
      <circle cx="162" cy="100" r="6" fill="var(--color-cat-coral-tint)" />
    </svg>
  )
}

/** Trofeo con confeti: retos y racha. */
export function TrophyIllustration({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="146" rx="66" ry="8" fill="var(--color-accent-100)" opacity="0.5" />
      <rect x="82" y="112" width="36" height="14" rx="3" fill="var(--color-brand-300)" />
      <rect x="92" y="98" width="16" height="18" fill="var(--color-brand-200)" />
      <path
        d="M66 50h68v20c0 20-15 36-34 36s-34-16-34-36Z"
        fill="var(--color-accent-500)"
      />
      <path d="M66 54c-14 0-22 10-18 22s16 14 24 10" fill="none" stroke="var(--color-accent-500)" strokeWidth="6" strokeLinecap="round" />
      <path d="M134 54c14 0 22 10 18 22s-16 14-24 10" fill="none" stroke="var(--color-accent-500)" strokeWidth="6" strokeLinecap="round" />
      <path
        d="M100 58l4.5 9.3 10.2 1.5-7.4 7.2 1.8 10.2L100 81.4l-9.1 4.8 1.8-10.2-7.4-7.2 10.2-1.5Z"
        fill="var(--color-accent-50)"
      />
      <g fill="var(--color-brand-500)">
        <rect x="38" y="36" width="8" height="8" rx="2" transform="rotate(18 42 40)" />
        <rect x="150" y="76" width="7" height="7" rx="2" transform="rotate(-12 153 79)" />
      </g>
      <circle cx="152" cy="44" r="5" fill="var(--color-cat-teal-ink)" opacity="0.6" />
      <circle cx="44" cy="90" r="4" fill="var(--color-brand-300)" />
    </svg>
  )
}

/** Caja/billetera vacía con líneas punteadas: estados vacíos. */
export function EmptyStateIllustration({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden>
      <ellipse cx="80" cy="104" rx="46" ry="7" fill="var(--color-rule)" />
      <rect x="34" y="42" width="92" height="52" rx="12" fill="var(--color-cat-blue-tint)" />
      <rect x="34" y="42" width="92" height="22" rx="12" fill="var(--color-brand-200)" />
      <circle cx="80" cy="64" r="8" fill="var(--color-brand-50)" />
      <path
        d="M50 34c6-10 18-16 30-16s24 6 30 16"
        stroke="var(--color-brand-300)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="2 10"
      />
      <circle cx="40" cy="24" r="3" fill="var(--color-accent-300)" />
      <circle cx="122" cy="28" r="4" fill="var(--color-cat-teal-tint)" />
    </svg>
  )
}

/** Barras crecientes con flecha: progreso/crecimiento. */
export function GrowthIllustration({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="146" rx="70" ry="8" fill="var(--color-brand-100)" opacity="0.5" />
      <rect x="40" y="96" width="24" height="38" rx="6" fill="var(--color-cat-blue-tint)" />
      <rect x="78" y="76" width="24" height="58" rx="6" fill="var(--color-brand-200)" />
      <rect x="116" y="52" width="24" height="82" rx="6" fill="var(--color-brand-400)" />
      <path
        d="M50 90 L90 68 L128 48 L150 32"
        stroke="var(--color-accent-500)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M136 30h16v16Z" fill="var(--color-accent-500)" transform="translate(-2,0) rotate(-8 150 32)" />
      <circle cx="50" cy="90" r="5" fill="var(--color-accent-600)" />
      <circle cx="166" cy="56" r="5" fill="var(--color-cat-teal-ink)" opacity="0.5" />
    </svg>
  )
}
