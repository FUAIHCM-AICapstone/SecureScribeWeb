import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
    ConversationResponse,
    ChatConversationResponse,
    ChatMessageResponse,
    ChatMessageCreate
} from '../types/chat.type'
import {
    createConversation,
    getConversations,
    getConversation,
    sendChatMessage,
    updateConversation,
    deleteConversation,
} from '../services/api/chat'

interface UseConversationManagerReturn {
    // State
    activeConversationId: string | null
    isTyping: boolean
    isAIResponding: boolean
    hasAutoSelected: boolean

    // Data
    conversations?: ConversationResponse[]
    activeConversationResponse?: ChatConversationResponse
    messages: ChatMessageResponse[]

    // Loading states
    conversationsLoading: boolean
    conversationLoading: boolean
    isSendingMessage: boolean
    isDeletingConversation: boolean
    isRenamingConversation: boolean

    // Actions
    setActiveConversationId: (id: string | null) => void
    handleConversationChange: (conversationId: string) => void
    handleSendMessage: (payload: ChatMessageCreate) => void
    handleCreateConversation: () => void
    handleDeleteConversation: (conversationId: string, e?: React.MouseEvent) => void
    handleRenameConversation: (conversationId: string, title: string) => void

    // SSE related
    setIsTyping: (typing: boolean) => void
    setIsAIResponding: (responding: boolean) => void
}

export function useConversationManager(): UseConversationManagerReturn {
    const queryClient = useQueryClient()

    // State for UI interactions
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const [isAIResponding, setIsAIResponding] = useState<boolean>(false)
    const [hasAutoSelected, setHasAutoSelected] = useState<boolean>(false)

    // Reset states when switching conversations
    useEffect(() => {
        setIsTyping(false)
        setIsAIResponding(false)
    }, [activeConversationId])

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
            console.log('✅ [Create Conversation] Conversation created:', newConversation?.id)

            // Invalidate conversations list to refetch
            queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })

            // Set as active
            if (newConversation) {
                console.log('🔄 [Create Conversation] Setting as active:', newConversation.id)
                setActiveConversationId(newConversation.id)
                setHasAutoSelected(true) // Mark as auto-selected
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
                message_type: 'user',
                content: payload.content,
                created_at: new Date().toISOString(),
                mentions: payload.mentions,
            }

            // Optimistically update the cache
            queryClient.setQueryData(
                ['chat', 'conversations', conversationId],
                (oldData: ChatConversationResponse | undefined) => {
                    if (!oldData) return oldData

                    // Ensure messages is an array
                    const currentMessages = Array.isArray(oldData.messages) ? oldData.messages : []

                    return {
                        ...oldData,
                        messages: [...currentMessages, optimisticUserMessage],
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

                        // Ensure messages is an array
                        const currentMessages = Array.isArray(oldData.messages) ? oldData.messages : []

                        const messagesWithoutOptimistic = currentMessages.filter(
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

            // Show error to user (you might want to use a toast notification here)
            console.error('Failed to send message:', error)

            // Reset typing states
            setIsTyping(false)
            setIsAIResponding(false)
        },
    })

    const deleteConversationMutation = useMutation({
        mutationFn: deleteConversation,
        onSuccess: (_, conversationId) => {
            console.log('🗑️ [Delete Conversation] Conversation deleted:', conversationId)

            // Remove conversation from cache
            const updatedConversations = queryClient.setQueryData(['chat', 'conversations'], (oldData: ConversationResponse[] | undefined) => {
                if (!oldData) return oldData
                return oldData.filter(conv => conv.id !== conversationId)
            })

            // If deleted conversation was active, switch to another one
            if (activeConversationId === conversationId) {
                const remainingConversations = Array.isArray(updatedConversations) ? updatedConversations : []
                if (remainingConversations.length > 0) {
                    console.log('🔄 [Delete Conversation] Switching to remaining conversation:', remainingConversations[0].id)
                    setActiveConversationId(remainingConversations[0].id)
                } else {
                    console.log('📭 [Delete Conversation] No conversations left, setting to null')
                    setActiveConversationId(null)
                    setHasAutoSelected(false) // Reset auto-select flag when no conversations left
                }
            }
        },
    })

    const renameConversationMutation = useMutation({
        mutationFn: ({ conversationId, title }: { conversationId: string; title: string }) =>
            updateConversation(conversationId, { title }),
        onSuccess: (updatedConversation, { conversationId, title }) => {
            // Update conversation in cache
            queryClient.setQueryData(['chat', 'conversations'], (oldData: ConversationResponse[] | undefined) => {
                if (!oldData) return oldData
                return oldData.map(conv =>
                    conv.id === conversationId
                        ? { ...conv, title }
                        : conv
                )
            })
        },
        onError: (error) => {
            console.error('Failed to rename conversation:', error)
        },
    })

    // Use API data directly
    const messages = activeConversationResponse?.messages || []

    // Get specific loading states for better UX
    const isSendingMessage = sendMessageMutation.isPending
    const isDeletingConversation = deleteConversationMutation.isPending
    const isRenamingConversation = renameConversationMutation.isPending

    // Auto-select first conversation when conversations load (only once)
    useEffect(() => {
        if (conversations && conversations.length > 0 && activeConversationId === null && !hasAutoSelected) {
            console.log('🔄 [Auto-Select] No active conversation, selecting first available:', conversations[0].id)
            setActiveConversationId(conversations[0].id)
            setHasAutoSelected(true)
        }
    }, [conversations, activeConversationId, hasAutoSelected])

    // Ensure conversation is always selected when conversations exist (handle edge cases)
    useEffect(() => {
        if (conversations && conversations.length > 0 && activeConversationId) {
            // Check if current activeConversationId exists in conversations list
            const currentConversationExists = conversations.some(conv => conv.id === activeConversationId)

            if (!currentConversationExists) {
                console.log('🔄 [Auto-Select] Active conversation not found in list, selecting first available:', conversations[0].id)
                setActiveConversationId(conversations[0].id)
            }
        }
    }, [conversations, activeConversationId])

    // Handle conversation selection
    const handleConversationChange = (conversationId: string) => {
        console.log('🔄 [Conversation Change] Changing to conversation:', conversationId)

        // Set new active conversation
        setActiveConversationId(conversationId)

        // Ensure conversation data is fetched
        queryClient.invalidateQueries({ queryKey: ['chat', 'conversations', conversationId] })
    }

    // Handle sending new message
    const handleSendMessage = (payload: ChatMessageCreate) => {
        if (!activeConversationId || isSendingMessage) {
            console.log('⚠️ [Send Message] Cannot send message - no active conversation or already sending')
            return
        }

        console.log('📤 [Send Message] Sending message for conversation:', activeConversationId)
        setIsTyping(true)
        setIsAIResponding(true) // AI will start responding

        sendMessageMutation.mutate({
            conversationId: activeConversationId,
            payload,
        }, {
            onSettled: () => {
                setIsTyping(false)
                // Keep isAIResponding true until we receive the AI response via SSE
            }
        })
    }

    // Create a new conversation and focus it
    const handleCreateConversation = () => {
        console.log('🆕 [Create Conversation] Creating new conversation')
        createConversationMutation.mutate({
            title: 'New conversation'
        })
    }

    // Handle conversation deletion
    const handleDeleteConversation = (conversationId: string, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation()
            e.preventDefault()
        }

        console.log('🗑️ [Delete Conversation] Request to delete conversation:', conversationId)
        if (window.confirm('Are you sure you want to delete this conversation?')) {
            deleteConversationMutation.mutate(conversationId)
        } else {
            console.log('❌ [Delete Conversation] User cancelled deletion')
        }
    }

    // Handle conversation rename
    const handleRenameConversation = (conversationId: string, title: string) => {
        console.log('✏️ [Rename Conversation] Renaming conversation:', conversationId, 'to:', title)
        renameConversationMutation.mutate({
            conversationId,
            title
        })
    }

    return {
        // State
        activeConversationId,
        isTyping,
        isAIResponding,
        hasAutoSelected,

        // Data
        conversations,
        activeConversationResponse,
        messages,

        // Loading states
        conversationsLoading,
        conversationLoading,
        isSendingMessage,
        isDeletingConversation,
        isRenamingConversation,

        // Actions
        setActiveConversationId,
        handleConversationChange,
        handleSendMessage,
        handleCreateConversation,
        handleDeleteConversation,
        handleRenameConversation,

        // SSE related
        setIsTyping,
        setIsAIResponding,
    }
}
