
import { cx } from "@/utils/cx"

interface MetricCardProp {
    childProp?: React.ReactNode
}

export default function MetricCard ({childProp} : MetricCardProp) {
    const isDebug = process.env.NEXT_PUBLIC_DEBUG === "true"
    return (
        <div className="flex-1 min-w-62.5 max-w-100 overflow-hidden">
            <div className = {cx(
                "w-full border border-dotted border-bg-warning-solid  h-30 aspect-auto sm:aspect-4/3 md:aspect-video rounded-2xl shadow-sm flex flex-col p-4 fg-primary relative overflow-hidden ",
                isDebug && "border border-dotted border-bg-warning-solid"
            )}>
                {childProp}
            </div>
        </div>

    )
}