import 'dotenv/config'
import { runAgent } from './src/agent'
import { tools } from './src/tools'

const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

try {
  await runAgent({userMessage, tools})
} catch (error) {
  console.error('\n❌ Error running agent:', error instanceof Error ? error.message : String(error))
  process.exit(1)
}
