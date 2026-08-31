// Shared Tailwind primitives for the admin dashboard.
// Keeps spacing, radii and colours consistent across the admin screens.

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const BUTTON_VARIANTS = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-800 disabled:hover:bg-zinc-900 focus-visible:outline-zinc-900",
  secondary:
    "bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50 focus-visible:outline-zinc-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600 focus-visible:outline-red-600",
  ghost:
    "bg-transparent text-zinc-600 hover:bg-zinc-100 focus-visible:outline-zinc-400",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition
        focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function Spinner({ className = "h-5 w-5" }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

const BADGE_TONES = {
  neutral: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
};

export function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${BADGE_TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Full-panel error with a retry affordance, so a failed fetch is never a blank screen. */
export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-xl">
        !
      </div>
      <p className="text-sm font-semibold text-red-900">Something went wrong</p>
      <p className="mt-1 max-w-md text-sm break-words text-red-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-14 text-center">
      <p className="text-sm font-semibold text-zinc-700">{title}</p>
      {subtitle && <p className="mt-1 max-w-sm text-sm text-zinc-500">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-zinc-200 ${className}`} />;
}

export function StatCard({ label, value, hint, loading, tone = "neutral" }) {
  const accent = {
    neutral: "text-zinc-900",
    success: "text-emerald-600",
    danger: "text-red-600",
    warning: "text-amber-600",
  }[tone];

  return (
    <Card className="p-5">
      <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
        {label}
      </p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-16" />
      ) : (
        <p className={`mt-1.5 text-3xl font-semibold tabular-nums ${accent}`}>
          {value}
        </p>
      )}
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </Card>
  );
}
