import { Extension } from '@tiptap/core'
import { Editor } from '@tiptap/react'

export interface DocumentImportOptions {
  types: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    documentImport: {
      importDocument: (file: File) => ReturnType
    }
  }
}

export const DocumentImport = Extension.create<DocumentImportOptions>({
  name: 'documentImport',

  addOptions() {
    return {
      types: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ],
    }
  },

  addCommands() {
    return {
      importDocument:
        (file: File) =>
        ({ editor }) => {
          const reader = new FileReader()

          reader.onload = async e => {
            const content = e.target?.result as string
            if (content) {
              // For now, we'll just insert the content as plain text
              // You can extend this to handle different file types and formatting
              editor.commands.setContent(content)
              return true
            }
            return false
          }

          reader.readAsText(file)
          return true
        },
    }
  },
})
