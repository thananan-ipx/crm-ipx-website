"use client"

import { StepItem } from "@/types/stepper/type"
import { StepperProgress } from "./stepper-progress"

type StepperProps = {
    steps: StepItem[]
    currentStep: number
    onNext: () => void
    onBack: () => void
    onCancel: () => void
    onSubmit?: () => void
    title: string
}

export function Stepper({
    steps,
    currentStep,
    onNext,
    onBack,
    onCancel,
    onSubmit,
    title
}: StepperProps) {
    const totalSteps = steps.length
    const isFirstStep = currentStep === 0
    const isLastStep = currentStep === totalSteps - 1

    if (!steps.length) {
        return (
            <div className="p-2">
                <p className="text-sm text-muted-foreground">ยังไม่มี step</p>
            </div>
        )
    }

    return (
        <section className="w-full">
            <StepperProgress
                title={title}
                totalSteps={totalSteps}
                currentStep={currentStep}
                titles={steps.map((step) => step.title)}
            />

            <div className="min-h-75 flex justify-center">
                <div className="w-full max-w-6xl">
                    {steps[currentStep]?.component}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                {isFirstStep ? <><button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-red-100 text-red-400 bg-red-200 cursor-pointer"
                >
                    ยกเลิก
                </button></> : <button
                    type="button"
                    onClick={onBack}
                    disabled={isFirstStep}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    ย้อนกลับ
                </button>}

                {isLastStep ? (
                    <button
                        type="button"
                        onClick={onSubmit}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        สร้าง
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onNext}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        ถัดไป
                    </button>
                )}
            </div>
        </section>
    )
}