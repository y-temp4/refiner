import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'

import { env } from '~/env.mjs'

const configuration = new Configuration({ apiKey: env.OPENAI_API_KEY })
export const openai = new OpenAIApi(configuration)

export async function generateImprovedCode(code: string) {
  const CHAT_GPT_SYSTEM_PROMPT = `Refactor the code passed to you.
Your response should be in JSON format with two parameters 'langCode' and 'code'`
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: CHAT_GPT_SYSTEM_PROMPT,
      },
      { role: ChatCompletionRequestMessageRoleEnum.User, content: code },
    ],
    temperature: 0.6,
  })
  function parseJSON<T>(text: string): T | { error: string } {
    try {
      const response: T = JSON.parse(text)
      return response
    } catch {
      return {
        error: text ?? 'Unknown error.',
      }
    }
  }
  const response = parseJSON<{ langCode: string; code: string }>(
    completion.data.choices[0]?.message?.content ?? ''
  )
  if ('error' in response) {
    return {
      langCode: 'txt',
      generatedCode: response.error,
    }
  }
  return { generatedCode: response.code, langCode: response.langCode }
}
