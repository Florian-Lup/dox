import { useState, useCallback } from 'react'

export interface ErrorHandlerHook {
  showErrorToast: boolean
  errorMessage: string
  handleError: (error: Error) => void
  setShowErrorToast: (show: boolean) => void
}

export const useErrorHandler = (): ErrorHandlerHook => {
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleError = useCallback((error: Error) => {
    setErrorMessage(error.message)
    setShowErrorToast(true)
  }, [])

  return {
    showErrorToast,
    errorMessage,
    handleError,
    setShowErrorToast,
  }
}
