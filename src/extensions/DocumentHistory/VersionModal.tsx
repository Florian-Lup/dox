import { memo, useCallback, useState, useRef, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Icon } from '../../components/ui/Icon'
import { watchPreviewContent } from '@tiptap-pro/extension-collaboration-history'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

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
  editor: Editor
}

export const VersionModal = memo(({ isOpen, onClose, versions, onRestore, editor }: VersionModalProps) => {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const versionRefs = useRef<Record<string, HTMLDivElement>>({})
  const [previewContent, setPreviewContent] = useState<string>('')

  const previewEditor = useEditor({
    extensions: [StarterKit],
    editable: false,
    content: selectedVersion?.content || '',
    immediatelyRender: false,
    onCreate: ({ editor: previewEditorInstance }) => {
      if (selectedVersion?.content) {
        previewEditorInstance.commands.setContent(selectedVersion.content)
      }
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none',
      },
    },
  })

  const getProvider = useCallback(() => {
    if (!editor) {
      return null
    }

    const provider = editor.storage.collaboration?.provider
    return provider || null
  }, [editor])

  useEffect(() => {
    if (isOpen && versions.length > 0) {
      const latestVersion = versions[0]
      setSelectedVersion(latestVersion)

      const provider = getProvider()
      if (provider) {
        provider.sendStateless(
          JSON.stringify({
            action: 'version.preview',
            version: Number(latestVersion.id),
          }),
        )
      } else {
        if (previewEditor && latestVersion.content) {
          previewEditor.commands.setContent(latestVersion.content)
        }
      }
    }
  }, [isOpen, versions, getProvider, previewEditor])

  useEffect(() => {
    const provider = getProvider()
    if (!provider) {
      return
    }

    const unwatch = watchPreviewContent(provider, content => {
      if (previewEditor) {
        previewEditor.commands.setContent(content)
      }
    })

    return () => {
      unwatch?.()
    }
  }, [getProvider, previewEditor])

  const handleVersionSelect = useCallback(
    (version: Version) => {
      setSelectedVersion(version)

      const provider = getProvider()
      if (provider) {
        provider.sendStateless(
          JSON.stringify({
            action: 'version.preview',
            version: Number(version.id),
          }),
        )
      } else {
        previewEditor?.commands.setContent(version.content)
      }
    },
    [getProvider, previewEditor],
  )

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
          selectedVersion?.id === version.id
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
            : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
        } cursor-pointer group`}
        onClick={getVersionClickHandler(version)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4
              className={`font-medium text-sm ${
                selectedVersion?.id === version.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-neutral-900 dark:text-neutral-100'
              }`}
            >
              {version.name}
            </h4>
            <p className="text-xs text-neutral-500">{version.date}</p>
          </div>
          <button
            onClick={getRestoreClickHandler(version)}
            className={`text-xs px-2 py-1 rounded-md ${
              selectedVersion?.id === version.id
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
    [getVersionClickHandler, getRestoreClickHandler, getVersionRef, selectedVersion],
  )

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[5%] sm:top-1/2 left-1/2 -translate-x-1/2 sm:-translate-y-1/2 w-[95vw] h-[90vh] sm:h-[85vh] lg:h-[80vh] max-h-[800px] max-w-[1200px] bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 p-3 sm:p-4 md:p-6 z-[100] overflow-hidden">
          <Dialog.Title className="sr-only">Document History</Dialog.Title>
          <Dialog.Description className="sr-only">
            View and restore previous versions of your document
          </Dialog.Description>

          <div className="flex flex-col lg:flex-row h-full gap-3 sm:gap-4 lg:gap-6 pt-8 lg:pt-0">
            {/* Left side - Preview */}
            <div className="flex-1 lg:border-r border-neutral-200 dark:border-neutral-800 lg:pr-6">
              <div className="h-[35vh] sm:h-[40vh] lg:h-full overflow-y-auto">
                <div className="prose dark:prose-invert max-w-none [&_.ProseMirror]:!p-0 [&_.ProseMirror]:!pt-0">
                  <EditorContent editor={previewEditor} />
                </div>
              </div>
            </div>

            {/* Right side - Versions list */}
            <div className="w-full lg:w-80 flex flex-col min-h-0">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-neutral-900 dark:text-neutral-100 flex-shrink-0">
                Versions
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 min-h-0">{versions.map(renderVersion)}</div>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              <Icon name="X" className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
})

VersionModal.displayName = 'VersionModal'
