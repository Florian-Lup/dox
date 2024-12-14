import { memo } from 'react'
import { Editor } from '@tiptap/react'
import { TableOfContentsButton } from '@/extensions/TableOfContents'
import { DocumentHistory } from '../../extensions/DocumentHistory'
import { CommentList } from '@/extensions/Comments/CommentList'
import { DocumentImportButton } from '@/extensions/DocumentImport'

export const Sidebar = memo(({ editor }: { editor: Editor }) => {
  return (
    <div className="flex gap-0.5">
      <TableOfContentsButton editor={editor} />
      <DocumentHistory editor={editor} />
      <CommentList editor={editor} />
      <DocumentImportButton editor={editor} />
    </div>
  )
})

Sidebar.displayName = 'Sidebar'
