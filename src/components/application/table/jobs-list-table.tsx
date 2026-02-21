"use client"

import { useMemo, useState } from "react"
import type { SortDescriptor } from "react-aria-components"
import { Table, TableCard } from "@/components/application/table/table"
import { Avatar } from "@/components/base/avatar/avatar"
import { BadgeWithDot, Badge } from "@/components/base/badges/badges"
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators"
import { Button } from "@/components/base/buttons/button"
import { ArrowRight, Archive } from "@untitledui/icons"
import { JobSlideoutMenu } from "@/app/(dashboard)/jobs-list/custom/slideout-menu"
import { Dropdown } from "@/components/base/dropdown/dropdown"

import type { SimilarJob } from "@/lib/api/types";

// Job item structure for the table component
interface JobItem {
    id: string
    company: {
        name: string
        logo: string
    }
    status: "active" | "pending" | "closed"
    about: {
        title: string
        description: string
    }
    skills: string[]
    progress: number
    similarity_score?: number
    location?: string
    job_url?: string
}

// Map backend SimilarJob to JobItem format
function mapSimilarJobToJobItem(job: SimilarJob): JobItem {
    return {
        id: job.id,
        company: {
            name: job.company_name,
            logo: job.thumbnail || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company_name)}&background=random`
        },
        status: "active" as const, // All fetched jobs are considered active
        about: {
            title: job.title,
            description: job.description ? job.description.substring(0, 100) + (job.description.length > 100 ? "..." : "") : ""
        },
        skills: job.secondary_skills || [],
        progress: job.similarity_score ? Math.round(job.similarity_score * 100) : 0,
        similarity_score: job.similarity_score,
        location: job.location,
        job_url: job.job_url,
    }
}

interface JobsListTableProps {
    jobs?: SimilarJob[]
    loading?: boolean
}

export const JobsListTable = ({ jobs = [], loading = false }: JobsListTableProps) => {
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "company",
        direction: "ascending",
    })
    const [slideoutOpen, setSlideoutOpen] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState<string>("")

    const jobItems = useMemo(() => {
        return jobs.map(mapSimilarJobToJobItem)
    }, [jobs])

    const sortedItems = useMemo(() => {
        return [...jobItems].sort((a, b) => {
            const first = a[sortDescriptor.column as keyof JobItem]
            const second = b[sortDescriptor.column as keyof JobItem]

            // Compare strings
            if (typeof first === "string" && typeof second === "string") {
                let cmp = first.localeCompare(second)
                if (sortDescriptor.direction === "descending") {
                    cmp *= -1
                }
                return cmp
            }

            // Compare numbers
            if (typeof first === "number" && typeof second === "number") {
                return sortDescriptor.direction === "descending" ? second - first : first - second
            }

            // Compare objects (company)
            if (typeof first === "object" && typeof second === "object" && first !== null && second !== null) {
                const firstCompany = (first as { name: string }).name
                const secondCompany = (second as { name: string }).name
                let cmp = firstCompany.localeCompare(secondCompany)
                if (sortDescriptor.direction === "descending") {
                    cmp *= -1
                }
                return cmp
            }

            return 0
        })
    }, [sortDescriptor, jobItems])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "success"
            case "pending":
                return "warning"
            case "closed":
                return "gray"
            default:
                return "gray"
        }
    }

    if (loading) {
        return (
            <TableCard.Root className="w-full max-w-full min-w-0">
                <TableCard.Header
                    title="Jobs"
                    description="List of available job opportunities."
                />
                <div className="flex items-center justify-center py-12">
                    <p className="text-tertiary">Loading jobs...</p>
                </div>
            </TableCard.Root>
        );
    }

    return (
        <>
            <TableCard.Root className="w-full max-w-full min-w-0">
                <TableCard.Header
                    title="Jobs"
                    description={sortedItems.length > 0 ? `List of ${sortedItems.length} available job opportunities.` : "List of available job opportunities."}
                />

                {sortedItems.length === 0 ? (
                    <div className="flex items-center justify-center py-12 px-4">
                        <p className="text-tertiary">No jobs found</p>
                    </div>
                ) : (
                    <Table aria-label="Jobs list" selectionMode="none" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                        <Table.Header>
                            <Table.Head id="company" label="Company" isRowHeader allowsSorting />
                            <Table.Head id="status" label="Status" allowsSorting />
                            <Table.Head id="about" label="About" allowsSorting />
                            <Table.Head id="skills" label="Skills" />
                            <Table.Head id="progress" label="Progress" allowsSorting className="min-w-55" />
                            <Table.Head id="actions" />
                        </Table.Header>
                        <Table.Body items={sortedItems}>
                            {(item) => (
                        <Table.Row id={item.id}>
                            <Table.Cell>
                                <div className="flex items-center gap-3">
                                    <Avatar src={item.company.logo} alt={item.company.name} size="md" />
                                    <div className="whitespace-nowrap">
                                        <p className="text-sm font-medium text-primary">{item.company.name}</p>
                                        {item.location && (
                                            <p className="text-xs text-tertiary">{item.location}</p>
                                        )}
                                    </div>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <BadgeWithDot size="sm" color={getStatusColor(item.status)}>
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </BadgeWithDot>
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap">
                                <p className="text-sm font-medium text-primary">{item.about.title}</p>
                            </Table.Cell>
                            <Table.Cell>
                                <div className="flex flex-wrap gap-1.5">
                                    {item.skills.slice(0, 3).map((skill, index) => (
                                        <Badge key={index} size="sm" color="gray" type="pill-color">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {item.skills.length > 3 && (
                                        <Badge size="sm" color="gray" type="pill-color">
                                            +{item.skills.length - 3}
                                        </Badge>
                                    )}
                                    {item.skills.length === 0 && (
                                        <span className="text-xs text-tertiary">No skills listed</span>
                                    )}
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <div className="flex items-center gap-3">
                                    <ProgressBarBase 
                                        value={item.progress} 
                                        progressClassName={item.similarity_score ? "bg-brand-solid" : "bg-utility-success-500"} 
                                    />
                                    <span className="shrink-0 text-sm font-medium text-secondary tabular-nums">
                                        {item.similarity_score ? `${item.progress}% match` : `${item.progress}%`}
                                    </span>
                                </div>
                            </Table.Cell>
                            <Table.Cell className="px-4">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        size="sm"
                                        color="secondary"
                                        iconTrailing={ArrowRight}
                                        onClick={() => {
                                            setSelectedJobId(item.id)
                                            setSlideoutOpen(true)
                                        }}
                                    >
                                        View
                                    </Button>
                                    <Dropdown.Root>
                                        <Dropdown.DotsButton />
                                        <Dropdown.Popover className="w-min">
                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    icon={Archive}
                                                    onAction={() => {
                                                        // Handle archive action
                                                        console.log("Archive job:", item.id)
                                                        // TODO: Implement archive functionality
                                                    }}
                                                >
                                                    <span className="pr-4">Archive</span>
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown.Popover>
                                    </Dropdown.Root>
                                </div>
                            </Table.Cell>
                            </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                )}
            </TableCard.Root>
            <JobSlideoutMenu
                isOpen={slideoutOpen}
                onOpenChange={setSlideoutOpen}
                selectedJobId={selectedJobId}
                jobs={jobs}
            />
        </>
    )
}

