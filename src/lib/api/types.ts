export interface SimilarJob {
    id: string
    company_name: string
    thumbnail?: string
    title: string
    description?: string
    secondary_skills?: string[]
    similarity_score?: number
    location?: string
    job_url?: string
}
