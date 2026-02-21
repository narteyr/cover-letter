"use client"

import { useMemo, useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";

// Debug mode flag - set NEXT_PUBLIC_DEBUG=true in .env.local to show mock job listings
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG === "true";

// Hardcoded job listings data (only used in debug mode)
const mockJobListings = {
    items: DEBUG_MODE ? [
        {
            id: "1",
            name: "Senior Frontend Developer",
            match: "Strong match",
            description: "Build scalable React applications with TypeScript and modern tooling",
            logoUrl: "https://www.untitledui.com/images/logos/logomark/1?fm=webp&q=80",
            jobTitle: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            viewJobUrl: "/jobs/1",
            skills: ["React", "TypeScript", "Next.js", "TailwindCSS"]
        },
        {
            id: "2",
            name: "Full Stack Engineer",
            match: "Medium match",
            description: "Work on end-to-end features using Node.js and React ecosystem",
            logoUrl: "https://www.untitledui.com/images/logos/logomark/2?fm=webp&q=80",
            jobTitle: "Full Stack Engineer",
            company: "StartupHub",
            viewJobUrl: "/jobs/2",
            skills: ["Node.js", "React", "PostgreSQL", "AWS"]
        },
        {
            id: "3",
            name: "UI/UX Engineer",
            match: "Strong match",
            description: "Create beautiful and accessible user interfaces with design systems",
            logoUrl: "https://www.untitledui.com/images/logos/logomark/3?fm=webp&q=80",
            jobTitle: "UI/UX Engineer",
            company: "DesignFlow",
            viewJobUrl: "/jobs/3",
            skills: ["Figma", "React", "CSS", "Accessibility"]
        },
    ] : []
};

export default function ActivityTable() {
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "match",
        direction: "ascending",
    });

    const sortedItems = useMemo(() => {
        return mockJobListings.items.sort((a, b) => {
            const first = a[sortDescriptor.column as keyof typeof a];
            const second = b[sortDescriptor.column as keyof typeof b];

            // Compare numbers or booleans
            if ((typeof first === "number" && typeof second === "number") || (typeof first === "boolean" && typeof second === "boolean")) {
                return sortDescriptor.direction === "descending" ? second - first : first - second;
            }

            // Compare strings
            if (typeof first === "string" && typeof second === "string") {
                let cmp = first.localeCompare(second);
                if (sortDescriptor.direction === "descending") {
                    cmp *= -1;
                }
                return cmp;
            }

            return 0;
        });
    }, [sortDescriptor]);

    // Don't render the table if there are no items (disabled in production)
    if (sortedItems.length === 0) {
        return null;
    }

    return (
        <TableCard.Root>
            <TableCard.Header
                title="New internship matches"
            />

            <Table aria-label="Featured job listings" selectionMode="none" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                <Table.Header>
                    <Table.Head id="name" label="Job Title" isRowHeader allowsSorting />
                    <Table.Head id="match" label="Match" allowsSorting />
                    <Table.Head id="actions" />
                </Table.Header>
                <Table.Body items={sortedItems}>
                    {(item) => (
                        <Table.Row id={item.id}>
                            <Table.Cell>
                                <div className="flex items-center gap-3">
                                    <Avatar src={item.logoUrl} alt={item.company} size="md" />
                                    <div className="whitespace-nowrap">
                                        <p className="text-sm font-medium text-primary">{item.jobTitle}</p>
                                        <p className="text-sm text-tertiary">{item.company}</p>
                                    </div>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <BadgeWithDot size="sm" color={item.match === "Strong match" ? "success" : "warning"}>
                                    {item.match}
                                </BadgeWithDot>
                            </Table.Cell>
                            <Table.Cell className="px-4">
                                <div className="flex items-center justify-end gap-2">
                                    <Button size="sm" color="secondary" href={item.viewJobUrl}>
                                        View Job
                                    </Button>
                                    <TableRowActionsDropdown />
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
}
