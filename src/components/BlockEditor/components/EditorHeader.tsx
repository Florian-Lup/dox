import { Icon } from '@/components/ui/Icon'
import { EditorInfo } from './EditorInfo'
import { EditorUser } from '../types'
import { WebSocketStatus } from '@hocuspocus/provider'
import { Editor } from '@tiptap/core'
import { Sidebar } from '@/components/Sidebar'
import { ComposerButton } from '@/components/aiComposer/ComposerButton'
import { useCallback } from 'react'
import { useCharacterCount } from '@/extensions/CharacterCounter'

export type EditorHeaderProps = {
  editor: Editor
  collabState: WebSocketStatus
  users: EditorUser[]
  onDrawerOpenChange: (isOpen: boolean) => void
}

export const EditorHeader = ({ editor, collabState, users, onDrawerOpenChange }: EditorHeaderProps) => {
  const { characters, words, limit } = useCharacterCount(editor)

  const handleAIAssistantClick = useCallback(() => {
    onDrawerOpenChange(true)
  }, [onDrawerOpenChange])

  return (
    <header className="flex flex-row items-center h-12 sm:h-14 px-2 sm:px-4 md:px-6 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800 z-[9999] relative">
      {/* Left section with Sidebar */}
      <div className="flex-none sm:flex-1 flex items-center">
        <Sidebar editor={editor} />
      </div>

      {/* Mobile AI button */}
      <div className="flex-1 flex sm:hidden items-center pl-2.5">
        <ComposerButton onClick={handleAIAssistantClick} />
      </div>

      {/* Center section with AI button (desktop only) */}
      <div className="hidden sm:flex flex-none">
        <ComposerButton onClick={handleAIAssistantClick} />
      </div>

      {/* Right section */}
      <div className="flex-1 flex justify-end">
        <EditorInfo characters={characters} words={words} limit={limit} collabState={collabState} users={users} />
      </div>
    </header>
  )
}
