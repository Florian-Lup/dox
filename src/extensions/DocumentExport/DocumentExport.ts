import { Export } from '@tiptap-pro/extension-export'

// Initialize with empty token
const exportExtension = Export.configure({
  appId: process.env.NEXT_PUBLIC_TIPTAP_CONVERT_APP_ID,
  token: '',
})

// Get the token and update the extension
if (typeof window !== 'undefined') {
  const apiUrl = `${window.location.origin}/api/tiptap/convert-token`
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.error || !data.token) {
        throw new Error(data.error || 'Failed to get export token')
      }
      // Update the token in the extension's options
      exportExtension.options.token = data.token
    })
    .catch(error => {
      throw error
    })
}

export const DocumentExport = exportExtension
