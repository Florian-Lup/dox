import { NodeViewWrapper } from '@tiptap/react'
import { useCallback, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { Button } from '@/components/ui/Button'
import { Panel, PanelHeadline } from '@/components/ui/Panel'
import { Textarea } from '@/components/ui/Textarea'
import { Icon } from '@/components/ui/Icon'
import { tones } from '@/lib/constants'

import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { Toolbar } from '@/components/ui/Toolbar'
import { Surface } from '@/components/ui/Surface'
import { DropdownButton } from '@/components/ui/Dropdown'

type Tone = {
  value: string
  label: string
}

export interface DataProps {
  text: string
  tone?: string
}

export const AiWriterView = () => {
  const [data, setData] = useState<DataProps>({
    text: '',
    tone: undefined,
  })
  const [isDisabled, setIsDisabled] = useState(false)
  const currentTone = tones.find(t => t.value === data.tone)
  const textareaId = useMemo(() => uuid(), [])

  const handleClick = useCallback(() => {
    // AI Writer functionality is currently disabled
    setIsDisabled(true)
  }, [])

  const onTextAreaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(prevData => ({ ...prevData, text: e.target.value }))
  }, [])

  const onUndoClick = useCallback(() => {
    setData(prevData => ({ ...prevData, tone: undefined }))
  }, [])

  const createItemClickHandler = useCallback((tone: Tone) => {
    return () => {
      setData(prevData => ({ ...prevData, tone: tone.value }))
    }
  }, [])

  return (
    <NodeViewWrapper data-drag-handle>
      <Panel noShadow className="w-full">
        <div className="flex flex-col p-1">
          <div className="flex flex-row items-center justify-between gap-1">
            <PanelHeadline asChild>
              <label htmlFor={textareaId}>Prompt</label>
            </PanelHeadline>
          </div>
          <Textarea
            id={textareaId}
            value={data.text}
            onChange={onTextAreaChange}
            placeholder={'AI features are currently disabled'}
            required
            disabled
            className="mb-2"
          />
          <div className="flex flex-row items-center justify-between gap-1">
            <div className="flex justify-between w-auto gap-1">
              <Dropdown.Root>
                <Dropdown.Trigger asChild>
                  <Button variant="tertiary" disabled>
                    <Icon name="Mic" />
                    {currentTone?.label || 'Change tone'}
                    <Icon name="ChevronDown" />
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Portal>
                  <Dropdown.Content side="bottom" align="start" asChild>
                    <Surface className="p-2 min-w-[12rem] max-h-[200px] overflow-y-auto">
                      {!!data.tone && (
                        <>
                          <Dropdown.Item asChild>
                            <DropdownButton disabled onClick={onUndoClick}>
                              <Icon name="Undo2" />
                              Reset
                            </DropdownButton>
                          </Dropdown.Item>
                          <Toolbar.Divider horizontal />
                        </>
                      )}
                      {tones.map(tone => (
                        <Dropdown.Item asChild key={tone.value}>
                          <DropdownButton disabled onClick={createItemClickHandler(tone)}>
                            {tone.label}
                          </DropdownButton>
                        </Dropdown.Item>
                      ))}
                    </Surface>
                  </Dropdown.Content>
                </Dropdown.Portal>
              </Dropdown.Root>
            </div>
            <Button variant="primary" onClick={handleClick} style={{ whiteSpace: 'nowrap' }} disabled>
              <Icon name="Sparkles" />
              Generate text (Coming Soon)
            </Button>
          </div>
        </div>
      </Panel>
    </NodeViewWrapper>
  )
}
