import { memo } from 'react'
import { Editor } from '@tiptap/react'
import { TableOfContents } from '../TableOfContents'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '../ui/Icon'
import { Toolbar } from '../ui/Toolbar'
import { DocumentHistory } from '../../extensions/DocumentHistory'

export const Sidebar = memo(({ editor }: { editor: Editor }) => {
  return (
    <div className="flex gap-0.5">
      <Popover.Root>
        <Popover.Trigger asChild>
          <Toolbar.Button tooltip="Table of contents">
            <Icon name="BetweenHorizontalStart" className="w-5 h-5" />
          </Toolbar.Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-100 w-80 p-4 ml-2 bg-white rounded-lg shadow-lg dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 animate-in fade-in-0 zoom-in-95"
            sideOffset={15}
            alignOffset={-20}
            align="end"
          >
            <TableOfContents editor={editor} className="hover:bg-neutral-100 dark:hover:bg-neutral-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <DocumentHistory editor={editor} />
    </div>
  )
})

Sidebar.displayName = 'Sidebar'
