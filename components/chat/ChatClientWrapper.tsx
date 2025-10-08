/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'

import { Button, Tab, TabList, Tooltip, makeStyles, tokens } from '@fluentui/react-components'
import { Add24Regular } from '@fluentui/react-icons'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
    ConversationResponse,
    ChatConversationResponse,
    ChatMessageResponse,
    ChatMessageCreate
} from '../../types/chat.type'
import {
    createConversation,
    getConversations,
    getConversation,
    sendChatMessage,
    connectToChatSSE,
    disconnectFromChatSSE
} from '../../services/api/chat'
import { ChatInterface } from './ChatInterface'
import { MessageInput } from './MessageInput'

// Helper function to format conversation title
const getConversationTitle = (conversation: ConversationResponse): string => {
    return conversation.title || 'Untitled';
}


interface ChatClientWrapperProps {
    // No props needed for standalone version
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
    }
})

export default function ChatClientWrapper({ }: ChatClientWrapperProps) {
    const styles = useStyles()
    const tTabs = useTranslations('Chat.Tabs')
    const queryClient = useQueryClient()

    // State for UI interactions
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const [sseEventSource, setSseEventSource] = useState<EventSource | null>(null)
    const tabListContainerRef = useRef<HTMLDivElement>(null)

    // React Query for data fetching
    const { data: conversations, isLoading: conversationsLoading } = useQuery({
        queryKey: ['chat', 'conversations'],
        queryFn: () => getConversations(),
        staleTime: 2 * 60 * 1000, // 2 minutes
    })

    const { data: activeConversationResponse, isLoading: conversationLoading } = useQuery({
        queryKey: ['chat', 'conversations', activeConversationId || ''],
        queryFn: () => getConversation(activeConversationId!),
        enabled: !!activeConversationId,
        staleTime: 30 * 1000, // 30 seconds for conversation data
    })

    // Mutations for write operations
    const createConversationMutation = useMutation({
        mutationFn: ({ title }: { title: string }) => createConversation({ title }),
        onSuccess: (newConversation) => {
            // Invalidate conversations list to refetch
            queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })

            // Set as active and connect to SSE
            if (newConversation) {
                setActiveConversationId(newConversation.id)
                connectToSSE(newConversation.id)
            }
        },
    })

    const sendMessageMutation = useMutation({
        mutationFn: ({ conversationId, payload }: { conversationId: string; payload: ChatMessageCreate }) =>
            sendChatMessage(conversationId, payload),
        onMutate: async ({ conversationId, payload }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['chat', 'conversations', conversationId] })

            // Snapshot the previous value
            const previousConversation = queryClient.getQueryData(['chat', 'conversations', conversationId])

            // Add optimistic user message
            const optimisticUserMessage: ChatMessageResponse = {
                id: `temp-user-${Date.now()}`,
                conversation_id: conversationId,
                role: 'user',
                content: payload.content,
                timestamp: new Date().toISOString(),
                mentions: payload.mentions,
            }

            // Optimistically update the cache
            queryClient.setQueryData(
                ['chat', 'conversations', conversationId],
                (oldData: ChatConversationResponse | undefined) => {
                    if (!oldData) return oldData

                    return {
                        ...oldData,
                        messages: [...oldData.messages, optimisticUserMessage],
                    }
                }
            )

            return { previousConversation, optimisticUserMessage }
        },
        onSuccess: (response, { conversationId }, context) => {
            if (response && response.user_message && response.ai_message) {
                // Replace optimistic user message with real one and add AI message
                queryClient.setQueryData(
                    ['chat', 'conversations', conversationId],
                    (oldData: ChatConversationResponse | undefined) => {
                        if (!oldData) return oldData

                        const messagesWithoutOptimistic = oldData.messages.filter(
                            msg => msg.id !== context?.optimisticUserMessage.id
                        )

                        return {
                            ...oldData,
                            messages: [...messagesWithoutOptimistic, response.user_message, response.ai_message],
                        }
                    }
                )

                // Invalidate conversations to update message counts
                queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
            }
        },
        onError: (error, { conversationId }, context) => {
            // Rollback optimistic update on error
            if (context?.previousConversation) {
                queryClient.setQueryData(
                    ['chat', 'conversations', conversationId],
                    context.previousConversation
                )
            }
        },
    })

    // Use API data directly
    const messages = activeConversationResponse?.messages || []
    const isLoading = conversationsLoading || conversationLoading || sendMessageMutation.isPending

    // Debug logging (remove in production)
    // console.log('ChatClientWrapper state:', {
    //     conversations: conversations,
    //     conversationsLength: conversations?.length || 0,
    //     activeConversationId,
    //     activeConversationResponse,
    //     messages: messages,
    //     isLoading
    // });

    // Set first conversation as active when conversations load
    useEffect(() => {
        if (conversations && conversations.length > 0 && !activeConversationId) {
            setActiveConversationId(conversations[0].id)
        }
    }, [conversations, activeConversationId])

    // Connect to SSE for real-time messages
    const connectToSSE = (conversationId: string) => {
        // Disconnect existing SSE if any
        if (sseEventSource) {
            disconnectFromChatSSE(sseEventSource)
            setSseEventSource(null)
        }

        try {
            const eventSource = connectToChatSSE(
                conversationId,
                (data: any) => {
                    // Handle incoming SSE message
                    if (data && data.type === 'message') {
                        // Update conversation messages in cache
                        queryClient.setQueryData(
                            ['chat', 'conversations', conversationId],
                            (oldData: ChatConversationResponse | undefined) => {
                                if (!oldData) return oldData

                                return {
                                    ...oldData,
                                    messages: [...oldData.messages, data.data],
                                }
                            }
                        )

                        // Invalidate conversations to update message counts
                        queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
                    }
                },
                (error: any) => {
                    console.error('SSE error:', error)
                },
                () => {
                    console.log('SSE connection opened')
                }
            )
            setSseEventSource(eventSource)
        } catch (error) {
            console.error('Failed to connect to SSE:', error)
        }
    }

    // Disconnect from SSE
    const disconnectFromSSE = () => {
        if (sseEventSource) {
            disconnectFromChatSSE(sseEventSource)
            setSseEventSource(null)
        }
    }

    // Handle conversation selection
    const handleConversationChange = (conversationId: string) => {
        setActiveConversationId(conversationId)
        connectToSSE(conversationId)
    }

    // Handle sending new message
    const handleSendMessage = (payload: ChatMessageCreate) => {
        if (!activeConversationId) return

        setIsTyping(true)
        sendMessageMutation.mutate({
            conversationId: activeConversationId,
            payload,
        }, {
            onSettled: () => {
                setIsTyping(false)
            }
        })
    }

    // Create a new conversation and focus it
    const handleCreateConversation = () => {
        createConversationMutation.mutate({
            title: 'New conversation'
        })
    }

    // Cleanup SSE on unmount
    useEffect(() => {
        return () => {
            disconnectFromSSE()
        }
    }, [])

    // Note: Rename functionality removed as updateConversation API is not available in current schema

    return (
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
                        {conversationsLoading ? (
                            <div style={{ padding: '8px 12px', color: '#666' }}>Loading conversations...</div>
                        ) : conversations && conversations.length > 0 ? (
                            conversations.map(conv => (
                                <Tab key={conv.id} value={conv.id}>
                                    <div className={styles.tabItem}>
                                        <Tooltip content={getConversationTitle(conv)} relationship="label">
                                            <span className={styles.tabName}>
                                                {getConversationTitle(conv)}
                                            </span>
                                        </Tooltip>
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
                        onClick={handleCreateConversation}
                        aria-label={tTabs('new')}
                    />
                </Tooltip>
            </div>

            {/* Chat Interface */}
            <div className={styles.content}>
                {conversations && conversations.length > 0 ? (
                    <ChatInterface
                        activeConversationId={activeConversationId}
                        messages={messages}
                        isLoading={isLoading}
                        isTyping={isTyping}
                        error={null}
                        onOpenMobileSidebar={() => { }}
                    />
                ) : conversationsLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        Loading conversations...
                    </div>
                ) : (
                    <ChatInterface
                        activeConversationId={null}
                        messages={[]}
                        isLoading={false}
                        isTyping={false}
                        error={null}
                        onOpenMobileSidebar={() => { }}
                    />
                )}
            </div>

            {/* Input Area moved here */}
            <div style={{ padding: '0' }}>
                <MessageInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    canSendMessage={Boolean(activeConversationId)}
                    placeholder="Type your message..."
                />
            </div>
        </div>
    )
}
