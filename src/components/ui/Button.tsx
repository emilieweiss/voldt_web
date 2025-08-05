type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'round' | 'destructiveRound';
};

function Button({
  children,
  className = '',
  variant = 'default',
  type = 'button',
  ...props
}: ButtonProps) {
  const base =
    'font-bold text-sm text-center transition-colors duration-200 p-2';
  const variants = {
    default:
      'bg-(--color-wolt-blue) hover:bg-(--color-wolt-medium-blue) text-white rounded-xl',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl',
    destructive: 'bg-red-700 hover:bg-red-600 text-white rounded-xl',
    round: 'bg-(--color-wolt-blue) hover:bg-(--color-wolt-medium-blue) text-white rounded-full',
    destructiveRound: 'bg-red-700/40 hover:bg-red-700/80 text-white rounded-full'
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
