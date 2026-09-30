"use client";

export function DeleteButton({
  action,
  label = "Excluir",
  confirmMessage = "Excluir este item?",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(confirmMessage)) event.preventDefault();
      }}
    >
      <button type="submit" className="text-sm text-craft-ember">
        {label}
      </button>
    </form>
  );
}
