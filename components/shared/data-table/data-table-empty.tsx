import EmptyState from "@/components/shared/empty-state";

type DataTableEmptyProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function DataTableEmpty({
  title = "No records found",
  description = "There are no items to display right now.",
  actionLabel,
  onAction,
}: DataTableEmptyProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}
