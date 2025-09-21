/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'

import { useEffect, useState } from 'react'
import { FluentProvider, teamsLightTheme, Dropdown, Option, Text } from '@fluentui/react-components'
import chatApi from '@/services/api/chat'
import { type Message, type Conversation } from 'types/chat.type'
import { ChatInterface } from './ChatInterface'

interface ChatClientWrapperProps {
    // No props needed for standalone version
}

export default function ChatClientWrapper({ }: ChatClientWrapperProps) {
    // Simplified state for standalone chat
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])

    // Load mock data on mount
    useEffect(() => {
        loadMockConversations()
    }, [])

    // Load mock conversations from chat API
    const loadMockConversations = async () => {
        try {
            const response = await chatApi.getConversations()
            if (response && response.data && response.data.data) {
                const mockConversations = response.data.data.map(conv => ({
                    id: conv.id,
                    name: conv.name,
                    messages: [],
                    lastActivity: new Date(conv.last_activity),
                    messageCount: conv.message_count
                }))
                setConversations(mockConversations)

                // Set first conversation as active
                if (mockConversations.length > 0) {
                    setActiveConversationId(mockConversations[0].id)
                    loadConversationMessages(mockConversations[0].id)
                }
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
    }

    return (
        <FluentProvider theme={teamsLightTheme}>
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Conversation Selector */}
                <div style={{ padding: '16px', borderBottom: '1px solid #e1e1e1' }}>
                    <Text size={500} weight="semibold" style={{ marginRight: '12px' }}>
                        Conversation:
                    </Text>
                    <Dropdown
                        value={conversations.find(c => c.id === activeConversationId)?.name || 'Select conversation'}
                        onOptionSelect={(_, data) => handleConversationChange(data.optionValue || '')}
                        style={{ minWidth: '200px' }}
                    >
                        {conversations.map(conv => (
                            <Option key={conv.id} value={conv.id}>
                                {conv.name}
                            </Option>
                        ))}
                    </Dropdown>
                </div>

                {/* Chat Interface */}
                <div style={{ flex: 1 }}>
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
