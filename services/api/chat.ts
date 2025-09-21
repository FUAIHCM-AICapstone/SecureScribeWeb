
import type {
    ConversationListRequest,
    ConversationResponse,
    CreateConversationRequest,
    MessageListRequest,
    MessageResponse,
    SendMessageRequest,
    SendMessageResponse,
    UpdateConversationRequest
} from 'types/chat.type'
import type { Pagination, CommonResponse, PaginationMeta } from 'types/common.type'

// Mock data generators
const generateMockId = () => `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const generateMockTimestamp = () => new Date().toISOString()

const createMockConversation = (name: string, id?: string): ConversationResponse => ({
    id: id || generateMockId(),
    name,
    message_count: Math.floor(Math.random() * 20) + 1,
    last_activity: generateMockTimestamp(),
    create_date: generateMockTimestamp(),
    update_date: generateMockTimestamp()
})

const createMockMessage = (conversationId: string, role: 'user' | 'assistant', content: string, id?: string): MessageResponse => ({
    id: id || generateMockId(),
    conversation_id: conversationId,
    role,
    content,
    timestamp: generateMockTimestamp()
})

const createMockPagination = <T>(data: T[], page: number = 1, limit: number = 10): PaginationMeta => ({
    page,
    limit,
    total: data.length,
    total_pages: Math.ceil(data.length / limit),
    has_next: page < Math.ceil(data.length / limit),
    has_prev: page > 1
})

class ChatApi {
    private mockConversations: ConversationResponse[] = [
        createMockConversation('General Chat', 'conv-1'),
        createMockConversation('Project Discussion', 'conv-2'),
        createMockConversation('Bug Reports', 'conv-3'),
        createMockConversation('Feature Requests', 'conv-4'),
        createMockConversation('Documentation', 'conv-5')
    ]

    private mockMessages: { [conversationId: string]: MessageResponse[] } = {
        'conv-1': [
            createMockMessage('conv-1', 'user', 'Hello, how can I help you today?', 'msg-1'),
            createMockMessage('conv-1', 'assistant', 'I\'m here to assist you with any questions or tasks you have. What would you like to work on?', 'msg-2'),
            createMockMessage('conv-1', 'user', 'I need help with a React component', 'msg-3'),
            createMockMessage('conv-1', 'assistant', 'I can help you with React components! What specific component are you working on?', 'msg-4')
        ],
        'conv-2': [
            createMockMessage('conv-2', 'user', 'Let\'s discuss the new project architecture', 'msg-5'),
            createMockMessage('conv-2', 'assistant', 'Great! I\'d be happy to discuss the project architecture. What aspects would you like to focus on?', 'msg-6')
        ]
    }

    // ============================================
    // CONVERSATION MANAGEMENT
    // ============================================

    async getConversations(params: ConversationListRequest = {}): Promise<CommonResponse<Pagination<ConversationResponse>>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300))

        let filteredConversations = [...this.mockConversations]

        // Apply search filter
        if (params.search) {
            filteredConversations = filteredConversations.filter(conv =>
                conv.name.toLowerCase().includes(params.search!.toLowerCase())
            )
        }

        // Apply ordering
        if (params.order_by) {
            filteredConversations.sort((a, b) => {
                const aValue = a[params.order_by as keyof ConversationResponse]
                const bValue = b[params.order_by as keyof ConversationResponse]

                // Handle undefined values
                if (aValue == null && bValue == null) return 0
                if (aValue == null) return params.order_direction === 'desc' ? 1 : -1
                if (bValue == null) return params.order_direction === 'desc' ? -1 : 1

                if (params.order_direction === 'desc') {
                    return aValue < bValue ? 1 : -1
                }
                return aValue > bValue ? 1 : -1
            })
        }

        const page = 1
        const limit = 10
        const pagination = createMockPagination(filteredConversations, page, limit)

        return {
            success: true,
            message: 'Conversations retrieved successfully',
            data: {
                data: filteredConversations,
                pagination
            }
        }
    }

    async createConversation(data: CreateConversationRequest): Promise<CommonResponse<ConversationResponse>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const newConversation = createMockConversation(data.name)

        // Add initial message if provided
        if (data.initial_message) {
            const userMessage = createMockMessage(newConversation.id, 'user', data.initial_message)
            const aiMessage = createMockMessage(newConversation.id, 'assistant', `I understand you want to discuss: "${data.initial_message}". How can I help you with this?`)

            this.mockMessages[newConversation.id] = [userMessage, aiMessage]
            newConversation.message_count = 2
        } else {
            this.mockMessages[newConversation.id] = []
        }

        this.mockConversations.push(newConversation)

        return {
            success: true,
            message: 'Conversation created successfully',
            data: newConversation
        }
    }

    async getConversation(conversationId: string): Promise<CommonResponse<ConversationResponse>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200))

        const conversation = this.mockConversations.find(conv => conv.id === conversationId)

        if (!conversation) {
            return {
                success: false,
                message: 'Conversation not found',
                data: null as any,
                errors: ['Conversation not found']
            }
        }

        return {
            success: true,
            message: 'Conversation retrieved successfully',
            data: conversation
        }
    }

    async updateConversation(conversationId: string, data: UpdateConversationRequest): Promise<CommonResponse<ConversationResponse>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300))

        const conversationIndex = this.mockConversations.findIndex(conv => conv.id === conversationId)

        if (conversationIndex === -1) {
            return {
                success: false,
                message: 'Conversation not found',
                data: null as any,
                errors: ['Conversation not found']
            }
        }

        // Update the conversation
        if (data.name) {
            this.mockConversations[conversationIndex].name = data.name
            this.mockConversations[conversationIndex].update_date = generateMockTimestamp()
        }

        return {
            success: true,
            message: 'Conversation updated successfully',
            data: this.mockConversations[conversationIndex]
        }
    }

    async deleteConversation(conversationId: string): Promise<CommonResponse<null>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300))

        const conversationIndex = this.mockConversations.findIndex(conv => conv.id === conversationId)

        if (conversationIndex === -1) {
            return {
                success: false,
                message: 'Conversation not found',
                data: null,
                errors: ['Conversation not found']
            }
        }

        // Remove conversation and its messages
        this.mockConversations.splice(conversationIndex, 1)
        delete this.mockMessages[conversationId]

        return {
            success: true,
            message: 'Conversation deleted successfully',
            data: null
        }
    }

    // ============================================
    // MESSAGE MANAGEMENT
    // ============================================

    async getConversationMessages(conversationId: string, params: MessageListRequest = {}): Promise<CommonResponse<Pagination<MessageResponse>>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200))

        const messages = this.mockMessages[conversationId] || []

        if (!this.mockConversations.find(conv => conv.id === conversationId)) {
            return {
                success: false,
                message: 'Conversation not found',
                data: null as any,
                errors: ['Conversation not found']
            }
        }

        // Apply pagination
        const limit = params.limit || 20
        const page = 1
        const startIndex = 0
        const endIndex = Math.min(startIndex + limit, messages.length)
        const paginatedMessages = messages.slice(startIndex, endIndex)

        const pagination = createMockPagination(messages, page, limit)

        return {
            success: true,
            message: 'Messages retrieved successfully',
            data: {
                data: paginatedMessages,
                pagination
            }
        }
    }

    async sendMessage(data: SendMessageRequest): Promise<CommonResponse<SendMessageResponse>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))

        if (!this.mockConversations.find(conv => conv.id === data.conversation_id)) {
            return {
                success: false,
                message: 'Conversation not found',
                data: null as any,
                errors: ['Conversation not found']
            }
        }

        // Create user message
        const userMessage = createMockMessage(data.conversation_id, 'user', data.content)

        // Generate AI response based on user message
        const aiResponse = this.generateAIResponse(data.content)
        const aiMessage = createMockMessage(data.conversation_id, 'assistant', aiResponse)

        // Add messages to conversation
        if (!this.mockMessages[data.conversation_id]) {
            this.mockMessages[data.conversation_id] = []
        }
        this.mockMessages[data.conversation_id].push(userMessage, aiMessage)

        // Update conversation's last activity and message count
        const conversation = this.mockConversations.find(conv => conv.id === data.conversation_id)
        if (conversation) {
            conversation.last_activity = generateMockTimestamp()
            conversation.message_count = this.mockMessages[data.conversation_id].length
            conversation.update_date = generateMockTimestamp()
        }

        return {
            success: true,
            message: 'Message sent successfully',
            data: {
                user_message: userMessage,
                ai_message: aiMessage
            }
        }
    }

    private generateAIResponse(userMessage: string): string {
        const responses = [
            "I understand your question. Let me help you with that.",
            "That's an interesting point. Here's what I think...",
            "Great question! Based on what you've shared, I suggest...",
            "I can see you're working on something important. Let me provide some guidance.",
            "Thanks for sharing that. Here's my perspective on this topic.",
            "That's a complex topic. Let me break it down for you.",
            "I appreciate you bringing this up. Here's what I recommend.",
            "Good point! Let me elaborate on that for you."
        ]

        // Simple keyword-based responses
        if (userMessage.toLowerCase().includes('error') || userMessage.toLowerCase().includes('bug')) {
            return "I see you're encountering an error. Let me help you debug this. Can you share more details about the error message and when it occurs?"
        }

        if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('how')) {
            return "I'm here to help! I can assist you with coding, debugging, architecture design, and many other development tasks. What specific area would you like assistance with?"
        }

        if (userMessage.toLowerCase().includes('react') || userMessage.toLowerCase().includes('component')) {
            return "React is a great framework! I can help you with component design, state management, hooks, performance optimization, and best practices. What specific React topic are you working on?"
        }

        return responses[Math.floor(Math.random() * responses.length)]
    }
}

const chatApi = new ChatApi()
export default chatApi
