import { Import } from '@tiptap-pro/extension-import'

// Initialize with empty token
const importExtension = Import.configure({
  appId: process.env.NEXT_PUBLIC_TIPTAP_CONVERT_APP_ID,
  token: '',
})

// Get the token and update the extension
fetch('/api/tiptap/convert-token')
  .then(response => response.json())
  .then(data => {
    if (data.error || !data.token) {
      throw new Error(data.error || 'Failed to get import token')
    }
    // Update the token in the extension's options
    importExtension.options.token = data.token
  })
  .catch(error => {
    throw error
  })

export const DocumentImport = importExtension
