type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive';
};

function Button({
  children,
  className = '',
  variant = 'default',
  type = 'button',
  ...props
}: ButtonProps) {
  const base =
    'font-bold text-sm text-center py-2 px-4 rounded-xl transition-colors duration-200';
  const variants = {
    default:
      'bg-(--color-wolt-blue) hover:bg-(--color-wolt-medium-blue) text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    destructive: 'bg-red-700 hover:bg-red-600 text-white',
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
      style={{
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export default Button;
