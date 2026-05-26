"use client"

import * as React from "react"
import { format } from "date-fns"
import { th } from "date-fns/locale"

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

// แปลง Date → string ค.ศ.
function toISO(date: Date) {
    return format(date, "yyyy-MM-dd")
}

// แปลง Date → display พ.ศ.
function toThaiDisplay(date: Date) {
    const day = format(date, "dd/MM")
    const year = date.getFullYear() + 543
    return `${day}/${year}`
}

// แปลง string ค.ศ. → Date
function parseISOToDate(value?: string) {
    if (!value) return undefined
    return new Date(value)
}

/* ======================
   Types
====================== */

interface DatePickerTHProps {
    value?: string | null
    onChange?: (value: string | null) => void
    placeholder?: string
    className?: string
    disabled?: boolean
}

/* ======================
   Component
====================== */

export function DatePickerTH({
    value,
    onChange,
    placeholder = "เลือกวันที่",
    className,
    disabled
}: DatePickerTHProps) {

    const [open, setOpen] = React.useState(false)

    const selectedDate = React.useMemo(
        () => parseISOToDate(value ?? undefined),
        [value]
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline"
                    className={cn(
                        "w-full justify-between font-normal",
                        !selectedDate && "text-muted-foreground",
                        className
                    )}
                >
                    <span className="truncate">
                        {selectedDate
                            ? toThaiDisplay(selectedDate)
                            : placeholder}
                    </span>

                    <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-60" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    locale={th}
                    disabled={{ before: new Date() }}
                    selected={selectedDate}
                    defaultMonth={selectedDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                        if (!date) {
                            onChange?.(null)
                        } else {
                            onChange?.(toISO(date))
                        }
                        setOpen(false)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
