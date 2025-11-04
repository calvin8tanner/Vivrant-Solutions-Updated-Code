export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  chatId: string
}

export interface Chat {
  id: string
  title: string
  userId: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}

export interface ChatSettings {
  model: 'gpt-4' | 'gpt-3.5-turbo'
  temperature: number
  maxTokens: number
  systemPrompt?: string
}

export interface VoiceCallSettings {
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  model: 'tts-1' | 'tts-1-hd'
  speed: number
  language: string
}

export interface VoiceCall {
  id: string
  userId: string
  audioUrl: string
  transcript: string
  duration: number
  status: 'scheduled' | 'in-progress' | 'completed' | 'failed'
  settings: VoiceCallSettings
  createdAt: Date
  completedAt?: Date
}

export interface ChatResponse {
  id: string
  message: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}