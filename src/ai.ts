import OpenAI from 'openai'

// Validate API key exists
if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    'OPENAI_API_KEY is not set. Please create a .env file with your OpenAI API key.\n' +
    'See .env.example for reference.'
  )
}

export const openai = new OpenAI()
