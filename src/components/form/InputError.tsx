interface InputErrorProps {
  message?: string;
}

export function InputError({ message }: InputErrorProps) {
  if (!message) return null;

  return (
    <span className="text-xs text-red-500 font-medium mt-1 animate-in fade-in-50">
      {message}
    </span>
  );
}