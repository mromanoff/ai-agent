import type { OpenAI } from 'openai';
import {generateImage, generateImageToolDefinition} from './tools/generateImage'
import {reddit, redditToolDefinition} from './tools/reddit'
import {dadJoke, dadJokeToolDefenition} from './tools/dadJoke'


export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  try {
    // Parse tool arguments with error handling
    let parsedArgs
    try {
      parsedArgs = JSON.parse(toolCall.function.arguments || '{}')
    } catch (parseError) {
      throw new Error(`Invalid tool arguments: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
    }

    const input = {
      userMessage,
      toolArgs: parsedArgs
    }

    // Execute the appropriate tool
    switch(toolCall.function.name) {
      case generateImageToolDefinition.name:
        return await generateImage(input)

      case redditToolDefinition.name:
        return await reddit(input)

      case dadJokeToolDefenition.name:
        return await dadJoke(input)

      default:
        throw new Error(`Unknown tool: ${toolCall.function.name}. Available tools: generate_image, reddit, dad_joke`)
    }
  } catch (error) {
    throw new Error(`Tool '${toolCall.function.name}' failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}