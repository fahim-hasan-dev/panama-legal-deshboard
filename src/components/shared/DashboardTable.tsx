import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DashboardTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyText?: string;
}

export function DashboardTable<T extends { _id?: string; id?: string }>({
  data,
  columns,
  loading = false,
  emptyText = "No records found.",
}: DashboardTableProps<T>) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 border-b border-slate-200">
            {columns.map((col, index) => (
              <TableHead
                key={index}
                className="py-3.5 px-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wider"
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500 text-sm">
                Loading records...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500 text-sm">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, rowIdx) => (
              <TableRow key={item._id || item.id || rowIdx} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                {columns.map((col, colIdx) => (
                  <TableCell key={colIdx} className="py-3.5 px-4 text-sm text-slate-800 font-medium">
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? "")
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
