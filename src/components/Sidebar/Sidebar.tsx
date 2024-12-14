import { memo } from 'react'
import { Editor } from '@tiptap/react'
import { TableOfContentsButton } from '@/extensions/TableOfContents'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '../ui/Icon'
import { Toolbar } from '../ui/Toolbar'
import { DocumentHistory } from '../../extensions/DocumentHistory'

export const Sidebar = memo(({ editor }: { editor: Editor }) => {
  return (
    <div className="flex gap-0.5">
      <TableOfContentsButton editor={editor} />

      <DocumentHistory editor={editor} />

      <Popover.Root>
        <Popover.Trigger asChild>
          <Toolbar.Button tooltip="Comments">
            <Icon name="MessageSquareText" className="w-5 h-5" />
          </Toolbar.Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-[150] w-80 p-4 ml-2 bg-white rounded-lg shadow-lg dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 animate-in fade-in-0 zoom-in-95"
            sideOffset={15}
            alignOffset={-20}
            align="end"
          >
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">Comments</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">View and manage comments</p>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {/* Comments will be rendered here */}
                <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">No comments yet</div>
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
})

Sidebar.displayName = 'Sidebar'
