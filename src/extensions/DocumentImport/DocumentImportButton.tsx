import { Editor } from '@tiptap/react'
import * as Toast from '@radix-ui/react-toast'
import { Icon } from '@/components/ui/Icon'
import { Toolbar } from '@/components/ui/Toolbar'
import { useCallback, useState, useRef } from 'react'

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
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      setIsLoading(true)

      try {
        await withMinLoadingTime(
          new Promise((resolve, reject) => {
            editor
              .chain()
              .focus()
              .import({
                file,
                onImport(context) {
                  const { setEditorContent, error: importError } = context

                  if (importError) {
                    reject(importError)
                    return
                  }

                  setEditorContent()
                  resolve(true)
                },
              })
              .run()
          }),
        )
        setShowSuccessToast(true)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (err) {
        setShowErrorToast(true)
      } finally {
        setIsLoading(false)
      }
    },
    [editor],
  )

  const handleTriggerClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept=".docx,.odt,.rtf,.md"
        className="hidden"
      />
      <Toolbar.Button onClick={handleTriggerClick} tooltip="Import Document (.docx, .odt, .rtf, .md)">
        <Icon name={isLoading ? 'Loader' : 'Upload'} className={isLoading ? 'animate-spin' : ''} />
      </Toolbar.Button>

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
