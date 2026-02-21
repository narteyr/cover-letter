
import { cx } from "@/utils/cx";

export interface DefaultCardProps {
    cardClassName?: string,
    childProp?: React.ReactNode
}

export function DefaultCard ( { cardClassName, childProp } : DefaultCardProps) {
    const isDebug = process.env.NEXT_PUBLIC_DEBUG === "true"

    return (
        <div className = {cx(
            "",
            isDebug && "border border-dotted border-bg-warning-solid", cardClassName
        )}>
            {childProp}
        </div>
    )
}

