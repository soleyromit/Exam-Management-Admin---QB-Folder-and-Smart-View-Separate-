/**
 * DataTable Types
 * Type definitions for the DataTable component
 */

export type ColumnAlignment = 'left' | 'center' | 'right';

export type ColumnMenuAction =
'pin-left' |
'pin-right' |
'sort-asc' |
'sort-desc' |
'wrap-text' |
'filter' |
'group' |
'conditional-rule';

export interface Column<T = any> {
  id: string;
  label: string;
  accessor: keyof T | ((row: T) => any);
  width?: string;
  minWidth?: string;
  align?: ColumnAlignment;
  sortable?: boolean;
  sticky?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onColumnReorder?: (fromIndex: number, toIndex: number) => void;
  onColumnResize?: (columnId: string, newWidth: number) => void;
  onColumnMenuAction?: (columnId: string, action: ColumnMenuAction) => void;
  className?: string;
  'data-id'?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export type StatusType =
'completed' |
'pending' |
'review' |
'rejected' |
'confirmed';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}