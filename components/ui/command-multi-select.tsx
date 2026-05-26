import { Check, Loader2 } from "lucide-react"
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

type Option = {
    label: string
    value: string
    description?: string
}

interface MultiCommandSelectProps {
    heading?: string
    options: Option[]
    value: string[]
    onChange: (value: string[]) => void

    searchValue?: string
    onSearchChange?: (value: string) => void
    searchPlaceholder?: string

    hasNextPage?: boolean
    isFetchingNextPage?: boolean
    isLoading?: boolean
    onLoadMore?: () => void
}

export function MultiCommandSelect({
    heading,
    options,
    value,
    onChange,

    searchValue = "",
    onSearchChange,
    searchPlaceholder = "ค้นหา...",

    hasNextPage,
    isFetchingNextPage,
    isLoading,
    onLoadMore,
}: MultiCommandSelectProps) {
    const handleSelect = (itemValue: string) => {
        const isSelected = value.includes(itemValue)

        if (isSelected) {
            onChange(value.filter((v) => v !== itemValue))
            return
        }

        onChange([...value, itemValue])
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget

        const isBottom =
            target.scrollTop + target.clientHeight >= target.scrollHeight - 20

        if (isBottom && hasNextPage && !isFetchingNextPage) {
            onLoadMore?.()
        }
    }

    return (
        <Command className="p-0 border" shouldFilter={false}>
            <div className="border-b p-2">
                <CommandInput
                    value={searchValue}
                    onValueChange={onSearchChange}
                    placeholder={searchPlaceholder}
                    className="h-9 w-full"
                />
            </div>

            <CommandList
                onScroll={handleScroll}
                className="max-h-45 overflow-y-auto"
            >
                <CommandGroup heading={heading} className="p-0">
                    {isLoading && options.length === 0 && (
                        <div className="flex h-9 items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    )}

                    {!isLoading && options.length === 0 && (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                            ไม่พบข้อมูล
                        </div>
                    )}

                    {options.map((item) => {
                        const isSelected = value.includes(item.value)

                        return (
                            <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={() => handleSelect(item.value)}
                                className="min-h-9 px-3"
                            >
                                <div className="flex w-full items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="truncate">
                                            {item.label}
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <Check className="h-4 w-4 shrink-0" />
                                    )}
                                </div>
                            </CommandItem>
                        )
                    })}

                    {isFetchingNextPage && (
                        <div className="flex h-9 items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    )}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}