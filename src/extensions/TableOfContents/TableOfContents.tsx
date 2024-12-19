'use client'

import { Editor as CoreEditor } from '@tiptap/core'
import { memo } from 'react'
import { TableOfContentsStorage } from '@tiptap-pro/extension-table-of-contents'
import { cn } from '@/lib/utils'
import { useEditorState } from '@tiptap/react'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '@/components/ui/Icon'
import { Toolbar } from '@/components/ui/Toolbar'

export type TableOfContentsProps = {
  editor: CoreEditor
  onItemClick?: () => void
  className?: string
}

const TableOfContentsList = memo(({ editor, onItemClick, className }: TableOfContentsProps) => {
  const content = useEditorState({
    editor,
    selector: ctx => (ctx.editor.storage.tableOfContents as TableOfContentsStorage).content,
  })

  return (
    <>
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">Table of Contents</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Navigate through document sections</p>
        </div>
        <div className="flex flex-col gap-1">
          {content.length > 0 ? (
            content.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                style={{
                  paddingLeft: `${1 * item.level}rem`,
                  width: `calc(100% - ${(item.level - 1) * 1}rem)`,
                }}
                onClick={onItemClick}
                className={cn(
                  'block font-medium text-neutral-500 dark:text-neutral-300 p-1 rounded bg-opacity-10 text-sm hover:text-neutral-900 dark:hover:text-neutral-50 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 truncate',
                  item.isActive && 'text-neutral-900 bg-neutral-100 dark:text-neutral-50 dark:bg-neutral-800',
                  className,
                )}
              >
                {item.itemIndex}. {item.textContent}
              </a>
            ))
          ) : (
            <div className="text-sm text-neutral-500">Start adding headlines to your document …</div>
          )}
        </div>
      </div>
    </>
  )
})

export const TableOfContentsButton = memo(({ editor }: { editor: CoreEditor }) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button tooltip="Table of contents">
          <Icon name="BetweenHorizontalStart" className="w-5 h-5" />
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-[150] w-80 p-4 ml-2 bg-white rounded-lg shadow-lg dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 animate-in fade-in-0 zoom-in-95"
          sideOffset={15}
          alignOffset={-20}
          align="end"
        >
          <div className="max-h-[400px] overflow-y-auto">
            <TableOfContentsList editor={editor} className="hover:bg-neutral-100 dark:hover:bg-neutral-700" />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
})

TableOfContentsList.displayName = 'TableOfContentsList'
TableOfContentsButton.displayName = 'TableOfContentsButton'

export const TableOfContents = TableOfContentsList
