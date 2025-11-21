import { generateImageToolDefinition } from './generateImage.ts'
import { redditToolDefinition } from './reddit.ts'
import { dadJokeToolDefenition } from './dadJoke.ts'

export const tools = [
  generateImageToolDefinition,
  redditToolDefinition,
  dadJokeToolDefenition
]