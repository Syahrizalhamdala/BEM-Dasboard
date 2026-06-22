export default function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-7 w-2/3',
    avatar: 'h-10 w-10 rounded-lg',
    card: 'h-32 w-full rounded-xl',
    chart: 'h-72 w-full rounded-xl',
    badge: 'h-6 w-16 rounded-md',
    stat: 'h-28 w-full rounded-xl',
    table: 'h-10 w-full rounded-lg',
  };

  return <div className={`skeleton-shimmer rounded-lg ${variants[variant] || variants.text} ${className}`} />;
}
