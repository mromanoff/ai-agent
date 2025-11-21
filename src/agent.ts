import { addMessages, getMessages, saveToolResponse } from './memory'
import { runLLM } from './llm'
import { showLoader, logMessage } from './ui'
import { runTool } from './toolRunner'


export const runAgent = async (
  {userMessage, tools}: {
    userMessage: string, tools: any[]
  }) => {
  let loader

  try {
    await addMessages([{ role: 'user', content: userMessage }])

    loader = showLoader('Thinking...')

    let iterations = 0
    const MAX_ITERATIONS = 20

    while (iterations < MAX_ITERATIONS) {
      iterations++

      try {
        const history = await getMessages()
        const response = await runLLM({ messages: history, tools })
        await addMessages([response])

        if(response.content) {
          loader.stop()
          logMessage(response)
          return getMessages()
        }

        if (response.tool_calls) {
          const toolCall = response.tool_calls[0]
          logMessage(response)
          loader.update(`executing ${toolCall.function.name}`)

          try {
            const toolResponse = await runTool(toolCall, userMessage)
            await saveToolResponse(toolCall.id, toolResponse)
            loader.update(`done: ${toolCall.function.name}`)
          } catch (toolError) {
            const errorMessage = `Tool execution failed: ${toolError instanceof Error ? toolError.message : String(toolError)}`
            console.error(`\n⚠️  ${errorMessage}`)
            await saveToolResponse(toolCall.id, errorMessage)
            loader.update(`error in ${toolCall.function.name}`)
          }
        }
      } catch (iterationError) {
        loader?.stop()
        throw new Error(`Agent iteration ${iterations} failed: ${iterationError instanceof Error ? iterationError.message : String(iterationError)}`)
      }
    }

    loader?.stop()
    throw new Error(`Agent exceeded maximum iterations (${MAX_ITERATIONS}). Possible infinite loop.`)
  } catch (error) {
    loader?.stop()
    throw error
  }
}