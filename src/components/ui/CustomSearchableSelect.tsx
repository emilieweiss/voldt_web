import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type Option = {
  label: string;
  value: string;
};

type CustomSearchableSelectProps = {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export default function CustomSearchableSelect({ options, placeholder, onChange }: CustomSearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Option | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
        bg-(--input-bg)
        border
        border-(--border)
        rounded-[10px]
        px-3
        pr-8
        py-2
        text-sm
        outline-none
        h-10
        appearance-none
        w-full
        cursor-pointer
        flex items-center justify-between
      `}
      >
        <span className="truncate text-left">{selected ? selected.label : placeholder || 'Vælg...'}</span>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-(--color-text-grey)">
          <ChevronDown />
        </span>
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-[10px] border border-(--border) bg-(--input-bg) text-black">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søg..."
            className="w-full border-b border-(--border) px-3 py-2 text-sm outline-none bg-(--input-bg) rounded-t-[10px]"
          />

          <ul className="max-h-60 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => {
                    setSelected(opt);
                    onChange(opt.value);
                    setOpen(false);
                    setSearch('');
                  }}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500">Ingen resultater</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
};
