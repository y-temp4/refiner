import { Configuration, OpenAIApi } from 'openai'

import { env } from '~/env.mjs'

const configuration = new Configuration({ apiKey: env.OPENAI_API_KEY })
export const openai = new OpenAIApi(configuration)

export async function generateImprovedCode(code: string) {
  const CHAT_GPT_SYSTEM_PROMPT = `Refactor the code passed to you.
Only return code, following format.
\`\`\`\${extension}
{code}
\`\`\`\
`
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: CHAT_GPT_SYSTEM_PROMPT },
      { role: 'user', content: code },
    ],
    temperature: 0.6,
  })
  const content = completion.data.choices[0]?.message?.content ?? ''
  const generatedCode = content.match(/```.*?\n([\s\S]*?)\n```/)?.[1] ?? content
  const langCode =
    content
      .match(/```.*?\n([\s\S]*?)\n```/)?.[0]
      .split('\n')[0]
      ?.split('```')[1] ?? ''
  return { generatedCode, langCode }
}
