import type { ReactNode } from "react";

export type SortOrder = "asc" | "desc";

export type SortState = {
  columnId: string;
  order: SortOrder;
};

export type MobileColumnRole = "leading" | "title" | "detail" | "actions";

export type ColumnDef<TData> = {
  id: string;
  header: string;
  accessor?: (row: TData) => ReactNode;
  cell?: (row: TData) => ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
  mobileRole?: MobileColumnRole;
  isRowHeader?: boolean;
};

export type RenderedTableCell = {
  id: string;
  header: string;
  content: ReactNode;
  className?: string;
  isRowHeader?: boolean;
  hideOnMobile?: boolean;
  mobileRole?: MobileColumnRole;
};

export type DataTableProps<TData> = {
  caption: string;
  columns: readonly ColumnDef<TData>[];
  data: readonly TData[];
  getRowId: (row: TData) => string | number;
  isLoading?: boolean;
  sort?: SortState;
  onSortChange?: (columnId: string) => void;
  emptyState?: ReactNode;
  skeletonRows?: number;
};

export type PaginationState = {
  page: number;
  pageCount: number;
  total: number;
};
