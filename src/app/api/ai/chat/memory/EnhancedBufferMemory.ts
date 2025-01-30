import { BufferMemory } from 'langchain/memory'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from '@langchain/core/messages'
import { summarizePrompt, tagPrompt } from '../prompts'

const MESSAGE_COUNT_THRESHOLD = 10

// Helper function to format message for conversation text
const formatMessage = (message: BaseMessage) => {
  let role = 'System'
  if (message instanceof HumanMessage) role = 'User'
  if (message instanceof AIMessage) role = 'Assistant'
  return `${role}: ${message.content}`
}

export class EnhancedBufferMemory extends BufferMemory {
  private summarizer: RunnableSequence
  private tagger: RunnableSequence
  private model: any
  private messageCount: number = 0
  private sessionId: string

  constructor(model: any, options: any, sessionId: string) {
    super(options)
    this.model = model
    this.sessionId = sessionId

    // Initialize summarizer chain
    this.summarizer = RunnableSequence.from([
      {
        conversation: (input: any) => input,
      },
      summarizePrompt,
      this.model,
      new StringOutputParser(),
    ])

    // Initialize tagger chain
    this.tagger = RunnableSequence.from([
      {
        message: (input: any) => input,
      },
      tagPrompt,
      this.model,
      new StringOutputParser(),
    ])
  }

  async saveContext(inputValues: any, outputValues: any): Promise<void> {
    this.messageCount++

    try {
      // Get tags for the input message
      const tags = await this.tagger.invoke(inputValues.input)

      // Create enhanced messages with tags
      const enhancedInput = new HumanMessage({
        content: inputValues.input,
        additional_kwargs: { tags: tags.split(',').map((t: string) => t.trim()) },
      })

      const enhancedOutput = new AIMessage({
        content: outputValues.output,
        additional_kwargs: { tags: [] },
      })

      // Add to memory
      await super.saveContext({ input: enhancedInput }, { output: enhancedOutput })

      // Check if we need to summarize
      const memoryVariables = await this.loadMemoryVariables({})
      const chatHistory = memoryVariables.chat_history || []

      if (this.messageCount >= MESSAGE_COUNT_THRESHOLD) {
        // Summarize after threshold is reached
        const conversationText = chatHistory.map((msg: BaseMessage) => formatMessage(msg)).join('\n')
        const summary = await this.summarizer.invoke(conversationText)

        // Clear old messages and add summary as system message
        await this.clear()
        this.messageCount = 0
        await super.saveContext(
          { input: new SystemMessage(summary) },
          { output: new AIMessage('Summary processed and saved to memory') },
        )
      }
    } catch (error) {
      console.error('Error in saveContext:', error)
      throw error
    }
  }

  async loadMemoryVariables(inputs: any): Promise<{ [key: string]: any }> {
    return super.loadMemoryVariables(inputs)
  }
}
