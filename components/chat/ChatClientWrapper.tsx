/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'

import { useEffect, useRef, useState } from 'react'
import { FluentProvider, teamsLightTheme, TabList, Tab, Button, Input, Tooltip, makeStyles, shorthands, tokens } from '@fluentui/react-components'
import { Add24Regular, Dismiss16Regular } from '@fluentui/react-icons'
import chatApi from '@/services/api/chat'
import { type Message, type Conversation, convertToUIConversation } from 'types/chat.type'
import { ChatInterface } from './ChatInterface'
import { useTranslations } from 'next-intl'

interface ChatClientWrapperProps {
    // No props needed for standalone version
}

export default function ChatClientWrapper({ }: ChatClientWrapperProps) {
    const styles = useStyles()
    const tTabs = useTranslations('Chat.Tabs')
    // Simplified state for standalone chat
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [mruOrder, setMruOrder] = useState<string[]>([])
    const [renamingId, setRenamingId] = useState<string | null>(null)
    const [renameValue, setRenameValue] = useState<string>('')
    const tabListContainerRef = useRef<HTMLDivElement>(null)

    // Load mock data on mount
    useEffect(() => {
        loadMockConversations()
    }, [])

    // Load mock conversations from chat API
    const loadMockConversations = async () => {
        try {
            const response = await chatApi.getConversations()
            if (response && response.data && response.data.data) {
                const mockConversations = response.data.data.map(conv => convertToUIConversation(conv))
                setConversations(mockConversations)

                // Set first conversation as active
                if (mockConversations.length > 0) {
                    setActiveConversationId(mockConversations[0].id)
                    loadConversationMessages(mockConversations[0].id)
                }

                // Initialize MRU with current order (first is active)
                const initialOrder = mockConversations.map(c => c.id)
                setMruOrder(initialOrder)
            }
        } catch (error) {
            console.error('Failed to load mock conversations:', error)
        }
    }

    // Load messages for selected conversation  
    const loadConversationMessages = async (conversationId: string) => {
        try {
            const response = await chatApi.getConversationMessages(conversationId)
            if (response && response.data && response.data.data) {
                const mockMessages = response.data.data.map(msg => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    timestamp: new Date(msg.timestamp)
                }))
                setMessages(mockMessages)
            }
        } catch (error) {
            console.error('Failed to load messages:', error)
        }
    }

    // Handle conversation selection
    const handleConversationChange = (conversationId: string) => {
        setActiveConversationId(conversationId)
        loadConversationMessages(conversationId)
        setMruOrder(prev => [conversationId, ...prev.filter(id => id !== conversationId)])
    }

    // Handle sending new message (mock simulation)
    const handleSendMessage = async (content: string) => {
        if (!activeConversationId) return

        // Add user message
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])

        // Simulate AI response after delay
        setTimeout(() => {
            const aiMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: `This is a mock response to: "${content}"`,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMessage])
        }, 1000)

        // Update MRU on activity
        setMruOrder(prev => [activeConversationId, ...prev.filter(id => id !== activeConversationId)])
    }

    // Create a new conversation and focus it
    const handleCreateConversation = async () => {
        try {
            const resp = await chatApi.createConversation({ name: 'New conversation' })
            if (resp && resp.data) {
                const newConv = convertToUIConversation(resp.data)
                setConversations(prev => [newConv, ...prev])
                setActiveConversationId(newConv.id)
                setMruOrder(prev => [newConv.id, ...prev.filter(id => id !== newConv.id)])
                // Load messages if any
                loadConversationMessages(newConv.id)
            }
        } catch (error) {
            console.error('Failed to create conversation:', error)
        }
    }

    // Close (delete) a conversation. If closing active, focus previous MRU
    const handleCloseConversation = async (conversationId: string, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation()
            e.preventDefault()
        }
        try {
            const isActive = activeConversationId === conversationId
            const nextCandidates = mruOrder.filter(id => id !== conversationId)
            const nextActive = isActive ? (nextCandidates.length > 0 ? nextCandidates[0] : (conversations.find(c => c.id !== conversationId)?.id || null)) : activeConversationId

            const resp = await chatApi.deleteConversation(conversationId)
            if (resp && resp.success) {
                setConversations(prev => prev.filter(c => c.id !== conversationId))
                setMruOrder(prev => prev.filter(id => id !== conversationId))
                if (isActive) {
                    setActiveConversationId(nextActive)
                    if (nextActive) {
                        loadConversationMessages(nextActive)
                    } else {
                        setMessages([])
                    }
                }
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error)
        }
    }

    // Start inline rename
    const startRename = (conversationId: string, currentName: string) => {
        setRenamingId(conversationId)
        setRenameValue(currentName)
    }

    const cancelRename = () => {
        setRenamingId(null)
        setRenameValue('')
    }

    const commitRename = async (conversationId: string) => {
        const newName = renameValue.trim() || 'Untitled'
        try {
            const resp = await chatApi.updateConversation(conversationId, { name: newName })
            if (resp && resp.success && resp.data) {
                setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, name: resp.data.name } : c))
            }
        } catch (error) {
            console.error('Failed to rename conversation:', error)
        } finally {
            cancelRename()
        }
    }

    return (
        <FluentProvider theme={teamsLightTheme}>
            <div className={styles.root}>
                {/* Conversation Tabs Header */}
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
                            onTabSelect={(_, data) => handleConversationChange(String(data.value))}
                            className={styles.tabList}
                        >
                            {(conversations.length === 0 ? [] : conversations).map(conv => (
                                <Tab key={conv.id} value={conv.id}>
                                    <div
                                        onDoubleClick={(e) => {
                                            e.stopPropagation()
                                            startRename(conv.id, conv.name)
                                        }}
                                        className={styles.tabItem}
                                    >
                                        {renamingId === conv.id ? (
                                            <Input
                                                appearance="underline"
                                                size="medium"
                                                value={renameValue}
                                                onChange={(_, data) => setRenameValue(data.value)}
                                                onBlur={() => commitRename(conv.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') commitRename(conv.id)
                                                    if (e.key === 'Escape') cancelRename()
                                                }}
                                                className={styles.renameInput}
                                            />
                                        ) : (
                                            <Tooltip content={tTabs('doubleClickToRename')} relationship="label">
                                                <span className={styles.tabName}>
                                                    {conv.name}
                                                </span>
                                            </Tooltip>
                                        )}
                                        <Button
                                            appearance="subtle"
                                            size="small"
                                            icon={<Dismiss16Regular />}
                                            onClick={(e) => handleCloseConversation(conv.id, e)}
                                            aria-label={tTabs('closeAria')}
                                        />
                                    </div>
                                </Tab>
                            ))}
                        </TabList>
                    </div>
                    <Tooltip content={tTabs('new')} relationship="label">
                        <Button
                            appearance="subtle"
                            icon={<Add24Regular />}
                            onClick={handleCreateConversation}
                            aria-label={tTabs('new')}
                        />
                    </Tooltip>
                </div>

                {/* Chat Interface */}
                <div className={styles.content}>
                    <ChatInterface
                        conversation={conversations.find(c => c.id === activeConversationId) || null}
                        activeConversationId={activeConversationId}
                        messages={messages}
                        isLoading={false}
                        isTyping={false}
                        error={null}
                        onSendMessage={handleSendMessage}
                        onOpenMobileSidebar={() => { }}
                    />
                </div>
            </div>
        </FluentProvider>
    )
}

const useStyles = makeStyles({
    root: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column'
    },
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
        ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1)
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
        columnGap: '8px',
        maxWidth: '220px'
    },
    tabName: {
        display: 'inline-block',
        maxWidth: '180px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    renameInput: {
        width: '160px'
    },
    content: {
        flex: 1,
        minHeight: 0
    }
})
