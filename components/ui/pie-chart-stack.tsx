"use client"

import { Pie, PieChart } from "recharts"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { PriorityDashboard } from "@/types/dashboard/dashboard-response-type"


export interface StatusDashBoardType {
    status: string
    case: {
        caseId: number
    }[]
}

interface Props {
    priority?: PriorityDashboard
    status?: StatusDashBoardType[]
    size?: number
}

const STATUS_COLOR: Record<string, string> = {
    Done: "#00C950",
    "Waiting Document": "#60A5FA",
    "Waiting Customer": "#FACC15",
    "In Progress": "#FB923C",
    Closed: "#9CA3AF",
}


const chartConfig = {
    Hard: { label: "ยาก", color: "#ef4444" },
    Normal: { label: "ปกติ", color: "#f59e0b" },
    Easy: { label: "ง่าย", color: "#00C950" },

    Done: { label: "เสร็จแล้ว", color: "#22c55e" },
    "Waiting Document": { label: "รอเอกสาร", color: "#60A5FA" },
    "Waiting Customer": { label: "รอลูกค้า", color: "#FACC15" },
    "In Progress": { label: "กำลังดำเนินการ", color: "#FB923C" },
    Closed: { label: "ปิดเคส", color: "#9CA3AF" },
} satisfies ChartConfig

const mapPriority = (priority?: PriorityDashboard) => {
    if (!priority) return []

    return [
        { type: "Hard", value: priority.hard ?? 0, fill: "#ef4444" },
        { type: "Normal", value: priority.normal ?? 0, fill: "#f59e0b" },
        { type: "Easy", value: priority.easy ?? 0, fill: "#4CAF50" },
    ]
}

const mapStatus = (statusArr?: StatusDashBoardType[]) => {
    if (!statusArr) return []

    return statusArr.map((s) => ({
        type: s.status,
        value: s.case?.length ?? 0,
        fill: STATUS_COLOR[s.status] ?? "#ccc",
    }))
}

const normalize = (data: { type: string; value: number; fill: string }[]) => {
    const total = data.reduce((sum, d) => sum + d.value, 0)
    if (total === 0) return data
    return data.map((d) => ({
        ...d,
        value: (d.value / total) * 100
    }))
}

export function ChartPieStacked({ priority, status, size = 100 }: Props) {
    const priorityData = normalize(mapPriority(priority))
    const statusData = normalize(mapStatus(status))

    const hasData =
        [...priorityData, ...statusData].some((d) => d.value > 0)

    if (!hasData) {
        return (
            <div className="text-center text-muted-foreground py-10">
                ไม่มีข้อมูล
            </div>
        )
    }


    return (
        <>
            <div style={{ width: size, height: size }}>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-62.5"
                >
                    <PieChart width={size} height={size}>
                        <ChartTooltip
                            wrapperStyle={{
                                transform: "translate(-50%, -50%)",
                            }}
                            content={
                                <ChartTooltipContent
                                    nameKey="type"
                                    labelKey="value"
                                    indicator="line"
                                    formatter={(value, name) => {
                                        console.log(value)
                                        const key = name as keyof typeof chartConfig
                                        console.log(chartConfig[key])
                                        return <>
                                            <div
                                                className="shrink-0 rounded-[2px] w-1"
                                                style={{
                                                    backgroundColor: chartConfig[key].color,
                                                    borderColor: chartConfig[key].color,
                                                }}
                                            />
                                            <div className="flex flex-1 justify-between leading-none items-end">
                                                <div className="grid gap-1.5">
                                                    <div className="font-medium truncate">{chartConfig[key].label}</div>
                                                    <span className="text-muted-foreground truncate">{chartConfig[key].label}</span>
                                                </div>
                                                <span className="font-mono font-medium text-foreground tabular-nums">{Number(value).toFixed(1)}%</span>
                                            </div>
                                        </>
                                    }}
                                    labelFormatter={(_, payload) => {
                                        const key = payload?.[0]?.name as keyof typeof chartConfig
                                        return chartConfig[key]?.label ?? key
                                    }}
                                />
                            }
                        />

                        <Pie
                            data={priorityData}
                            dataKey="value"
                            nameKey="type"
                            innerRadius={0}
                            outerRadius={size * 0.28}
                            stroke="none"
                        />

                        <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="type"
                            innerRadius={size * 0.35}
                            outerRadius={size * 0.45}
                        />
                    </PieChart>
                </ChartContainer>
            </div>
        </>
    )
}