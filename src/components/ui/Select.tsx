import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

function Select({ options, value, onChange, placeholder, className = '', disabled }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(
    options?.find(opt => opt.value === value) || null
  );
  const ref = useRef<HTMLDivElement>(null);

  // Update selected when value prop changes
  useEffect(() => {
    const foundOption = options?.find(opt => opt.value === value);
    setSelected(foundOption || null);
  }, [value, options]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange(option.value);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        className={`
        bg-(--input-bg)
        border
        border-(--border)
        rounded-[10px]
        px-3
        pr-10
        py-2
        text-sm
        outline-none
        h-10
        appearance-none
        cursor-pointer
        flex items-center justify-between
        text-left
        relative
        w-full
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      >
        <span className="truncate">
          {selected ? selected.label : placeholder || 'Vælg...'}
        </span>
        <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-(--color-text-grey) transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-[10px] border border-(--border) bg-(--input-bg) max-h-60 overflow-y-auto">
          {options && options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-3 py-2 text-sm text-left
                  hover:bg-gray-100
                  focus:bg-gray-100
                  focus:outline-none
                  first:rounded-t-[10px]
                  last:rounded-b-[10px]
                  ${selected?.value === option.value ? 'bg-gray-200 font-medium' : ''}
                `}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">Ingen muligheder</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Select;