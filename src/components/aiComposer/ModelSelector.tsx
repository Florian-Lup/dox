import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState, useCallback, useRef, useEffect } from 'react'

export const LLM_MODELS = [
  { id: 'gpt-4o', name: 'gpt-4o', description: 'Most capable for complex tasks' },
  { id: 'gpt-4o-mini', name: 'gpt-4o-mini', description: 'Fast and cost-effective' },
  { id: 'o1', name: 'o1', description: 'Coming Soon' },
  { id: 'o1-mini', name: 'o1-mini', description: 'Coming Soon' },
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

  const handleModelSelectClick = (model: (typeof LLM_MODELS)[0]) => {
    handleModelSelect(model)
  }

  const createClickHandler = (model: (typeof LLM_MODELS)[0]) => () => handleModelSelectClick(model)

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
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50 p-1">
          {LLM_MODELS.map(model => (
            <button
              key={model.id}
              onClick={createClickHandler(model)}
              className="flex flex-col w-full px-3 py-2 text-left rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <span className="text-sm font-medium text-neutral-900 dark:text-white">{model.name}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{model.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
