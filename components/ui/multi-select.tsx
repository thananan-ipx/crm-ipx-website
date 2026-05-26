"use client"

import * as React from "react"
import { X, Check, ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type Option<T> = {
  label: string
  value: T
  email?: string
}

interface MultiSelectProps<T> {
  options: Option<T>[]
  selected: T[]
  onChange: (selected: T[]) => void
  placeholder?: string
  className?: string

  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
  onSearch?: (keyword: string) => void
  disabled?: boolean
}

export function MultiSelect<T>(props: MultiSelectProps<T>) {
  const {
    options,
    selected,
    onChange,
    placeholder = "Select options...",
    className,
    hasMore,
    isLoadingMore,
    onLoadMore,
    onSearch,
    disabled
  } = props

  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: T) => {
    onChange(selected.filter((i) => i !== item))
  }

  const toggleSelect = (value: T) => {
    onChange(
      selected.includes(value)
        ? selected.filter(i => i !== value)
        : [...selected, value]
    )
  }

  return (
    <Popover open={disabled ? false : open}
      onOpenChange={(v) => {
        if (!v) {
          onSearch?.("")
        }

        if (!disabled) {
          setOpen(v)
        }
      }}>
      <PopoverTrigger asChild>
        <div
          aria-expanded={open}
          aria-disabled={disabled}
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
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((itemValue) => {
                const item = options.find((Option) => Option.value === itemValue)
                return (
                  <Badge
                    key={String(itemValue)}
                    variant="secondary"
                    className="mr-1 mb-1"
                  >
                    {item?.label}
                    <button
                      disabled={!disabled}
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(itemValue)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleUnselect(itemValue)
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                )
              })
            ) : (
              <span className="text-muted-foreground font-normal">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-[max(400px,var(--radix-popover-trigger-width))] p-0">
          <Command>
            <CommandInput
              placeholder="Search..."
              onValueChange={onSearch} />
            <CommandList>
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup
                onScroll={(e) => {
                  const el = e.currentTarget
                  const isBottom =
                    el.scrollHeight - el.scrollTop <= el.clientHeight + 10

                  if (isBottom && hasMore && !isLoadingMore) {
                    onLoadMore?.()
                  }
                }}
                onWheel={(e) => e.stopPropagation()}
                className="max-h-64 overflow-auto">
                {options.map((option) => (
                  <CommandItem
                    key={String(option.value)}
                    value={String(option.value)}
                    onSelect={() => toggleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {option.email && (
                        <span className="text-xs text-muted-foreground">
                          {option.email}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
                {isLoadingMore && (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin h-4 w-4 border-b-2 border-primary rounded-full" />
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