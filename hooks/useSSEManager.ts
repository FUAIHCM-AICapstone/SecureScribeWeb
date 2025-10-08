import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { connectToChatSSE, disconnectFromChatSSE } from '../services/api/chat'
import type { ChatConversationResponse } from '../types/chat.type'

// --- Define SSE Data Types ---
interface SSEChatMessage {
    id: string
    content: string
    message_type: 'agent' | 'user' | string
    created_at: string
}

interface SSEChatMessageEvent {
    type: 'chat_message'
    conversation_id: string
    message: SSEChatMessage
}

type SSEEvent = SSEChatMessageEvent

interface UseSSEManagerReturn {
    // State
    sseEventSource: EventSource | null

    // Actions
    connectToSSE: (conversationId: string) => void
    disconnectFromSSE: () => void

    // For external use
    setIsAIResponding: (responding: boolean) => void
}

export function useSSEManager(
    activeConversationId: string | null,
    setIsAIResponding: (responding: boolean) => void
): UseSSEManagerReturn {
    const queryClient = useQueryClient()
    const [sseEventSource, setSseEventSource] = useState<EventSource | null>(null)

    const connectToSSE = (conversationId: string) => {
        console.log('🔗 [SSE] Attempting to connect for conversation:', conversationId)

        // Disconnect existing SSE if any
        if (sseEventSource) {
            console.log('🔴 [SSE] Disconnecting existing SSE before connecting new one')
            disconnectFromChatSSE(sseEventSource)
            setSseEventSource(null)
        }

        try {
            const eventSource = connectToChatSSE(
                conversationId,
                (data: SSEEvent) => {
                    console.log('🔵 [SSE] Raw data received:', data)

                    if (data.type === 'chat_message') {
                        const { message } = data

                        console.log('🟢 [SSE] Message event:', {
                            type: data.type,
                            message_type: message.message_type,
                            id: message.id,
                            contentPreview: message.content?.slice(0, 50) || '(no content)',
                        })

                        // Update conversation messages in cache
                        queryClient.setQueryData(
                            ['chat', 'conversations', conversationId],
                            (oldData: ChatConversationResponse | undefined) => {
                                if (!oldData) {
                                    console.warn('⚠️ [SSE] No existing conversation data in cache.')
                                    return oldData
                                }

                                const currentMessages = Array.isArray(oldData.messages) ? oldData.messages : []
                                const updatedMessages = [...currentMessages, message]

                                console.log(
                                    `📨 [SSE] Updated messages count: ${updatedMessages.length} (was ${currentMessages.length})`
                                )

                                return {
                                    ...oldData,
                                    messages: updatedMessages,
                                }
                            }
                        )

                        // Invalidate conversations to update message counts
                        queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })

                        // Stop AI indicator if message is from agent
                        if (message.message_type === 'agent') {
                            console.log('🤖 [SSE] Assistant response received — stopping AI indicator.')
                            setIsAIResponding(false)
                        }
                    }
                },
                (error: any) => {
                    console.error('❌ [SSE] Error:', error)
                    setIsAIResponding(false)
                },
                () => {
                    console.log('✅ [SSE] Connection opened successfully for conversation:', conversationId)
                }
            )

            console.log('🎯 [SSE] EventSource created, setting state')
            setSseEventSource(eventSource)
        } catch (error) {
            console.error('🚫 [SSE] Failed to connect:', error)
            setIsAIResponding(false)
        }
    }

    // Disconnect from SSE
    const disconnectFromSSE = () => {
        if (sseEventSource) {
            console.log('🔴 [SSE] Disconnecting existing SSE connection...')
            disconnectFromChatSSE(sseEventSource)
            setSseEventSource(null)
            console.log('🛑 [SSE] Disconnected successfully.')
        } else {
            console.log('⚠️ [SSE] No existing SSE connection to disconnect.')
        }
    }

    // Ensure SSE connection when active conversation changes
    useEffect(() => {
        if (activeConversationId && !sseEventSource) {
            console.log('🔗 [Auto-Connect] Connecting SSE for active conversation:', activeConversationId)
            connectToSSE(activeConversationId)
        }
    }, [activeConversationId, sseEventSource])

    // Cleanup SSE on unmount
    useEffect(() => {
        return () => {
            console.log('🛑 [Cleanup] Hook unmounting, disconnecting SSE')
            disconnectFromSSE()
        }
    }, [])

    return {
        sseEventSource,
        connectToSSE,
        disconnectFromSSE,
        setIsAIResponding,
    }
}
