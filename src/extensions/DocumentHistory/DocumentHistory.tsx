import { memo, useState, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '../../components/ui/Icon'
import { Toolbar } from '../../components/ui/Toolbar'
import { VersionModal } from './VersionModal'

// Mock data for versions - replace with actual data later
const mockVersions = [
  {
    id: '1',
    name: 'Initial version',
    date: '2024-01-20 10:00',
    content: 'Initial content of the document',
  },
  {
    id: '2',
    name: 'Second draft',
    date: '2024-01-20 11:30',
    content: 'Updated content with more details',
  },
]

export const DocumentHistory = memo(({ editor }: { editor: Editor }) => {
  const [versionName, setVersionName] = useState('')
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  const handleCreateVersion = useCallback(() => {
    // TODO: Implement version creation logic
    console.log('Creating version:', versionName)
    setVersionName('')
  }, [versionName])

  const handleShowHistory = useCallback(() => {
    setIsHistoryModalOpen(true)
  }, [])

  const handleCloseHistory = useCallback(() => {
    setIsHistoryModalOpen(false)
  }, [])

  const handleVersionNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVersionName(e.target.value)
  }, [])

  const handleRestoreVersion = useCallback((version: any) => {
    // TODO: Implement restore logic
    console.log('Restoring version:', version)
  }, [])

  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Toolbar.Button tooltip="Document History">
            <Icon name="History" className="w-5 h-5" />
          </Toolbar.Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-[150] w-80 p-4 ml-2 bg-white rounded-lg shadow-lg dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 animate-in fade-in-0 zoom-in-95"
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

      <VersionModal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistory}
        versions={mockVersions}
        onRestore={handleRestoreVersion}
      />
    </>
  )
})

DocumentHistory.displayName = 'DocumentHistory'
