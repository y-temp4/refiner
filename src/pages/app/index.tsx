import { ActionIcon, Button, Flex, Select, Stack, Tooltip } from '@mantine/core'
import Editor from '@monaco-editor/react'
import { IconClipboardCopy } from '@tabler/icons-react'
import { useState } from 'react'

import { AppLayout } from '~/components/layouts/AppLayout'
import { api } from '~/utils/api'
import { programmingLanguageList } from '~/utils/constant'

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
  async function handleGenerate() {
    if (!code) return
    openaiImproveMutation.mutate(
      { code },
      {
        onSuccess(data) {
          setGeneratedCode(data.generatedCode)
        },
        onError(e) {
          alert('Code generation failed.')
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
  const EDITOR_HEIGHT = 'calc(100vh - 250px)'
  return (
    <div>
      <Flex>
        <Stack style={{ width: '49vw' }}>
          <div className="h-8"></div>
          <Editor
            height={EDITOR_HEIGHT}
            language={programmingLanguageCode ?? ''}
            value={code}
            defaultValue=""
            theme="vs-dark"
            onChange={(v) => {
              console.log(v)
              setCode(v ?? '')
            }}
            options={{ wordWrap: 'on' }}
          />
          <Flex className="gap-3 p-4">
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
              disabled={openaiImproveMutation.isLoading || code === ''}
              loading={openaiImproveMutation.isLoading}
            >
              {!openaiImproveMutation.isLoading ? 'Generate' : 'Generating...'}
            </Button>
          </Flex>
        </Stack>
        <Stack style={{ width: '49vw' }}>
          <Flex className="h-8" justify="center">
            {generatedCode && (
              <Tooltip
                label={copyTooltipLabel}
                color={
                  defaultCopyTooltipLabel === copyTooltipLabel
                    ? undefined
                    : 'blue'
                }
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
            options={{ wordWrap: 'on', readOnly: true }}
          />
        </Stack>
      </Flex>
    </div>
  )
}

AppIndex.getLayout = function getLayout(page: React.ReactNode) {
  return <AppLayout>{page}</AppLayout>
}
