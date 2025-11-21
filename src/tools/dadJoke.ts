import { z } from 'zod';
import type { ToolFn } from '../../types.ts'
import fetch from 'node-fetch';

export const dadJokeToolDefenition = {
  name: 'dad_joke',
  parameters: z.object({}),
  description: 'get a dad joke'
}

type Args = z.infer<typeof dadJokeToolDefenition.parameters>

export const dadJoke: ToolFn<Args, string> = async({toolArgs}) => {
  try {
    const res = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!res.ok) {
      throw new Error(`Dad joke API returned status ${res.status}: ${res.statusText}`)
    }

    const json = await res.json() as any

    if (!json.joke) {
      throw new Error('Unexpected dad joke API response format')
    }

    return json.joke.replace(/<[^>]*>/g, '')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
        throw new Error('Could not connect to dad joke API. Check your internet connection.')
      }
    }
    throw error
  }
}