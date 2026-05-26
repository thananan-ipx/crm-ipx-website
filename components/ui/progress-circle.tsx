'use client'

interface Props {
    value: number
    size?: number
    strokeWidth?: number
}

export default function ProgressCircle({
    value,
    size = 72,
    strokeWidth = 8
}: Props) {
    const clamped = Math.max(0, Math.min(100, value))
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (clamped / 100) * circumference

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#2A9D90"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>

            <div className="absolute text-sm font-semibold text-foreground">
                {clamped}%
            </div>
        </div>
    )
}