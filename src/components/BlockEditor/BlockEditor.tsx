import { EditorContent } from '@tiptap/react'
import React, { useRef, useState, useCallback } from 'react'

import { LinkMenu } from '@/components/menus'

import { useBlockEditor } from '@/hooks/useBlockEditor'

import '@/styles/index.css'

import { EditorHeader } from './components/EditorHeader'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { ComposerPanel } from '@/components/aiComposer/ComposerPanel'
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@hocuspocus/provider'

export const BlockEditor = ({
  ydoc,
  provider,
}: {
  ydoc: Y.Doc | null
  provider?: TiptapCollabProvider | null | undefined
}) => {
  const menuContainerRef = useRef(null)
  const { editor, users, collabState } = useBlockEditor({ ydoc, provider })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  if (!editor || !users) {
    return null
  }

  return (
    <>
      <div className="flex h-full" ref={menuContainerRef}>
        <div className="relative flex flex-col flex-1 h-full overflow-hidden">
          <EditorHeader editor={editor} collabState={collabState} users={users} onDrawerOpenChange={setIsDrawerOpen} />
          <div className="flex-1 min-h-0 relative">
            <div className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-neutral-300 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600">
              <div
                className={`min-h-full transition-all duration-300 ease-in-out ${isDrawerOpen ? 'sm:mr-[400px]' : ''}`}
              >
                <EditorContent editor={editor} />
              </div>
            </div>
            <ContentItemMenu editor={editor} />
            <LinkMenu editor={editor} appendTo={menuContainerRef} />
            <TextMenu editor={editor} />
          </div>
        </div>
      </div>
      <ComposerPanel isOpen={isDrawerOpen} onClose={handleDrawerClose} />
    </>
  )
}

export default BlockEditor
