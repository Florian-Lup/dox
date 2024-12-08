import { memo, useState, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import { TableOfContents } from '../TableOfContents'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '../ui/Icon'
import { Toolbar } from '../ui/Toolbar'
import { Button } from '../ui/Button'

export const Sidebar = memo(({ editor }: { editor: Editor }) => {
  const [versionName, setVersionName] = useState('')

  const handleCreateVersion = useCallback(() => {
    // TODO: Implement version creation logic
    console.log('Creating version:', versionName)
    setVersionName('')
  }, [versionName])

  const handleShowHistory = useCallback(() => {
    // TODO: Implement show history logic
    console.log('Showing history')
  }, [])

  const handleVersionNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVersionName(e.target.value)
  }, [])

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
            className="z-50 w-80 p-4 ml-2 bg-white rounded-lg shadow-lg dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 animate-in fade-in-0 zoom-in-95"
            sideOffset={15}
            alignOffset={-20}
            align="end"
          >
            <TableOfContents editor={editor} className="hover:bg-neutral-100 dark:hover:bg-neutral-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger asChild>
          <Toolbar.Button tooltip="Document History">
            <Icon name="History" className="w-5 h-5" />
          </Toolbar.Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-50 w-80 p-4 ml-2 bg-white rounded-lg shadow-lg dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 animate-in fade-in-0 zoom-in-95"
            sideOffset={15}
            alignOffset={-20}
            align="end"
          >
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">Document History</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Create and manage versions</p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={versionName}
                  onChange={handleVersionNameChange}
                  placeholder="Version name"
                  className="w-full px-2 py-1.5 text-sm rounded border border-neutral-200 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateVersion}
                    disabled={!versionName.trim()}
                    className="flex-1 px-3 py-1.5 text-sm rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={handleShowHistory}
                    className="flex-1 px-3 py-1.5 text-sm rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    View History
                  </button>
                </div>
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
})

Sidebar.displayName = 'Sidebar'
