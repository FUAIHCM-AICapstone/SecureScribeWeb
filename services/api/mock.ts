// services/api/mock.ts
import type { AxiosResponse } from 'axios';

export type SearchType = 'file' | 'meeting' | 'transcript' | 'note' | 'project';

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

// Centralized mock projects (GUID-like ids)
const projects: SearchItem[] = [
    { id: '8f14e45f-ea43-4f10-96c1-9dbc9b96f2de', type: 'project', title: 'Project Alpha', subtitle: 'Core development', relevance: 0.94 },
    { id: '3c5a6d7e-1f2b-4c8d-9e01-23456789abcd', type: 'project', title: 'Project Beta', subtitle: 'R&D initiatives', relevance: 0.87 },
    { id: 'a1b2c3d4-e5f6-7a89-b0c1-d2e3f4a5b6c7', type: 'project', title: 'Project Gamma', subtitle: 'Marketing campaign', relevance: 0.83 },
];

export async function searchAll(query: string): Promise<SearchItem[]> {
    const q = query.toLowerCase();
    const pool = [...files, ...meetings, ...transcripts, ...notes, ...projects];
    const filtered = pool.filter((x) => x.title.toLowerCase().includes(q) || x.subtitle?.toLowerCase().includes(q));
    // Sort by relevance desc; if undefined, push down
    return filtered.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
}

export async function searchAllAxiosLike(query: string): Promise<AxiosResponse<SearchItem[]>> {
    const data = await searchAll(query);
    return { data } as AxiosResponse<SearchItem[]>;
}

// ============================================
// Mention search (meetings, projects, files only)
// ============================================

export interface MentionSearchItem {
    id: string;
    type: 'meeting' | 'project' | 'file';
    name: string;
    subtitle?: string;
    relevance?: number;
}

export async function searchMentions(query: string, limit: number = 8): Promise<MentionSearchItem[]> {
    const q = (query || '').toLowerCase();
    const pool = [
        ...meetings,
        ...projects,
        ...files,
    ];
    const filtered = q
        ? pool.filter((x) => x.title.toLowerCase().includes(q) || x.subtitle?.toLowerCase().includes(q))
        : [...pool];
    const sorted = filtered.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
    const sliced = sorted.slice(0, limit);
    return sliced.map((x) => ({ id: x.id, type: x.type as 'meeting' | 'project' | 'file', name: x.title, subtitle: x.subtitle, relevance: x.relevance }));
}


