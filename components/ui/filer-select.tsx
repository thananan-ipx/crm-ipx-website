'use client'

import { DefaultOption } from "@/types/options-type"
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Filter } from "lucide-react"
import { cn } from "@/lib/utils"
type FilterSelectProps = {
    value?: string
    placeholder: string
    options: DefaultOption[]
    onChange: (value?: string) => void
    className?: string
    name: string
}

export function FilterSelect({
    value,
    placeholder,
    options,
    onChange,
    className,
    name = "เลือกข้อมูล"
}: FilterSelectProps) {
    return (
        <div className={cn("w-full sm:w-50", className)}>
            <Select
                value={value ?? "All"}
                onValueChange={(val) => onChange(val === "All" ? undefined : val)}
            >
                <SelectTrigger className="w-full max-h-[40px]! h-full!">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder={placeholder} />
                    </div>
                </SelectTrigger>

                <SelectContent
                    position="popper">
                    <SelectGroup>
                        <SelectLabel>{name}</SelectLabel>
                        {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}