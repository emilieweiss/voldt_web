import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`
      bg-(--input-bg)
      border
      border-(--border)
      rounded-[10px]
      px-3
      py-2
      text-base
      outline-none
      h-10
      ${className}
    `}
    {...props}
  />
);

export default Input;
