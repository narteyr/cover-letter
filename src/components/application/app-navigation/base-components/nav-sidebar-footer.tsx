"use client";

import Link from "next/link";
import { HelpCircle, LogOut01 } from "@untitledui/icons";
import { useAuth } from "@/providers/auth-provider";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { cx } from "@/utils/cx";

/**
 * Simple sidebar footer with Support and Sign out - Grammarly-style
 */
export function NavSidebarFooter() {
    const { user } = useAuth();
    const { handleLogout } = useAuthActions();

    const truncatedEmail = user?.email
        ? user.email.length > 24
            ? `${user.email.slice(0, 21)}...`
            : user.email
        : null;

    return (
        <div className="flex flex-col border-t border-secondary">
            <Link
                href="/support"
                className={cx(
                    "flex items-center gap-2 px-3 py-2 rounded-md",
                    "text-sm font-semibold text-secondary hover:bg-primary_hover hover:text-secondary_hover",
                    "outline-focus-ring transition-colors"
                )}
            >
                <HelpCircle className="size-5 shrink-0 text-fg-quaternary" />
                Support
            </Link>
            <button
                type="button"
                onClick={handleLogout}
                className={cx(
                    "flex flex-col items-start gap-0.5 px-3 py-2 rounded-md w-full text-left",
                    "text-sm font-semibold text-secondary hover:bg-primary_hover hover:text-secondary_hover",
                    "outline-focus-ring transition-colors"
                )}
            >
                <span className="flex items-center gap-2">
                    <LogOut01 className="size-5 shrink-0 text-fg-quaternary" />
                    Sign out
                </span>
                {truncatedEmail && (
                    <span className="text-xs font-normal text-tertiary pl-7 truncate max-w-full">
                        {truncatedEmail}
                    </span>
                )}
            </button>
        </div>
    );
}
