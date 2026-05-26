"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandInput,
    CommandEmpty,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { DefaultOption, SearchSelectProps } from "@/types/options-type"

function defaultGetValue(item: any): string {
    return item.value
}

function defaultGetLabel(item: any): string {
    return item.label
}

export function SearchSelect<T = DefaultOption>({
    options,
    value,
    onChange,
    getValue,
    getLabel,
    getSubLabel,
    placeholder = "Select option...",
    className,
    clearable = true,
    disabled = false, 
    disabledOption,
    hasMore,
    isLoadingMore,
    onLoadMore,
    onSearch
}: SearchSelectProps<T>) {
    const resolveValue = getValue ?? defaultGetValue
    const resolveLabel = getLabel ?? defaultGetLabel

    const [open, setOpen] = React.useState(false)

    const selectedItem = options.find(
        (o) => resolveValue(o) === value
    )

    return (
        <Popover
            open={disabled ? false : open}              // ✅ disabled = ห้ามเปิด
            onOpenChange={(v) => {
                if (!v) {
                    onSearch?.("")
                }

                if (!disabled) {
                    setOpen(v)
                }
            }}
            modal={false}
        >
            <PopoverTrigger asChild>
                <div
                    aria-expanded={open}
                    aria-disabled={disabled}                // ✅ a11y
                    tabIndex={disabled ? -1 : 0}
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-between h-10 px-3 py-2",
                        disabled
                            ? "cursor-not-allowed opacity-50 bg-muted"
                            : "cursor-pointer",
                        className
                    )}
                >
                    <span
                        className={cn(
                            "truncate block max-w-full",
                            !selectedItem && "text-muted-foreground"
                        )}
                    >
                        {selectedItem
                            ? resolveLabel(selectedItem)
                            : placeholder}
                    </span>

                    <div className="flex items-center gap-1">
                        {clearable && value && !disabled && (   // ✅ disabled = ห้าม clear
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onChange(undefined)
                                }}
                            >
                                <X className="h-4 w-4 opacity-50 hover:opacity-100" />
                            </button>
                        )}
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </div>
                </div>
            </PopoverTrigger>

            {!disabled && (                              // ✅ disabled = ไม่ render list
                <PopoverContent className="w-[max(400px,var(--radix-popover-trigger-width))] p-0">
                    <Command>
                        <CommandInput
                            onValueChange={onSearch}
                            placeholder="Search..." />
                        <CommandList
                        >
                            <CommandEmpty>No item found.</CommandEmpty>

                            <CommandGroup
                                onWheel={(e) => e.stopPropagation()}
                                className="max-h-64 overflow-auto"
                                onScroll={(e) => {
                                    const el = e.currentTarget
                                    const isBottom =
                                        el.scrollHeight - el.scrollTop <= el.clientHeight + 10

                                    if (isBottom && hasMore && !isLoadingMore) {
                                        onLoadMore?.()
                                    }
                                }}
                            >
                                {options.map((item) => {
                                    const itemValue = resolveValue(item)
                                    const itemLabel = resolveLabel(item)
                                    const isDisabled = disabledOption?.(item) ?? false

                                    return (
                                        <CommandItem
                                            key={itemValue}
                                            value={String(itemValue)}
                                            keywords={[
                                                itemLabel,
                                                getSubLabel?.(item) ?? ""
                                            ]}
                                            onSelect={() => {
                                                onChange(itemValue, itemLabel)
                                                setOpen(false)
                                            }}
                                            disabled={isDisabled}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    itemValue === value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{resolveLabel(item)}</span>
                                                {getSubLabel?.(item) && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {getSubLabel(item)}
                                                    </span>
                                                )}
                                            </div>
                                        </CommandItem>
                                    )
                                })}
                                {isLoadingMore && (
                                    <div className="flex h-full items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                    </div>
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            )}
        </Popover>
    )
}
