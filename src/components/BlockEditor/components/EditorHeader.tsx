import { Icon } from '@/components/ui/Icon'
import { EditorInfo } from './EditorInfo'
import { EditorUser } from '../types'
import { WebSocketStatus } from '@hocuspocus/provider'
import { Toolbar } from '@/components/ui/Toolbar'
import { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'

export type EditorHeaderProps = {
  isSidebarOpen?: boolean
  toggleSidebar?: () => void
  editor: Editor
  collabState: WebSocketStatus
  users: EditorUser[]
}

export const EditorHeader = ({ editor, collabState, users, isSidebarOpen, toggleSidebar }: EditorHeaderProps) => {
  const { characters, words, limit } = useEditorState({
    editor,
    selector: ctx => {
      const characterCount = ctx.editor?.storage.characterCount
      return {
        characters: characterCount?.characters?.() ?? 0,
        words: characterCount?.words?.() ?? 0,
        limit: characterCount?.limit ?? 5000,
      }
    },
  })

  return (
    <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800">
      <div className="flex flex-row gap-x-1.5 items-center">
        <div className="flex items-center gap-x-1.5">
          <Toolbar.Button
            tooltip={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            onClick={toggleSidebar}
            active={isSidebarOpen}
            className={isSidebarOpen ? 'bg-transparent' : ''}
          >
            <Icon name={isSidebarOpen ? 'PanelLeftClose' : 'PanelLeft'} />
          </Toolbar.Button>
        </div>
      </div>
      <EditorInfo characters={characters} words={words} limit={limit} collabState={collabState} users={users} />
    </div>
  )
}
