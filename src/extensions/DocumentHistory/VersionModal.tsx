import { memo, useCallback, useState, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Icon } from '../../components/ui/Icon'

export interface Version {
  id: string
  name: string
  date: string
  content: string
  isActive?: boolean
}

interface VersionModalProps {
  isOpen: boolean
  onClose: () => void
  versions: Version[]
  onRestore: (version: Version) => void
  currentVersion?: number
}

export const VersionModal = memo(({ isOpen, onClose, versions, onRestore }: VersionModalProps) => {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(versions[0] || null)
  const versionRefs = useRef<Record<string, HTMLDivElement>>({})

  const handleVersionSelect = useCallback((version: Version) => {
    setSelectedVersion(version)
  }, [])

  const handleRestore = useCallback(
    (version: Version) => {
      onRestore(version)
    },
    [onRestore],
  )

  const getVersionClickHandler = useCallback(
    (version: Version) => {
      return (e: React.MouseEvent<HTMLDivElement>) => handleVersionSelect(version)
    },
    [handleVersionSelect],
  )

  const getRestoreClickHandler = useCallback(
    (version: Version) => {
      return (e: React.MouseEvent<HTMLButtonElement>) => handleRestore(version)
    },
    [handleRestore],
  )

  const getVersionRef = useCallback((version: Version) => {
    return (element: HTMLDivElement | null) => {
      if (element) {
        versionRefs.current[version.id] = element
      } else {
        delete versionRefs.current[version.id]
      }
    }
  }, [])

  const renderVersion = useCallback(
    (version: Version) => (
      <div
        key={version.id}
        ref={getVersionRef(version)}
        className={`p-2 rounded border ${
          version.isActive
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
            : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
        } cursor-pointer group`}
        onClick={getVersionClickHandler(version)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4
              className={`font-medium text-sm ${
                version.isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-900 dark:text-neutral-100'
              }`}
            >
              {version.name}
            </h4>
            <p className="text-xs text-neutral-500">{version.date}</p>
          </div>
          <button
            onClick={getRestoreClickHandler(version)}
            className={`text-xs px-2 py-1 rounded-md ${
              version.isActive
                ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900/70 text-blue-600 dark:text-blue-400'
                : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400'
            } font-medium transition-colors group-hover:ring-1 group-hover:ring-blue-400 dark:group-hover:ring-blue-500`}
          >
            <span className="flex items-center gap-1">
              <Icon name="History" className="w-3 h-3" />
              Restore
            </span>
          </button>
        </div>
      </div>
    ),
    [getVersionClickHandler, getRestoreClickHandler, getVersionRef],
  )

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-[90vw] lg:w-[900px] h-[80vh] lg:h-[600px] max-w-[1200px] bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 md:p-6 z-[150]">
          <Dialog.Title className="sr-only">Document History</Dialog.Title>
          <Dialog.Description className="sr-only">
            View and restore previous versions of your document
          </Dialog.Description>

          <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 pt-8 lg:pt-0">
            {/* Left side - Preview */}
            <div className="flex-1 lg:border-r border-neutral-200 dark:border-neutral-800 lg:pr-6">
              <div className="h-[200px] lg:h-full overflow-auto">
                <div className="prose dark:prose-invert max-w-none">
                  {selectedVersion?.content || 'No content to preview'}
                </div>
              </div>
            </div>

            {/* Right side - Versions list */}
            <div className="w-full lg:w-72">
              <h3 className="text-lg font-medium mb-3 text-neutral-900 dark:text-neutral-100">Versions</h3>
              <div className="h-[250px] lg:h-[calc(100%-6rem)] overflow-auto pr-2 space-y-2">
                {versions.map(renderVersion)}
              </div>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
})

VersionModal.displayName = 'VersionModal'
