'use client'

import { PaginationApiResponseType } from "@/types/pagination-type"
import { SearchType } from "@/types/search-type"
import { DataPagination } from "../shared/data-pagination"


export interface Column<T> {
    header: string
    className?: string
    render: (row: T, index: number) => React.ReactNode
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    emptyMessage?: string
    pagination: PaginationApiResponseType
    search: SearchType
    onSearchChange: (next: SearchType) => void
}
export default function TablePagination<T>({
    columns,
    data,
    emptyMessage = "ไม่พบข้อมูล",
    pagination,
    search,
    onSearchChange,
}: DataTableProps<T>) {
    const startIndex = (search.page - 1) * search.limit
    const endIndex = Math.min(startIndex + search.limit, pagination.total)
    return (
        <>
            <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="[&_tr]:border-b bg-muted/40">
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`h-12 px-4 font-medium text-muted-foreground ${col.className}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="border-b hover:bg-muted/50 transition-colors"
                                >
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className={`p-4 align-middle ${col.className}`}>
                                            {col.render(row, rowIndex)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="p-8 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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