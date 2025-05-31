type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`
        bg-(--input-bg)
        border
        border-(--border)
        rounded-[10px]
        px-3
        py-2
        text-base
        outline-none
        h-28
        resize-none
        ${className}
      `}
      {...props}
    />
  );
}

export default Textarea;
