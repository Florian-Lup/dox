import { useState, useCallback } from 'react'

export type TabType = 'quick' | 'advanced'

export interface TabStateHook {
  activeTab: TabType
  handleTabChange: (isAdvanced: boolean) => void
}

export const useTabState = (): TabStateHook => {
  const [activeTab, setActiveTab] = useState<TabType>('quick')

  const handleTabChange = useCallback((isAdvanced: boolean) => {
    setActiveTab(isAdvanced ? 'advanced' : 'quick')
  }, [])

  return {
    activeTab,
    handleTabChange,
  }
}
