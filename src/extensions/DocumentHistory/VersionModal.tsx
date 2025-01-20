import { memo, useCallback, useState, useRef, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Icon } from '../../components/ui/Icon'
import { watchPreviewContent } from '@tiptap-pro/extension-collaboration-history'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Surface } from '@/components/ui/Surface'
import { Toolbar } from '@/components/ui/Toolbar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

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

const VersionItem = memo(
  ({
    version,
    isSelected,
    onClick,
    onRestore,
  }: {
    version: Version
    isSelected: boolean
    onClick: () => void
    onRestore: () => void
  }) => {
    const handleRestoreClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        onRestore()
      },
      [onRestore],
    )

    return (
      <Surface
        className={cn(
          'p-2 cursor-pointer group transition-colors',
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
            : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800',
        )}
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4
              className={cn(
                'font-medium text-sm',
                isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-900 dark:text-neutral-100',
              )}
            >
              {version.name}
            </h4>
            <p className="text-xs text-neutral-500">{version.date}</p>
          </div>
          <Button
            onClick={handleRestoreClick}
            variant="ghost"
            buttonSize="small"
            className={cn(
              'text-xs px-2 py-1',
              isSelected
                ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900/70 text-blue-600 dark:text-blue-400'
                : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400',
            )}
          >
            <span className="flex items-center gap-1">
              <Icon name="History" className="w-3 h-3" />
              Restore
            </span>
          </Button>
        </div>
      </Surface>
    )
  },
)

VersionItem.displayName = 'VersionItem'

export const VersionModal = memo(({ isOpen, onClose, versions, onRestore, editor }: VersionModalProps) => {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const versionRefs = useRef<Record<string, HTMLDivElement>>({})

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
    if (!editor) return null
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
            version: Number(versions[0].id),
          }),
        )
      } else {
        if (previewEditor && versions[0].content) {
          previewEditor.commands.setContent(versions[0].content)
        }
      }
    }
  }, [isOpen, versions, getProvider, previewEditor])

  useEffect(() => {
    const provider = getProvider()
    if (!provider) return

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

  const handleVersionItemClick = useCallback(
    (version: Version) => () => handleVersionSelect(version),
    [handleVersionSelect],
  )

  const handleVersionRestore = useCallback((version: Version) => () => onRestore(version), [onRestore])

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content asChild>
          <Surface className="fixed top-[80px] sm:top-[80px] left-1/2 -translate-x-1/2 w-[95vw] h-[80vh] max-h-[calc(100vh-110px)] max-w-[1200px] p-3 sm:p-4 md:p-6 z-[100] overflow-hidden">
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
                <div className="flex-1 overflow-y-auto pr-2 space-y-2 min-h-0">
                  {versions.map(version => (
                    <VersionItem
                      key={version.id}
                      version={version}
                      isSelected={selectedVersion?.id === version.id}
                      onClick={handleVersionItemClick(version)}
                      onRestore={handleVersionRestore(version)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Dialog.Close asChild>
              <Toolbar.Button className="absolute top-2 sm:top-4 right-2 sm:right-4">
                <Icon name="X" className="w-4 h-4 sm:w-5 sm:h-5" />
              </Toolbar.Button>
            </Dialog.Close>
          </Surface>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
})

VersionModal.displayName = 'VersionModal'
