import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Surface } from '@/components/ui/Surface'
import { DropdownButton } from '@/components/ui/Dropdown'

export const LLM_MODELS = [
  { id: 'gpt-4o', name: 'gpt-4o', description: 'Most capable for complex tasks' },
  { id: 'gpt-4o-mini', name: 'gpt-4o-mini', description: 'Fast and cost-effective model' },
  { id: 'gemini-1.5-pro', name: 'gemini-1.5-pro', description: 'Advanced reasoning and long context' },
  { id: 'gemini-1.5-flash', name: 'gemini-1.5-flash', description: 'Quick responses with high efficiency' },
]

interface ModelSelectorProps {
  selectedModel: (typeof LLM_MODELS)[0]
  onModelSelect: (model: (typeof LLM_MODELS)[0]) => void
}

export const ModelSelector = ({ selectedModel, onModelSelect }: ModelSelectorProps) => {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleModelButtonClick = useCallback(() => {
    setIsModelDropdownOpen(!isModelDropdownOpen)
  }, [isModelDropdownOpen])

  const handleModelSelect = useCallback(
    (model: (typeof LLM_MODELS)[0]) => {
      onModelSelect(model)
      setIsModelDropdownOpen(false)
    },
    [onModelSelect],
  )

  const createModelClickHandler = useCallback(
    (model: (typeof LLM_MODELS)[0]) => () => {
      handleModelSelect(model)
    },
    [handleModelSelect],
  )

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleModelButtonClick}
        className="flex items-center gap-1 text-xs font-medium group"
      >
        <span className="text-neutral-500">LLM : </span>
        <span className="text-neutral-900 dark:text-white">{selectedModel.name}</span>
        <motion.div animate={{ rotate: isModelDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-300" />
        </motion.div>
      </button>

      {isModelDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 z-50 p-1">
          <Surface className="p-2 flex flex-col gap-0.5">
            {LLM_MODELS.map(model => (
              <DropdownButton
                key={model.id}
                onClick={createModelClickHandler(model)}
                isActive={selectedModel.id === model.id}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{model.name}</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{model.description}</span>
                </div>
              </DropdownButton>
            ))}
          </Surface>
        </div>
      )}
    </div>
  )
}
