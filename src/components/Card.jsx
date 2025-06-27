// Reusable Card component
export default function Card({ children, className = '', header, footer }) {
  return (
    <div className={`bg-white rounded-lg shadow-lg border border-blue-100 hover:shadow-blue-400/20 transition-all duration-200 ${className}`}>
      {header && <div className="mb-4 border-b border-blue-100 pb-3 font-bold text-lg text-blue-600">{header}</div>}
      <div>{children}</div>
      {footer && <div className="mt-4 border-t border-blue-100 pt-3">{footer}</div>}
    </div>
  );
} 