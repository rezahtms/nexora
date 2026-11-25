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
  cell: (row: TData) => ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
  mobileRole?: MobileColumnRole;
  isRowHeader?: boolean;
};

export type PaginatedData<TData> = {
  items: TData[];
  total: number;
};

export type DataTableProps<TData> = {
  caption: string;
  columns: readonly ColumnDef<TData>[];
  data: PaginatedData<TData> | undefined;
  getRowId: (row: TData) => string | number;
  isLoading?: boolean;
  isFetching?: boolean;
  pageSize: number;
  sortColumnId: string;
  defaultOrder?: SortOrder;
  emptyState?: ReactNode;
  skeletonRows?: number;
};
