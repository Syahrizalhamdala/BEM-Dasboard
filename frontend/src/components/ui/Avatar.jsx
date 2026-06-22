const bgPalette = [
  'bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600',
  'bg-rose-600', 'bg-cyan-600', 'bg-orange-600', 'bg-teal-600',
];

function hashColor(name) {
  if (!name) return 0;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % bgPalette.length;
}

export default function Avatar({ name, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-14 h-14 text-base',
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const colorClass = bgPalette[hashColor(name)];

  return (
    <div className={`rounded-lg ${colorClass} flex items-center justify-center text-white font-medium shrink-0 ${sizes[size]} ${className}`} title={name}>
      {initials}
    </div>
  );
}
