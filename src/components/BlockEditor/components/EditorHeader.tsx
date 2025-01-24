import { Icon } from '@/components/ui/Icon'
import { EditorInfo } from './EditorInfo'
import { EditorUser } from '../types'
import { WebSocketStatus } from '@hocuspocus/provider'
import { Editor } from '@tiptap/core'
import { Sidebar } from '@/components/Sidebar'
import { StudioButton } from '@/components/AiStudio/StudioButton'
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
    <header className="flex flex-row items-center h-12 sm:h-14 px-2.5 sm:px-4 md:px-5 text-black bg-white border border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800 z-[9999] relative mx-auto mt-2 sm:mt-4 rounded-lg w-[calc(100%-16px)] sm:w-[calc(100%-32px)] max-w-[625px] gap-3 sm:gap-4">
      {/* Left section with Sidebar */}
      <div className="flex items-center">
        <Sidebar editor={editor} />
      </div>

      {/* Center section with AI button */}
      <div className="w-[44px] flex items-center justify-center">
        <div className="transform hover:scale-[1.02] transition-transform">
          <StudioButton onClick={handleAIAssistantClick} />
        </div>
      </div>

      {/* Right section */}
      <div className="flex-1 flex items-center justify-end">
        <EditorInfo characters={characters} words={words} limit={limit} collabState={collabState} users={users} />
      </div>
    </header>
  )
}
