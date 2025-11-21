import type { ToolFn } from '../../types'
import { z } from 'zod'
import fetch from 'node-fetch'

export const redditToolDefinition = {
  name: 'reddit',
  parameters: z.object({}),
  description: 'get the latest post from Reddit'
}

type Args = z.infer<typeof redditToolDefinition.parameters>

export const reddit: ToolFn<Args, string> = async({toolArgs}) => {
  try {
    const response = await fetch('https://www.reddit.com/r/aww/.json')

    if (!response.ok) {
      throw new Error(`Reddit API returned status ${response.status}: ${response.statusText}`)
    }

    const json = await response.json() as any

    if (!json.data || !json.data.children) {
      throw new Error('Unexpected Reddit API response format')
    }

    const {data} = json

    const relevantInfo = data.children.map((child: any) => ({
      title: child.data.title,
      link: child.data.url,
      subreddit: child.data.subreddit_name_prefixed,
      author: child.data.author,
      upvotes: child.data.ups
    }))

    return JSON.stringify(relevantInfo, null, 2)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
        throw new Error('Could not connect to Reddit. Check your internet connection.')
      }
    }
    throw error
  }
}