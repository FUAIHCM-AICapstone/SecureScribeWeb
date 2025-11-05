import type { Mention, MentionOccurrence, MentionType } from 'types/chat.type';

const TOKEN_REGEX = /@\{(meeting|project|file)\}\{([^}]+)\}/g

export function parseTokensFromText(input: string): { start: number; end: number; mention: Mention }[] {
    const results: { start: number; end: number; mention: Mention }[] = []
    let match: RegExpExecArray | null
    while ((match = TOKEN_REGEX.exec(input)) !== null) {
        const [full, entityType, entityId] = match
        const start = match.index
        const end = start + full.length
        // Use entity_id as both id and fallback for missing name
        results.push({
            start,
            end,
            mention: {
                entity_type: entityType as MentionType,
                entity_id: entityId.trim(),
                offset_start: start,
                offset_end: end
            }
        })
    }
    return results
}

export function serializeContenteditableToText(root: HTMLElement): { content: string; mentions: MentionOccurrence[] } {
    let content = ''
    const mentions: MentionOccurrence[] = []

    const append = (text: string) => {
        content += text
    }

    const walk = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement
            if (el.dataset && el.dataset.mentionId && el.dataset.mentionType) {
                const entityId = el.dataset.mentionId || ''
                const entityType = el.dataset.mentionType as MentionType
                const entityName = el.dataset.mentionName || entityType // fallback to type if no name
                const token = `@{${entityType}}{${entityId}}`
                const offset = content.length
                append(token)
                mentions.push({ type: entityType, id: entityId, name: entityName, offset, length: token.length })
                return // skip subtree
            }
            const tag = el.tagName
            if (tag === 'BR') {
                append('\n')
                return
            }
            if (el !== root) {
                const display = window.getComputedStyle(el).display
                if (display === 'block' || tag === 'DIV' || tag === 'P') {
                    if (!content.endsWith('\n')) append('\n')
                }
            }
            const children = Array.from(el.childNodes)
            for (const child of children) walk(child)
            return
        }
        if (node.nodeType === Node.TEXT_NODE) {
            append((node as Text).data)
            return
        }
    }

    for (const child of Array.from(root.childNodes)) walk(child)

    content = content.replace(/\n{3,}/g, '\n\n')
    return { content: content.trim(), mentions }
}

export function createMentionChip(mention: Mention): HTMLSpanElement {
    const chip = document.createElement('span')
    chip.textContent = `@${mention.entity_type}`
    chip.contentEditable = 'false'
    chip.className = 'mention-chip'
    chip.style.backgroundColor = 'var(--mention-bg, rgba(0,120,212,0.12))'
    chip.style.border = '1px solid var(--mention-border, rgba(0,120,212,0.4))'
    chip.style.borderRadius = '6px'
    chip.style.padding = '2px 6px'
    chip.style.margin = '0 1px'
    chip.dataset.mentionId = mention.entity_id
    chip.dataset.mentionType = mention.entity_type
    chip.dataset.mentionName = mention.entity_type
    return chip
}

export function replaceRangeWithMention(root: HTMLElement, range: Range, mention: Mention) {
    range.deleteContents()
    const chip = createMentionChip(mention)
    // temporary highlight effect
    try {
        chip.style.transition = 'background-color 0.2s ease, box-shadow 0.2s ease'
        chip.style.backgroundColor = 'rgba(0,120,212,0.15)'
        chip.style.boxShadow = '0 0 0 2px #0078d4'
        window.setTimeout(() => {
            chip.style.backgroundColor = ''
            chip.style.boxShadow = ''
            chip.style.transition = ''
        }, 800)
    } catch { }
    range.insertNode(chip)
    // Insert trailing space to continue typing naturally
    const space = document.createTextNode(' ')
    chip.after(space)
    // Move caret after the space
    const sel = window.getSelection()
    if (sel) {
        const r = document.createRange()
        r.setStart(space, 1)
        r.collapse(true)
        sel.removeAllRanges()
        sel.addRange(r)
    }
}

export function findTriggerRange(root: HTMLElement): { range: Range; query: string } | null {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return null
    const baseRange = selection.getRangeAt(0).cloneRange()
    if (!root.contains(baseRange.startContainer)) return null
    // Walk backwards from caret to find '@' after non-word boundary
    let container = baseRange.startContainer
    let offset = baseRange.startOffset
    if (container.nodeType !== Node.TEXT_NODE) {
        // Create a text node for searching
        const tn = document.createTextNode('')
        baseRange.insertNode(tn)
        container = tn
        offset = 0
    }
    const text = (container as Text).data || ''
    const left = text.slice(0, offset)
    // Find last '@' and ensure boundary before it is start|space|punct
    const atIndex = left.lastIndexOf('@')
    if (atIndex === -1) return null
    const boundary = atIndex === 0 ? true : /[^\w]$/.test(left.slice(0, atIndex))
    if (!boundary) return null
    const query = left.slice(atIndex + 1)
    const r = document.createRange()
    r.setStart(container, atIndex)
    r.setEnd(container, offset)
    return { range: r, query }
}


