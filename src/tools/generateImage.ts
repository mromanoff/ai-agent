import type { ToolFn } from '../../types'
import { z } from 'zod'
import { openai } from '../ai'

export const generateImageToolDefinition = {
  name: 'generate_image',
  parameters: z.object({
    prompt: z.string().describe(`prompt for the image. Be sure to consider the user's original message when making the prompt. If you are unsure, then as the user to provide more details.`)
  }),
  description: 'generate an image based on the prompt'
}

type Args = z.infer<typeof generateImageToolDefinition.parameters>

export const generateImage: ToolFn<Args, string> = async({
 toolArgs,
 userMessage
}) => {
  try {
    if (!toolArgs.prompt || toolArgs.prompt.trim().length === 0) {
      throw new Error('Image prompt cannot be empty')
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: toolArgs.prompt,
      n: 1,
      size: '1024x1024',
    })

    if (!response.data || response.data.length === 0 || !response.data[0].url) {
      throw new Error('OpenAI did not return an image URL')
    }

    return response.data[0].url
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('safety')) {
        throw new Error('Image generation blocked by safety system. Please try a different prompt.')
      }
      if (error.message.includes('billing')) {
        throw new Error('OpenAI billing issue. Please check your account.')
      }
    }
    throw error
  }
}

