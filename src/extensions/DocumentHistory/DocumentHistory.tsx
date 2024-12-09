import { memo, useState, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '../../components/ui/Icon'
import { Toolbar } from '../../components/ui/Toolbar'
import { VersionModal } from './VersionModal'
import { renderDate } from './utils'
import type { Version } from './VersionModal'

interface StorageVersion {
  version: number
  timestamp: number
  title: string
  content: string
}

export const DocumentHistory = memo(({ editor }: { editor: Editor }) => {
  const [versionName, setVersionName] = useState('')
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  const handleCreateVersion = useCallback(() => {
    if (!editor || !versionName.trim()) return
    const timestamp = Date.now()
    editor.commands.saveVersion(versionName.trim())
    const versions = editor.storage.collabHistory.versions || []
    const latestVersion = versions[versions.length - 1]
    if (latestVersion) {
      latestVersion.title = versionName.trim()
      latestVersion.timestamp = timestamp
    }
    setVersionName('')
  }, [editor, versionName])

  const handleShowHistory = useCallback(() => {
    setIsHistoryModalOpen(true)
  }, [])

  const handleCloseHistory = useCallback(() => {
    setIsHistoryModalOpen(false)
  }, [])

  const handleVersionNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVersionName(e.target.value)
  }, [])

  const handleRestoreVersion = useCallback(
    (version: Version) => {
      if (!editor) return
      setIsHistoryModalOpen(false)
      editor.commands.revertToVersion(Number(version.id))
    },
    [editor],
  )

  const versions = editor?.storage.collabHistory?.versions || []
  const formattedVersions = [...versions].reverse().map(
    (version: StorageVersion): Version => ({
      id: String(version.version),
      name: version.title || `Version ${version.version}`,
      date: renderDate(version.timestamp || Date.now()),
      content: version.content,
    }),
  )

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
        versions={formattedVersions}
        onRestore={handleRestoreVersion}
      />
    </>
  )
})

DocumentHistory.displayName = 'DocumentHistory'
