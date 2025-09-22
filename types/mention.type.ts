export type MentionType = 'meeting' | 'project' | 'file'

export interface Mention {
    type: MentionType
    id: string
    name: string
}

export interface MentionOccurrence extends Mention {
    offset: number
    length: number
}

export interface MentionSearchItem {
    type: MentionType
    id: string
    name: string
    subtitle?: string
    relevance?: number
}


