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

export const DocumentImportButton = ({ editor }: { editor: Editor }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      setIsLoading(true)
      setError(null)
      setIsOpen(false)

      try {
        await withMinLoadingTime(
          (async () => {
            let importSuccess = true
            await editor
              .chain()
              .focus()
              .import({
                file,
                onImport(context) {
                  const { setEditorContent, error: importError } = context

                  if (importError) {
                    setError(importError.message)
                    importSuccess = false
                    return
                  }

                  setEditorContent()
                },
              })
              .run()
            return importSuccess
          })(),
        )
        setShowSuccessToast(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import document')
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
        tooltip="Import Document"
        icon="Upload"
        title="Import Document"
        description="Upload a document to import its content (.docx, .odt, .rtf, .md)"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isLoading={isLoading}
      >
        {error && (
          <div className="p-2 text-sm text-red-600 bg-red-100 rounded dark:text-red-400 dark:bg-red-900/20">
            {error}
          </div>
        )}
        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg border-neutral-200 dark:border-neutral-800">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".docx,.odt,.rtf,.md"
            disabled={isLoading}
            className="block w-full text-sm text-neutral-500 dark:text-neutral-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-neutral-100 file:text-neutral-700
              dark:file:bg-neutral-800 dark:file:text-neutral-300
              hover:file:bg-neutral-200 dark:hover:file:bg-neutral-700
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
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
            Document imported successfully
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
            Failed to import document
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 left-0 z-[9999] m-4" />
      </Toast.Provider>
    </>
  )
}
