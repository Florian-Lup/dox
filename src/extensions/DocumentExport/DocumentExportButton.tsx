import { Editor } from '@tiptap/react'
import * as Toast from '@radix-ui/react-toast'
import { Icon } from '@/components/ui/Icon'
import { useCallback, useState } from 'react'
import { Menu, Item, CategoryTitle } from '@/components/ui/PopoverMenu'
import { Toolbar } from '@/components/ui/Toolbar'

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

const exportOptions = [
  { label: 'Word Document (.docx)', format: 'docx' as const, icon: 'FileText' as const },
  { label: 'OpenDocument (.odt)', format: 'odt' as const, icon: 'FileText' as const },
  { label: 'Markdown (.md)', format: 'md' as const, icon: 'FileCode' as const },
]

type ExportItemProps = {
  option: (typeof exportOptions)[number]
  onExport: (format: ExportFormat) => void
  isLoading: boolean
}

const ExportItem = ({ option, onExport, isLoading }: ExportItemProps) => {
  const onClick = useCallback(() => {
    onExport(option.format)
  }, [onExport, option.format])

  return <Item key={option.format} label={option.label} icon={option.icon} onClick={onClick} disabled={isLoading} />
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
      setCurrentFormat(format)

      try {
        await withMinLoadingTime(
          new Promise((resolve, reject) => {
            editor
              .chain()
              .focus()
              .export({
                format,
                onExport(context) {
                  const { download, error: exportError } = context

                  if (exportError) {
                    setError(exportError.message)
                    reject(exportError)
                    return
                  }

                  download()
                  resolve(true)
                },
              })
              .run()
          }),
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
      <Menu
        trigger={
          <Toolbar.Button tooltip="Export Document" variant="ghost">
            <Icon name={isLoading ? 'Loader' : 'Download'} className={isLoading ? 'animate-spin' : ''} />
          </Toolbar.Button>
        }
        tooltip="Export Document"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">Export Document</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Choose a format to export</p>
          </div>
          {error && (
            <div className="p-2 text-sm text-red-600 bg-red-100 rounded dark:text-red-400 dark:bg-red-900/20">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1">
            {exportOptions.map(option => (
              <ExportItem key={option.format} option={option} onExport={handleExport} isLoading={isLoading} />
            ))}
          </div>
        </div>
      </Menu>

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
