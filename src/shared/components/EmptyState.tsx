import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-low py-16 px-8 text-center">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container text-on-surface-variant">
          {icon}
        </div>
      )}
      <h3 className="type-title-lg text-on-surface">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm type-body-md text-on-surface-variant">
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-6 gradient-primary text-on-primary rounded-2xl px-6"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
