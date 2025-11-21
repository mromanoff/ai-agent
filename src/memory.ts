import { JSONFilePreset } from 'lowdb/node'
import type { AIMessage } from '../types'
import { v4 as uuidv4 } from 'uuid'

export type MessageWithMedata = AIMessage & {
  id: string
  createdAt: string
}

type Data = {
  messages: MessageWithMedata[]
}

export const addMetadata = (message: AIMessage) => {
  return {
    ...message,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }
}

export const removeMetadata = (message: MessageWithMedata) => {
  const {id, createdAt, ...rest} = message
  return rest
}


const defaultData: Data = {
  messages: []
}

export const getDb = async () => {
  try {
    return await JSONFilePreset<Data>('db.json', defaultData)
  } catch (error) {
    throw new Error(`Failed to access database: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export const addMessages = async (messages: AIMessage[]) => {
  try {
    const db = await getDb()
    db.data.messages.push(...messages.map(addMetadata))
    await db.write()
  } catch (error) {
    throw new Error(`Failed to save messages: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export const getMessages = async () => {
  try {
    const db = await getDb()
    return db.data.messages.map(removeMetadata)
  } catch (error) {
    throw new Error(`Failed to retrieve messages: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export const saveToolResponse = (toolCallId: string, toolResponse: string) => {
  return  addMessages([{
    role: 'tool',
    content: toolResponse,
    tool_call_id: toolCallId
  }])
}