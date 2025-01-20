import { memo, useState, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import * as Toast from '@radix-ui/react-toast'
import { Icon } from '../../components/ui/Icon'
import { VersionModal } from './VersionModal'
import { renderDate } from './utils'
import type { Version } from './VersionModal'
import { Menu } from '@/components/ui/PopoverMenu'
import * as Popover from '@radix-ui/react-popover'
import { Toolbar } from '@/components/ui/Toolbar'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

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
  const [isOpen, setIsOpen] = useState(false)
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
    setShowToast(true) // Show success toast
  }, [editor, versionName])

  const handleShowHistory = useCallback(() => {
    setIsHistoryModalOpen(true)
  }, [])

  const handleCloseHistory = useCallback(() => {
    setIsHistoryModalOpen(false)
  }, [])

  const handleVersionNameChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <Menu
        trigger={
          <Toolbar.Button tooltip="Document History" variant="ghost">
            <Icon name="History" />
          </Toolbar.Button>
        }
        tooltip="Document History"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="p-4 space-y-3 w-72">
          <div>
            <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">Document History</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Create and manage versions</p>
          </div>
          <div className="space-y-3">
            <Textarea
              value={versionName}
              onChange={handleVersionNameChange}
              placeholder="Version name"
              className="min-h-[36px] max-h-[36px] py-1.5 rounded-md resize-none"
            />
            <div className="flex gap-2">
              <Popover.Close asChild>
                <Button
                  onClick={handleCreateVersion}
                  disabled={!versionName.trim()}
                  variant="secondary"
                  className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </Button>
              </Popover.Close>
              <Popover.Close asChild>
                <Button onClick={handleShowHistory} variant="secondary" className="flex-1">
                  View History
                </Button>
              </Popover.Close>
            </div>
          </div>
        </div>
      </Menu>

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
