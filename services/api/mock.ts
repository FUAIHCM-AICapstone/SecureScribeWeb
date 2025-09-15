// services/api/mock.ts
import type { AxiosResponse } from 'axios';

export type SearchType = 'file' | 'meeting' | 'transcript' | 'note';

export interface SearchItem {
    id: string;
    type: SearchType;
    title: string;
    subtitle?: string;
    relevance?: number;
}

const files: SearchItem[] = [
    { id: 'f1', type: 'file', title: 'Q3 Roadmap.pdf', subtitle: 'Project Alpha', relevance: 0.92 },
    { id: 'f2', type: 'file', title: 'Design Spec.docx', subtitle: 'Meeting 2025-09-01', relevance: 0.88 },
];

const meetings: SearchItem[] = [
    { id: 'm1', type: 'meeting', title: 'Sprint Planning', subtitle: '2025-09-10 09:00', relevance: 0.95 },
    { id: 'm2', type: 'meeting', title: 'Retrospective', subtitle: '2025-09-05 16:00', relevance: 0.86 },
];

const transcripts: SearchItem[] = [
    { id: 't1', type: 'transcript', title: 'Transcript: Sprint Planning', subtitle: 'Key: roadmap, velocity', relevance: 0.9 },
];

const notes: SearchItem[] = [
    { id: 'n1', type: 'note', title: 'Action Items - Sprint Planning', subtitle: 'Alice, Bob owners', relevance: 0.89 },
];

export async function searchAll(query: string): Promise<SearchItem[]> {
    const q = query.toLowerCase();
    const pool = [...files, ...meetings, ...transcripts, ...notes];
    const filtered = pool.filter((x) => x.title.toLowerCase().includes(q) || x.subtitle?.toLowerCase().includes(q));
    // Sort by relevance desc; if undefined, push down
    return filtered.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
}

export async function searchAllAxiosLike(query: string): Promise<AxiosResponse<SearchItem[]>> {
    const data = await searchAll(query);
    return { data } as AxiosResponse<SearchItem[]>;
}


