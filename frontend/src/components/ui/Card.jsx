export default function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/70 ${
        padding ? 'p-4' : ''
      } ${
        hover ? 'hover:border-slate-300 transition-colors duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
