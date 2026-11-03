/** Eco sutil del chevron del isotipo BCP, como marca de agua decorativa. */
export default function BrandChevrons({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 160 160"
      className={className}
      fill="none"
      stroke="white"
      strokeWidth="14"
      strokeLinecap="round"
    >
      <path d="M38 30 L82 80 L38 130" opacity="0.14" />
      <path d="M78 30 L122 80 L78 130" opacity="0.22" />
    </svg>
  )
}
