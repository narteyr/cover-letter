"use client";

import { usePathname } from "next/navigation";
import { SidebarNavigationSimple } from "./sidebar-simple";
import { NavItemType } from "../config";
import { File05, Trash01, User01, LayoutGrid01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { FeaturedCardProgressBar } from "../base-components/featured-cards";
import { FeaturedCardCommonProps } from "../base-components/featured-cards";

interface SidebarProps {
    activeUrl: string;
    items: NavItemType[];
    footerItems?: NavItemType[];
    featureCard?: React.ReactNode;
    showAccountCard: boolean;
    hideBorder: boolean;
    className: string;
}

const docsBtn: NavItemType = {
    label: "Docs",
    href: "/home",
    icon: File05,
}

const trashBtn: NavItemType = {
    label: "Trash",
    href: "/trash",
    icon: Trash01,
}

const accountBtn: NavItemType = {
    label: "Account",
    href: "/settings",
    icon: User01,
}

const appsBtn: NavItemType = {
    label: "Apps",
    href: "/apps",
    icon: LayoutGrid01,
    badge: <Badge size="sm" color="success" type="pill-color">3</Badge>,
}

export function DescriptionCard() {
    return (
        <div>
            <p>resume usage: 2/5</p>
        </div>
    )
}

const RateLimitProp: FeaturedCardCommonProps = {
    title: "Usage limit",
    description: <DescriptionCard />,
    confirmLabel: "Upgrade plan",
    onConfirm: () => { alert("upgraded") },
    onDismiss: () => { alert("dismissed") },
}

const FeaturedCard = () => {
    return (
        <FeaturedCardProgressBar {...RateLimitProp} progress={10} />
    )
}

export default function SidebarWrapper() {
    const pathname = usePathname()

    const sidebarProps: SidebarProps = {
        activeUrl: pathname || "/home",
        items: [docsBtn, trashBtn, accountBtn, appsBtn],
        showAccountCard: true,
        hideBorder: false,
        featureCard: <FeaturedCard />,
        footerItems: [],
        className: "dashboard-sidebar",
    }

    return (
        <div>
            <SidebarNavigationSimple {...sidebarProps} />
        </div>
    )
}