import { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate } from '@langchain/core/prompts'

// Prompt for summarizing conversation history
export const summarizePrompt = PromptTemplate.fromTemplate(`
Summarize the following conversation in a concise way. Focus on key points and decisions made.
Keep the summary under 200 words.

Conversation:
{conversation}

Summary:`)

// Prompt for tagging messages
export const tagPrompt = PromptTemplate.fromTemplate(`
Analyze this message and provide up to 3 relevant tags. Tags should be single words or short phrases
that capture the main topics, intents, or emotions in the message.
Respond with ONLY the tags, separated by commas.

Message:
{message}

Tags:`)

// Main chat prompt
export const chatPrompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
])
