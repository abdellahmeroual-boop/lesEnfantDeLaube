"use client";

// Formulaire qui demande confirmation avant d'envoyer (actions sensibles).
export default function ConfirmSubmit({
  action,
  message,
  children,
  hidden,
  className,
}: {
  action: (formData: FormData) => void;
  message: string;
  children: React.ReactNode;
  hidden: Record<string, string>;
  className?: string;
}) {
  return (
    <form
      action={action}
      className="inline"
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
