// Reusable Button component
export default function Button({ children, onClick, type = 'button', variant = 'primary', size = 'md', className = '', ...props }) {
  let base = 'rounded-full font-bold shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  let variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105',
    danger: 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:scale-105',
    success: 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:scale-105',
    outline: 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50',
  };
  let sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant] || ''} ${sizes[size] || ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
