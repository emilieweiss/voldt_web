import { Search } from 'lucide-react';
type SearchbarProps = React.InputHTMLAttributes<HTMLInputElement>;

function Searchbar({ className = '', ...props }: SearchbarProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        placeholder="Søg…"
        className={`
          bg-(--input-bg)
          border
          border-(--border)
          rounded-[10px]
          px-3
          py-2
          text-sm
          outline-none
          h-10
          w-full
          pr-10
        `}
        {...props}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Search size={18} />
      </span>
    </div>
  );
}

export default Searchbar;
