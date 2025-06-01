type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

function Label({ className = '', ...props }: LabelProps) {
  return (
    <label
      className={`block mb-2 font-semibold text-base ${className}`}
      {...props}
    />
  );
}

export default Label;
