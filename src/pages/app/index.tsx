import {
  ActionIcon,
  Button,
  Flex,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import Editor from '@monaco-editor/react'
import { encode } from '@nem035/gpt-3-encoder'
import { IconClipboardCopy, IconQuestionCircle } from '@tabler/icons-react'
import cn from 'classnames'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import { useState } from 'react'

import { AppLayout } from '~/components/layouts/AppLayout'
import { useCurrentUserStore } from '~/store/currentUser'
import { api } from '~/utils/api'
import {
  FREE_USAGE_LIMIT,
  MAX_CODE_PROMPT_TOKEN_COUNT,
  programmingLanguageList,
} from '~/utils/constant'

export default function AppIndex() {
  const [code, setCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const defaultCopyTooltipLabel = 'Copy to clipboard'
  const [copyTooltipLabel, setCopyTooltipLabel] = useState(
    defaultCopyTooltipLabel
  )
  const [programmingLanguageCode, setProgrammingLanguageCode] = useState<
    string | null
  >('typescript')
  const openaiImproveMutation = api.openai.improve.useMutation()
  const { currentUser, setCurrentUser } = useCurrentUserStore()
  const tokenCount = encode(code).length
  if (!currentUser) return null
  const overFreeUsage = FREE_USAGE_LIMIT <= currentUser?.freeUseCount
  const overCodePromptTokenCount = MAX_CODE_PROMPT_TOKEN_COUNT < tokenCount

  const EDITOR_HEIGHT = 'calc(100vh - 250px)'

  async function handleGenerate() {
    if (
      openaiImproveMutation.isLoading ||
      !code ||
      overFreeUsage ||
      overCodePromptTokenCount
    ) {
      return
    }
    openaiImproveMutation.mutate(
      { code },
      {
        async onSuccess(data) {
          setGeneratedCode(data.generatedCode)
          const session = await getSession()
          setCurrentUser(session?.user ?? null)
        },
        onError(e) {
          alert(e.message ?? 'Code generation failed.')
          console.error(e)
        },
      }
    )
  }
  async function handleCopy(value: string) {
    function execCopy(text: string) {
      const temp = document.createElement('div')
      temp.appendChild(document.createElement('pre')).textContent = text
      const s = temp.style
      s.position = 'fixed'
      s.left = '-100%'
      document.body.appendChild(temp)
      document.getSelection()?.selectAllChildren(temp)
      const result = document.execCommand('copy')
      document.body.removeChild(temp)
      return result
    }
    execCopy(value)
    setCopyTooltipLabel('Copied!')
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setCopyTooltipLabel(defaultCopyTooltipLabel)
  }
  const placeholder = `// Please write the code you wish to refactor.`
  const handleEditorOnChange = (value: string | undefined) => {
    setCode(value ?? '')
    const placeholderElement = document.querySelector(
      '.monaco-placeholder'
    ) as HTMLElement | null
    if (!placeholderElement) return
    placeholderElement.style.display = !value ? 'block' : 'none'
  }
  const handleEditorOnMount = () => {
    const placeholderElement = document.querySelector(
      '.monaco-placeholder'
    ) as HTMLElement | null
    if (!placeholderElement) return
    placeholderElement.style.display = 'block'
  }

  return (
    <>
      <Head>
        <title>App | Refiner</title>
      </Head>
      <div>
        <Flex direction={{ base: 'column', md: 'row' }}>
          {/* FIXME: */}
          <Stack
            sx={{
              width: '49vw',
              '@media (max-width: 64rem)': {
                width: '100vw',
              },
            }}
          >
            <div className="h-8"></div>
            <div style={{ position: 'relative' }}>
              <Editor
                height={EDITOR_HEIGHT}
                language={programmingLanguageCode ?? ''}
                value={code}
                defaultValue=""
                theme="vs-dark"
                onChange={handleEditorOnChange}
                options={{ fontSize: 14, wordWrap: 'on' }}
                onMount={handleEditorOnMount}
              />
              <div
                className="monaco-placeholder"
                style={{
                  position: 'absolute',
                  display: 'none',
                  whiteSpace: 'pre-wrap',
                  top: 0,
                  left: 67,
                  color: 'white',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  fontFamily: `Menlo, Monaco, "Courier New", monospace`,
                  fontSize: 14,
                }}
              >
                {placeholder}
              </div>
              <div
                className={cn(
                  'absolute rounded-md bg-black px-2 py-1 font-mono text-xs',
                  overCodePromptTokenCount && 'text-red-400'
                )}
                style={{ right: 24, bottom: 10 }}
              >
                {tokenCount} / {MAX_CODE_PROMPT_TOKEN_COUNT} tokens
              </div>
            </div>
            <Flex className="gap-3 p-4" align="center">
              <Select
                searchable
                value={programmingLanguageCode}
                onChange={setProgrammingLanguageCode}
                data={programmingLanguageList.map((v) => ({
                  value: v.code,
                  label: v.label,
                }))}
              />
              <Button
                onClick={() => handleGenerate()}
                disabled={
                  openaiImproveMutation.isLoading ||
                  !code ||
                  overFreeUsage ||
                  overCodePromptTokenCount
                }
                loading={openaiImproveMutation.isLoading}
              >
                {!openaiImproveMutation.isLoading
                  ? 'Generate'
                  : 'Generating...'}
              </Button>
              {overFreeUsage && <div>Free usage limit reached.</div>}
            </Flex>
          </Stack>
          {/* FIXME: */}
          <Stack
            sx={{
              width: '49vw',
              '@media (max-width: 64rem)': {
                width: '100vw',
              },
            }}
          >
            <Flex className="h-8" justify="center">
              {generatedCode && (
                <Tooltip
                  label={copyTooltipLabel}
                  color={
                    defaultCopyTooltipLabel === copyTooltipLabel
                      ? undefined
                      : 'blue'
                  }
                  withArrow
                >
                  <ActionIcon onClick={() => handleCopy(generatedCode)}>
                    <IconClipboardCopy />
                  </ActionIcon>
                </Tooltip>
              )}
            </Flex>
            <Editor
              height={EDITOR_HEIGHT}
              language={programmingLanguageCode ?? ''}
              defaultValue=""
              theme="vs-dark"
              value={generatedCode}
              options={{ fontSize: 14, wordWrap: 'on', readOnly: true }}
            />
          </Stack>
        </Flex>
        <Flex gap={4} align="center" p={10}>
          <IconQuestionCircle />
          <Text fz="sm">
            Did something go wrong, please report it in{' '}
            <a href="https://github.com/y-temp4/refiner/issues" target="_blank">
              Issues on GitHub
            </a>
            .
          </Text>
        </Flex>
      </div>
    </>
  )
}

AppIndex.getLayout = function getLayout(page: React.ReactNode) {
  return <AppLayout>{page}</AppLayout>
}
