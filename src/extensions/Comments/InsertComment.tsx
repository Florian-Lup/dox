import * as Popover from '@radix-ui/react-popover'
import { Icon } from '@/components/ui/Icon'
import { Toolbar } from '@/components/ui/Toolbar'
import { Surface } from '@/components/ui/Surface'
import { Editor } from '@tiptap/react'
import { useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/Button'

export const InsertComment = ({ editor }: { editor: Editor }) => {
  const [comment, setComment] = useState('')

  const handleCommentChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value)
  }, [])

  const handleSendComment = useCallback(() => {
    // TODO: Implement comment sending logic
    setComment('')
  }, [])

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      handleSendComment()
    },
    [handleSendComment],
  )

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button tooltip="Comment">
          <Icon name="MessageSquareText" />
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="top" sideOffset={8} asChild>
          <Surface className="p-2">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={comment}
                onChange={handleCommentChange}
                placeholder="Add a comment..."
                spellCheck="false"
                autoComplete="off"
                className="flex-1 bg-neutral-100 dark:bg-neutral-900 outline-none min-w-[12rem] text-black text-sm dark:text-white p-2 rounded-lg"
              />
              <Button variant="primary" buttonSize="small" type="submit" disabled={!comment.trim()}>
                Send
              </Button>
            </form>
          </Surface>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
