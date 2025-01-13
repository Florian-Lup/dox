import { Editor } from '@tiptap/react'
import * as Toast from '@radix-ui/react-toast'
import { Icon } from '@/components/ui/Icon'
import { useCallback, useState } from 'react'
import { SidebarButton } from '@/components/Sidebar/SidebarButton'

// Helper function to ensure minimum loading time
const withMinLoadingTime = async (promise: Promise<any>, minTime = 500) => {
  const start = Date.now()
  const result = await promise
  const elapsed = Date.now() - start
  if (elapsed < minTime) {
    await new Promise(resolve => setTimeout(resolve, minTime - elapsed))
  }
  return result
}

type ExportFormat = 'docx' | 'odt' | 'md'

interface ExportOption {
  label: string
  format: ExportFormat
  icon: 'FileText' | 'FileCode'
}

const exportOptions: ExportOption[] = [
  { label: 'Word Document (.docx)', format: 'docx', icon: 'FileText' },
  { label: 'OpenDocument (.odt)', format: 'odt', icon: 'FileText' },
  { label: 'Markdown (.md)', format: 'md', icon: 'FileCode' },
]

interface ExportButtonProps {
  format: ExportFormat
  label: string
  icon: 'FileText' | 'FileCode'
  onExport: (format: ExportFormat) => void
  disabled: boolean
}

function ExportButton({ format, label, icon, onExport, disabled }: ExportButtonProps) {
  const handleClick = useCallback(() => {
    onExport(format)
  }, [format, onExport])

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Icon name={icon} className="w-4 h-4" />
      {label}
    </button>
  )
}

export const DocumentExportButton = ({ editor }: { editor: Editor }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [currentFormat, setCurrentFormat] = useState<string>('')

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      setIsLoading(true)
      setError(null)
      setIsOpen(false)
      setCurrentFormat(format.toUpperCase())

      try {
        await withMinLoadingTime(
          (async () => {
            let exportSuccess = true

            const response = await fetch('/api/tiptap/convert-token')
            const data = await response.json()

            if (data.error || !data.token) {
              throw new Error(data.error || 'Failed to get export token')
            }

            const exportExtension = editor.extensionManager.extensions.find(ext => ext.name === 'export')
            if (!exportExtension) {
              throw new Error('Export extension not found')
            }
            exportExtension.options.token = data.token

            await editor
              .chain()
              .focus()
              .export({
                format,
                onExport(context) {
                  const { error: exportError, download } = context

                  if (exportError) {
                    setError(exportError.message)
                    exportSuccess = false
                    return
                  }

                  download()
                },
              })
              .run()

            return exportSuccess
          })(),
        )
        setShowSuccessToast(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to export document')
        setShowErrorToast(true)
      } finally {
        setIsLoading(false)
      }
    },
    [editor],
  )

  return (
    <>
      <SidebarButton
        tooltip="Export Document"
        icon="Download"
        title="Export Document"
        description="Choose a format to export your document"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isLoading={isLoading}
      >
        {error && (
          <div className="p-2 text-sm text-red-600 bg-red-100 rounded dark:text-red-400 dark:bg-red-900/20">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-2">
          {exportOptions.map(option => (
            <ExportButton
              key={option.format}
              format={option.format}
              label={option.label}
              icon={option.icon}
              onExport={handleExport}
              disabled={isLoading}
            />
          ))}
        </div>
      </SidebarButton>

      <Toast.Provider>
        <Toast.Root
          className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4 items-center fixed bottom-4 left-4 z-[9999] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-left-full"
          open={showSuccessToast}
          onOpenChange={setShowSuccessToast}
          duration={3000}
        >
          <Toast.Title className="text-sm font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
            <Icon name="Check" className="w-4 h-4" />
            Document exported successfully as {currentFormat}
          </Toast.Title>
        </Toast.Root>

        <Toast.Root
          className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4 items-center fixed bottom-4 left-4 z-[9999] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-left-full"
          open={showErrorToast}
          onOpenChange={setShowErrorToast}
          duration={3000}
        >
          <Toast.Title className="text-sm font-medium text-red-900 dark:text-red-100 flex items-center gap-2">
            <Icon name="X" className="w-4 h-4" />
            Failed to export document
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 left-0 z-[9999] m-4" />
      </Toast.Provider>
    </>
  )
}
