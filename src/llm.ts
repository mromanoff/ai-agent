import { openai } from './ai'
import type { AIMessage } from '../types.ts'
import { zodFunction } from 'openai/helpers/zod'
import { systemPrompt } from './systemPrompt'

export const runLLM = async ({ messages, tools }: { messages: AIMessage[], tools: any[] }) => {
  try {
    const formattedTools = tools.map(zodFunction)

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      tools: formattedTools,
      tool_choice: 'auto',
      parallel_tool_calls: false
    })

    if (!response.choices || response.choices.length === 0) {
      throw new Error('OpenAI API returned no choices')
    }

    return response.choices[0].message
  } catch (error) {
    if (error instanceof Error) {
      // Enhance error messages for common issues
      if (error.message.includes('401')) {
        throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env')
      }
      if (error.message.includes('429')) {
        throw new Error('OpenAI API rate limit exceeded. Please wait and try again.')
      }
      if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
        throw new Error('Network error: Could not connect to OpenAI API. Check your internet connection.')
      }
    }
    throw error
  }
}
