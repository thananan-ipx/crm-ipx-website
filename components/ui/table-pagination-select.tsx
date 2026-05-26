'use client'
import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SearchType } from "@/types/search-type"
import { DataPagination } from "../shared/data-pagination"
import { PaginationApiResponseType } from "@/types/pagination-type"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onSortingChange?: (sorting: SortingState) => void
    pagination: PaginationApiResponseType
    search: SearchType
    onSearchChange: (next: SearchType) => void
    onRowSelectChange?: (rows: TData[]) => void
    clearSelectionKey?: number
    wrapperClassName?: string
    tableClassName?: string
    enforceColumnWidth?: boolean
}

export default function TablePaginationSelect<TData, TValue>({
    columns,
    data,
    onSortingChange,
    pagination,
    search,
    onSearchChange,
    onRowSelectChange,
    clearSelectionKey,
    wrapperClassName,
    tableClassName,
    enforceColumnWidth = false
}: DataTableProps<TData, TValue>) {
    const startIndex = (search.page - 1) * search.limit
    const endIndex = Math.min(startIndex + search.limit, pagination.total)
    const tableWidth = columns.reduce((total, column) => total + (column.size ?? 150), 0)

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const onRowSelectChangeRef = React.useRef(onRowSelectChange)

    React.useEffect(() => {
        onRowSelectChangeRef.current = onRowSelectChange
    }, [onRowSelectChange])

    const table = useReactTable({
        data,
        columns,
        pageCount: pagination.total_pages,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: (updater) => {
            const newSorting =
                typeof updater === "function" ? updater(sorting) : updater
            setSorting(newSorting)
            onSortingChange?.(newSorting)
        },
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        }
    })

    React.useEffect(() => {
        setRowSelection({})
    }, [clearSelectionKey])

    React.useEffect(() => {
        const selected = table.getSelectedRowModel().rows.map(r => r.original)
        onRowSelectChangeRef.current?.(selected)
        // table is intentionally omitted because the TanStack table instance is recreated across renders.
        // Row selection is the actual event source we need to publish upward.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection])

    React.useEffect(() => {
        onRowSelectChangeRef.current?.([])
        setRowSelection({})
    }, [search])
    return (
        <>
            <div className={`w-full rounded-md border overflow-auto ${wrapperClassName ?? ""}`}>

                <Table
                    className={`${enforceColumnWidth ? "table-fixed" : "min-w-max"} text-sm text-left ${tableClassName ?? ""}`}
                    style={enforceColumnWidth ? { width: "100%", minWidth: tableWidth } : undefined}
                >
                    <TableHeader className="[&_tr]:border-b bg-muted/40">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            style={{
                                                width: header.column.getSize(),
                                                minWidth: enforceColumnWidth ? header.column.getSize() : undefined,
                                            }}
                                            className="h-12 px-4 font-medium text-muted-foreground"
                                            key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="border-b hover:bg-muted/50 transition-colors"
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            className={`${enforceColumnWidth ? "overflow-hidden" : ""} p-4 align-middle`}
                                            style={{
                                                width: cell.column.getSize(),
                                                minWidth: enforceColumnWidth ? cell.column.getSize() : undefined,
                                            }}
                                            key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataPagination
                currentPage={search.page}
                totalPages={pagination.total_pages}
                itemsPerPage={search.limit}
                totalItems={pagination.total}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={(page) =>
                    onSearchChange({
                        ...search,
                        page,
                    })
                }
                onPageSizeChange={(s) =>
                    onSearchChange({
                        ...search,
                        page: 1,
                        limit: Number(s),
                    })
                }
            />
        </>
    )
}
