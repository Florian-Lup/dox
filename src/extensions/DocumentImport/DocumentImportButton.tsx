import { Editor } from '@tiptap/react'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '@/components/ui/Icon'
import { Toolbar } from '@/components/ui/Toolbar'
import { useCallback } from 'react'

export const DocumentImportButton = ({ editor }: { editor: Editor }) => {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        editor.commands.importDocument(file)
      }
    },
    [editor],
  )

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button tooltip="Import Document">
          <Icon name="Upload" className="w-5 h-5" />
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
              <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">Import Document</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Upload a document to import its content</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg border-neutral-200 dark:border-neutral-800">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".doc,.docx,.txt"
                className="block w-full text-sm text-neutral-500 dark:text-neutral-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-neutral-100 file:text-neutral-700
                  dark:file:bg-neutral-800 dark:file:text-neutral-300
                  hover:file:bg-neutral-200 dark:hover:file:bg-neutral-700"
              />
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
