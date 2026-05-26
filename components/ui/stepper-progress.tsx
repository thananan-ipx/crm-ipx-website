"use client"

import { memo, useMemo } from "react"

type StepperProgressProps = {
    totalSteps: number
    currentStep: number
    titles: string[]
    title: string
}

function StepperProgressComponent({
    totalSteps,
    currentStep,
    titles,
    title
}: StepperProgressProps) {
    const progress = useMemo(() => {
        return totalSteps <= 1 ? 1 : (currentStep + 1) / totalSteps
    }, [currentStep, totalSteps])

    return (
        <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{title ? title : "Stepper Form"}</h2>
                <span className="text-sm text-muted-foreground">
                    {currentStep + 1} / {totalSteps}
                </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full origin-left rounded-full bg-primary transition-transform duration-300 ease-out will-change-transform"
                    style={{ transform: `scaleX(${progress})` }}
                />
            </div>

            <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}
            >
                {titles.map((title, index) => {
                    const isActive = index === currentStep
                    const isPassed = index < currentStep

                    return (
                        <div
                            key={title}
                            className="flex flex-col items-center justify-center py-1 text-sm"
                        >
                            <span
                                className={[
                                    "transition-colors duration-200",
                                    isActive
                                        ? "font-semibold text-primary"
                                        : isPassed
                                            ? "font-medium text-foreground"
                                            : "text-muted-foreground",
                                ].join(" ")}
                            >
                                {title}
                            </span>

                            <span
                                className={[
                                    "mt-1 h-0.5 w-10 rounded-full transition-colors duration-200",
                                    isActive
                                        ? "bg-primary"
                                        : isPassed
                                            ? "bg-primary/40"
                                            : "bg-transparent",
                                ].join(" ")}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export const StepperProgress = memo(StepperProgressComponent)