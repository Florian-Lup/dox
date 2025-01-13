import { memo, useState, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import * as Toast from '@radix-ui/react-toast'
import { Icon } from '../../components/ui/Icon'
import { VersionModal } from './VersionModal'
import { renderDate } from './utils'
import type { Version } from './VersionModal'
import { SidebarButton } from '@/components/Sidebar/SidebarButton'

// Generate a short unique ID (6 characters)
const generateShortId = () => {
  return Math.random().toString(36).substring(2, 8)
}

interface StorageVersion {
  version: number
  date: number
  name: string
  content: string
}

export const DocumentHistory = memo(({ editor }: { editor: Editor }) => {
  const [versionName, setVersionName] = useState('')
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleCreateVersion = useCallback(() => {
    if (!editor || !versionName.trim()) return

    // Create version metadata
    const versionData = {
      name: versionName.trim(),
      date: Date.now(),
      content: editor.getHTML(),
    }

    // Save version with metadata in the name field
    editor.commands.saveVersion(JSON.stringify(versionData))

    setVersionName('')
    setIsPopoverOpen(false) // Close the popover
    setShowToast(true) // Show success toast
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

      // Create restore version metadata
      const restoreMetadata = {
        name: generateShortId(),
        date: Date.now(),
        content: version.content,
      }

      editor.commands.revertToVersion(Number(version.id), JSON.stringify(restoreMetadata))
    },
    [editor],
  )

  const versions = editor?.storage.collabHistory?.versions || []
  const currentVersion = editor?.storage.collabHistory?.currentVersion

  const formattedVersions = [...versions].reverse().map((version: StorageVersion): Version => {
    let versionData
    try {
      versionData = JSON.parse(version.name)
    } catch (e) {
      versionData = {
        name: version.version === 0 ? 'Initial version' : `Version ${version.version}`,
        date: version.date,
        content: version.content,
      }
    }

    return {
      id: String(version.version),
      name: versionData.name,
      date: renderDate(versionData.date),
      content: versionData.content,
      isActive: currentVersion === version.version,
    }
  })

  return (
    <>
      <SidebarButton
        tooltip="Document History"
        icon="History"
        title="Document History"
        description="Create and manage versions"
        isOpen={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
      >
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
      </SidebarButton>

      <VersionModal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistory}
        versions={formattedVersions}
        onRestore={handleRestoreVersion}
        currentVersion={currentVersion}
        editor={editor}
      />

      <Toast.Provider>
        <Toast.Root
          className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4 items-center fixed bottom-4 left-4 z-[9999] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-left-full"
          open={showToast}
          onOpenChange={setShowToast}
          duration={3000}
        >
          <Toast.Title className="text-sm font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
            <Icon name="Check" className="w-4 h-4" />
            Version created successfully
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 left-0 z-[9999] m-4" />
      </Toast.Provider>
    </>
  )
})

DocumentHistory.displayName = 'DocumentHistory'
