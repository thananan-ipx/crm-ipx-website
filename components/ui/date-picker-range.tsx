'use client'

import * as React from "react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

/* ======================
   Utils
====================== */

function toISO(date?: Date) {
    if (!date) return undefined
    return format(date, "yyyy-MM-dd")
}

function toThaiDisplay(date: Date) {
    const day = format(date, "dd/MM")
    const year = date.getFullYear() + 543
    return `${day}/${year}`
}

function parseISOToDate(value?: string) {
    if (!value) return undefined
    return new Date(value)
}

/* ======================
   Types
====================== */

export interface DateRangeValue {
    from?: string | null
    to?: string | null
}

interface DatePickerRangeTHProps {
    value?: DateRangeValue
    onChange?: (value: DateRangeValue | null) => void
    placeholder?: string
    className?: string
}

/* ======================
   Component
====================== */

export function DatePickerRangeTH({
    value,
    onChange,
    placeholder = "เลือกช่วงวันที่",
    className
}: DatePickerRangeTHProps) {

    const [open, setOpen] = React.useState(false)

    const selectedRange: DateRange | undefined = React.useMemo(() => {
        if (!value) return undefined

        return {
            from: parseISOToDate(value.from ?? undefined),
            to: parseISOToDate(value.to ?? undefined)
        }
    }, [value])

    

    const displayText = React.useMemo(() => {
        if (!selectedRange?.from) return placeholder

        if (selectedRange.from && !selectedRange.to) {
            return toThaiDisplay(selectedRange.from)
        }

        return `${toThaiDisplay(selectedRange.from)} - ${toThaiDisplay(selectedRange.to!)}`
    }, [selectedRange, placeholder])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-between font-normal",
                        !selectedRange?.from && "text-muted-foreground",
                        className
                    )}
                >
                    <span className="truncate">{displayText}</span>
                    <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-60" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    locale={th}
                    numberOfMonths={2}
                    selected={selectedRange}
                    defaultMonth={selectedRange?.from}
                    captionLayout="dropdown"
                    onSelect={(range) => {

                        if (!range?.from) {
                            onChange?.(null)
                            return
                        }

                        onChange?.({
                            from: toISO(range.from),
                            to: toISO(range.to)
                        })

                    }}
                />
            </PopoverContent>
        </Popover>
    )
}