import * as Slider from '@radix-ui/react-slider'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import { Button } from '../../../ui/Button'
import { cn } from '@/lib/utils'

interface ReadingLevelSliderProps {
  trigger: React.ReactNode
  onValueChange?: (value: number) => void
  onReadingLevelSelect?: (level: number) => void
}

const SLIDER_MARKS = [
  { value: 1, label: 'Elementary' },
  { value: 2, label: 'Middle School' },
  { value: 3, label: 'High School' },
  { value: 4, label: 'College' },
  { value: 5, label: 'Graduate' },
]

export const ReadingLevelSlider = ({ trigger, onValueChange, onReadingLevelSelect }: ReadingLevelSliderProps) => {
  const [value, setValue] = useState([3])
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleValueChange = useCallback(
    (newValue: number[]) => {
      setValue(newValue)
      onValueChange?.(newValue[0])
    },
    [onValueChange],
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (open) {
        setValue([3])
        onValueChange?.(3)
      }
    },
    [onValueChange],
  )

  const handleConfirm = useCallback(() => {
    onReadingLevelSelect?.(value[0])
    setIsOpen(false)
  }, [value, onReadingLevelSelect])

  const handleTriggerClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!isOpen) {
        setValue([3])
        onValueChange?.(3)
      }
      setIsOpen(!isOpen)
    },
    [isOpen, onValueChange],
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getLevelLabel = (value: number) => {
    return SLIDER_MARKS.find(mark => mark.value === value)?.label || ''
  }

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 mt-2 transform -translate-x-1/2 left-1/2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800"
        >
          <div className="w-[350px] p-4">
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-[95%] flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-900 dark:text-white pl-[10px]">Reading Level</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">{getLevelLabel(value[0])}</span>
                  <Button
                    variant="ghost"
                    buttonSize="icon"
                    className={cn(
                      'relative h-7 w-7 transition-colors rounded-full',
                      'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950 before:absolute before:inset-0 before:rounded-full before:border-2 before:border-t-emerald-500 before:border-r-emerald-500 before:border-b-transparent before:border-l-transparent dark:before:border-t-emerald-400 dark:before:border-r-emerald-400 before:animate-[spin_1s_linear_infinite]',
                    )}
                    onClick={handleConfirm}
                  >
                    <Check className="h-4 w-4 relative" />
                  </Button>
                </div>
              </div>
              <div className="w-[95%]">
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={value}
                  onValueChange={handleValueChange}
                  max={5}
                  min={1}
                  step={1}
                >
                  <Slider.Track className="relative grow h-[3px] bg-transparent">
                    <div className="absolute inset-0 flex items-center justify-between px-[10px]">
                      {SLIDER_MARKS.map(mark => (
                        <div key={mark.value} className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                      ))}
                    </div>
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-white dark:bg-neutral-800 border-2 border-emerald-500 hover:border-emerald-600 dark:border-emerald-400 dark:hover:border-emerald-300 rounded-full focus:outline-none" />
                </Slider.Root>
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-4 px-[10px]">
                  <span>Elementary</span>
                  <span>Graduate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
