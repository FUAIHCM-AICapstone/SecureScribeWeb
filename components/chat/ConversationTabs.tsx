/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'

import { Button, Input, Tab, TabList, Tooltip, makeStyles, tokens } from '@fluentui/react-components'
import { Add24Regular, Dismiss16Regular, Edit16Regular, Checkmark16Regular } from '@fluentui/react-icons'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import type { ConversationResponse } from '../../types/chat.type'

// Helper function to format conversation title
const getConversationTitle = (conversation: ConversationResponse): string => {
    return conversation.title || 'Untitled'
}

interface ConversationTabsProps {
    conversations?: ConversationResponse[]
    conversationsLoading?: boolean
    activeConversationId: string | null
    onConversationChange: (conversationId: string) => void
    onCreateConversation: () => void
    onDeleteConversation: (conversationId: string, e?: React.MouseEvent) => void
    onRenameConversation: (conversationId: string, title: string) => void
    isDeletingConversation?: boolean
    isRenamingConversation?: boolean
}

const useStyles = makeStyles({
    header: {
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        columnGap: '8px',
        position: 'sticky',
        top: 0,
        backgroundColor: tokens.colorNeutralBackground1,
        zIndex: 10,
        boxShadow: tokens.shadow4,
    },
    tabListContainer: {
        flex: 1,
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        selectors: {
            '&::-webkit-scrollbar': {
                width: '0px',
                height: '0px'
            }
        }
    },
    tabList: {
        minWidth: '100%'
    },
    tabItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: '8px',
        maxWidth: '280px',
        width: '100%'
    },
    tabName: {
        display: 'inline-block',
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    renameInput: {
        flex: 1,
        maxWidth: '200px'
    }
})

export function ConversationTabs({
    conversations,
    conversationsLoading,
    activeConversationId,
    onConversationChange,
    onCreateConversation,
    onDeleteConversation,
    onRenameConversation,
    isDeletingConversation = false,
    isRenamingConversation = false
}: ConversationTabsProps) {
    const styles = useStyles()
    const tTabs = useTranslations('Chat.Tabs')
    const tabListContainerRef = useRef<HTMLDivElement>(null)

    // Local state for rename functionality
    const [renamingId, setRenamingId] = useState<string | null>(null)
    const [renameValue, setRenameValue] = useState<string>('')

    const startRename = (conversationId: string, currentTitle: string) => {
        setRenamingId(conversationId)
        setRenameValue(currentTitle)
    }

    const cancelRename = () => {
        setRenamingId(null)
        setRenameValue('')
    }

    const confirmRename = (conversationId: string) => {
        if (renameValue.trim()) {
            onRenameConversation(conversationId, renameValue.trim())
        } else {
            cancelRename()
        }
    }

    return (
        <div className={styles.header}>
            <div
                className={styles.tabListContainer}
                ref={tabListContainerRef}
                onWheel={(e) => {
                    if (e.deltaY !== 0) {
                        e.preventDefault()
                        const el = tabListContainerRef.current
                        if (el) {
                            el.scrollLeft += e.deltaY
                        }
                    }
                }}
            >
                <TabList
                    appearance="subtle"
                    size="small"
                    selectedValue={activeConversationId || undefined}
                    onTabSelect={(_, data) => onConversationChange(String(data.value))}
                    className={styles.tabList}
                >
                    {conversationsLoading ? (
                        <div style={{ padding: '8px 12px', color: tokens.colorNeutralForeground3 }}>Loading conversations...</div>
                    ) : conversations && conversations.length > 0 ? (
                        conversations.map(conv => (
                            <Tab key={conv.id} value={conv.id}>
                                <div className={styles.tabItem}>
                                    {renamingId === conv.id ? (
                                        <Input
                                            appearance="underline"
                                            size="medium"
                                            value={renameValue}
                                            onChange={(_, data) => setRenameValue(data.value)}
                                            onBlur={() => confirmRename(conv.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    confirmRename(conv.id)
                                                }
                                                if (e.key === 'Escape') {
                                                    cancelRename()
                                                }
                                            }}
                                            className={styles.renameInput}
                                            disabled={isRenamingConversation}
                                        />
                                    ) : (
                                        <div style={{ cursor: 'default' }}>
                                            <Tooltip content={getConversationTitle(conv)} relationship="label">
                                                <span className={styles.tabName}>
                                                    {getConversationTitle(conv)}
                                                </span>
                                            </Tooltip>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
                                        <Tooltip content={renamingId === conv.id ? tTabs('confirmRename') : tTabs('rename')} relationship="label">
                                            <Button
                                                appearance="subtle"
                                                size="small"
                                                icon={renamingId === conv.id ? <Checkmark16Regular /> : <Edit16Regular />}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (renamingId === conv.id) {
                                                        confirmRename(conv.id)
                                                    } else {
                                                        startRename(conv.id, getConversationTitle(conv))
                                                    }
                                                }}
                                                disabled={isRenamingConversation}
                                                aria-label={renamingId === conv.id ? tTabs('confirmRename') : tTabs('rename')}
                                            />
                                        </Tooltip>
                                        <Tooltip content={tTabs('delete')} relationship="label">
                                            <Button
                                                appearance="subtle"
                                                size="small"
                                                icon={<Dismiss16Regular />}
                                                onClick={(e) => onDeleteConversation(conv.id, e)}
                                                disabled={isDeletingConversation}
                                                aria-label={tTabs('delete')}
                                            />
                                        </Tooltip>
                                    </div>
                                </div>
                            </Tab>
                        ))
                    ) : (
                        <div style={{ padding: '8px 12px', color: '#666' }}>No conversations yet</div>
                    )}
                </TabList>
            </div>
            <Tooltip content={tTabs('new')} relationship="label">
                <Button
                    appearance="subtle"
                    icon={<Add24Regular />}
                    onClick={onCreateConversation}
                    aria-label={tTabs('new')}
                />
            </Tooltip>
        </div>
    )
}
