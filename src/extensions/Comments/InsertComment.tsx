import * as Popover from '@radix-ui/react-popover'
import { Icon } from '@/components/ui/Icon'
import { Toolbar } from '@/components/ui/Toolbar'
import { Surface } from '@/components/ui/Surface'
import { Editor } from '@tiptap/react'
import { useState, useCallback, ChangeEvent } from 'react'

export const InsertComment = ({ editor }: { editor: Editor }) => {
  const [comment, setComment] = useState('')

  const handleCommentChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }, [])

  const handleSendComment = useCallback(() => {
    // TODO: Implement comment sending logic
    setComment('')
  }, [])

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button tooltip="Comment">
          <Icon name="MessageSquareText" />
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="top" sideOffset={8} asChild>
          <Surface className="p-3 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Add a comment..."
                className="w-[280px] h-24 px-2 py-1.5 text-sm rounded border border-neutral-200 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-500 resize-none"
              />
              <button
                onClick={handleSendComment}
                className="self-end px-3 py-1.5 text-sm rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
              >
                Send
              </button>
            </div>
          </Surface>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
