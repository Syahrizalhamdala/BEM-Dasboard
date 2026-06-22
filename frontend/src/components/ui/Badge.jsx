const variantStyles = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/50',
  danger: 'bg-red-50 text-red-700 border-red-200/50',
  info: 'bg-burgundy/10 text-burgundy border-burgundy/20',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200/50',
};

export default function Badge({ children, variant = 'neutral', dot = false, className = '' }) {
  const v = variantStyles[variant] || variantStyles.neutral;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${v} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />}
      {children}
    </span>
  );
}
