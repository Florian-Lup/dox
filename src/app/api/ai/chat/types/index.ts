export interface ChatRequest {
  message: string
  modelName: string
  temperature?: number
  sessionId: string
}

export interface ChatResponse {
  error?: string
}

export interface MessageTags {
  tags: string[]
}
