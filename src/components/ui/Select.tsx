import { ChevronDown } from 'lucide-react';
import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

function Select({ className = '', children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={`
          bg-(--input-bg)
          border
          border-(--border)
          rounded-[10px]
          px-3
          pr-8
          py-2
          text-base
          outline-none
          h-10
          appearance-none
          w-full
          cursor-pointer
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-(--color-text-grey)">
        <ChevronDown />
      </span>
    </div>
  );
}

export default Select;
