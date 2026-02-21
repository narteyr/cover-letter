"use client"

import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu"
import type { SimilarJob } from "@/lib/api/types"

interface JobSlideoutMenuProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    selectedJobId: string
    jobs: SimilarJob[]
}

export const JobSlideoutMenu = ({ isOpen, onOpenChange, selectedJobId, jobs }: JobSlideoutMenuProps) => {
    const selectedJob = jobs.find(job => job.id === selectedJobId)

    if (!selectedJob) return null

    return (
        <SlideoutMenu isOpen={isOpen} onOpenChange={onOpenChange}>
            <SlideoutMenu.Header onClose={() => onOpenChange(false)}>
                <h2 className="text-xl font-semibold text-primary">{selectedJob.title}</h2>
                <p className="text-sm text-tertiary">{selectedJob.company_name}</p>
            </SlideoutMenu.Header>
            <SlideoutMenu.Content>
                <div className="space-y-6">
                    {selectedJob.location && (
                        <div>
                            <h3 className="text-sm font-medium text-secondary mb-2">Location</h3>
                            <p className="text-sm text-tertiary">{selectedJob.location}</p>
                        </div>
                    )}

                    {selectedJob.description && (
                        <div>
                            <h3 className="text-sm font-medium text-secondary mb-2">Description</h3>
                            <p className="text-sm text-tertiary">{selectedJob.description}</p>
                        </div>
                    )}

                    {selectedJob.secondary_skills && selectedJob.secondary_skills.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-secondary mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedJob.secondary_skills.map((skill, index) => (
                                    <span key={index} className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedJob.similarity_score && (
                        <div>
                            <h3 className="text-sm font-medium text-secondary mb-2">Match Score</h3>
                            <p className="text-sm text-tertiary">{Math.round(selectedJob.similarity_score * 100)}% match</p>
                        </div>
                    )}

                    {selectedJob.job_url && (
                        <div>
                            <a
                                href={selectedJob.job_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-brand-solid hover:text-brand-solid-hover underline"
                            >
                                View Original Job Posting
                            </a>
                        </div>
                    )}
                </div>
            </SlideoutMenu.Content>
        </SlideoutMenu>
    )
}
