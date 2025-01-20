import { memo } from 'react'
import { Editor } from '@tiptap/react'
import { TableOfContentsButton } from '@/extensions/TableOfContents'
import { DocumentHistory } from '../../extensions/DocumentHistory'
import { DocumentImportButton } from '@/extensions/DocumentImport'
import { DocumentExportButton } from '@/extensions/DocumentExport'
import { Toolbar } from '@/components/ui/Toolbar'

export const Sidebar = memo(({ editor }: { editor: Editor }) => {
  return (
    <Toolbar.Wrapper>
      <TableOfContentsButton editor={editor} />
      <DocumentHistory editor={editor} />
      <DocumentImportButton editor={editor} />
      <DocumentExportButton editor={editor} />
    </Toolbar.Wrapper>
  )
})

Sidebar.displayName = 'Sidebar'
