'use client'

import { Editor as CoreEditor } from '@tiptap/core'
import { memo } from 'react'
import { TableOfContentsStorage } from '@tiptap-pro/extension-table-of-contents'
import { cn } from '@/lib/utils'
import { useEditorState } from '@tiptap/react'

export type TableOfContentsProps = {
  editor: CoreEditor
  onItemClick?: () => void
  className?: string
}

export const TableOfContents = memo(({ editor, onItemClick, className }: TableOfContentsProps) => {
  const content = useEditorState({
    editor,
    selector: ctx => (ctx.editor.storage.tableOfContents as TableOfContentsStorage).content,
  })

  return (
    <>
      <div className="mb-2 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
        Table of contents
      </div>
      {content.length > 0 ? (
        <div className="flex flex-col gap-1">
          {content.map(item => (
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
          ))}
        </div>
      ) : (
        <div className="text-sm text-neutral-500">Start adding headlines to your document …</div>
      )}
    </>
  )
})

TableOfContents.displayName = 'TableOfContents'
