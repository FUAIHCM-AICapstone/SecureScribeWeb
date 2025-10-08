/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'

import { makeStyles } from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { ChatInterface } from './ChatInterface'
import { MessageInput } from './MessageInput'
import { ConversationTabs } from './ConversationTabs'
import { useConversationManager } from '../../hooks/useConversationManager'
import { useSSEManager } from '../../hooks/useSSEManager'

interface ChatClientWrapperProps {
    // No props needed for standalone version
}

const useStyles = makeStyles({
    root: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column'
    },
    content: {
        flex: 1,
    }
})

export default function ChatClientWrapper({ }: ChatClientWrapperProps) {
    const styles = useStyles()

    // Use custom hooks for state management
    const conversationManager = useConversationManager()
    useSSEManager(conversationManager.activeConversationId, conversationManager.setIsAIResponding)

    // State for tab list key forcing re-render
    const [tabListKey, setTabListKey] = useState<number>(0)

    // Force TabList re-render when activeConversationId changes
    useEffect(() => {
        if (conversationManager.activeConversationId) {
            setTabListKey(prev => prev + 1)
        }
    }, [conversationManager.activeConversationId])

    // Destructure values from conversation manager
    const {
        conversations,
        messages,
        conversationsLoading,
        conversationLoading,
        isSendingMessage,
        isDeletingConversation,
        isRenamingConversation,
        handleConversationChange,
        handleSendMessage,
        handleCreateConversation,
        handleDeleteConversation,
        handleRenameConversation,
    } = conversationManager

    return (
        <div className={styles.root}>
            {/* Conversation Tabs Header */}
            <ConversationTabs
                key={tabListKey}
                conversations={conversations}
                conversationsLoading={conversationsLoading}
                activeConversationId={conversationManager.activeConversationId}
                onConversationChange={handleConversationChange}
                onCreateConversation={handleCreateConversation}
                onDeleteConversation={handleDeleteConversation}
                onRenameConversation={handleRenameConversation}
                isDeletingConversation={isDeletingConversation}
                isRenamingConversation={isRenamingConversation}
            />

            {/* Chat Interface */}
            <div className={styles.content}>
                {conversations && conversations.length > 0 ? (
                    <ChatInterface
                        activeConversationId={conversationManager.activeConversationId}
                        messages={messages}
                        isLoading={conversationLoading}
                        isTyping={conversationManager.isTyping}
                        isAIResponding={conversationManager.isAIResponding}
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
                        isAIResponding={false}
                        error={null}
                        onOpenMobileSidebar={() => { }}
                    />
                )}
            </div>

            {/* Input Area */}
            <div style={{ padding: '0' }}>
                <MessageInput
                    onSendMessage={handleSendMessage}
                    isLoading={isSendingMessage}
                    canSendMessage={Boolean(conversationManager.activeConversationId) && !isSendingMessage}
                    placeholder={isSendingMessage ? "Sending message..." : "Type your message..."}
                />
            </div>
        </div>
    )
}
