import * as Slider from '@radix-ui/react-slider'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import { Button } from '../../../ui/Button'
import { cn } from '@/lib/utils'

interface LengthSliderProps {
  trigger: React.ReactNode
  onValueChange?: (value: number) => void
  onLengthSelect?: (percentage: number) => void
}

const SLIDER_MARKS = [
  { value: -100, label: '-100%' },
  { value: -75, label: '-75%' },
  { value: -50, label: '-50%' },
  { value: -25, label: '-25%' },
  { value: 0, label: '0%' },
  { value: 25, label: '+25%' },
  { value: 50, label: '+50%' },
  { value: 75, label: '+75%' },
  { value: 100, label: '+100%' },
]

export const LengthSlider = ({ trigger, onValueChange, onLengthSelect }: LengthSliderProps) => {
  const [value, setValue] = useState([0])
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
        setValue([0])
        onValueChange?.(0)
      }
    },
    [onValueChange],
  )

  const handleConfirm = useCallback(() => {
    if (value[0] === 0) return
    onLengthSelect?.(value[0])
    setIsOpen(false)
  }, [value, onLengthSelect])

  const handleTriggerClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!isOpen) {
        setValue([0])
        onValueChange?.(0)
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
                <span className="text-sm font-medium text-neutral-900 dark:text-white pl-[10px]">Adjust Length</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {value[0] >= 0 ? '+' : ''}
                    {value[0]}%
                  </span>
                  <Button
                    variant="ghost"
                    buttonSize="icon"
                    disabled={value[0] === 0}
                    className={cn(
                      'relative h-7 w-7 transition-colors rounded-full',
                      value[0] === 0
                        ? 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-300 dark:hover:text-neutral-600 cursor-not-allowed'
                        : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950 before:absolute before:inset-0 before:rounded-full before:border-2 before:border-t-emerald-500 before:border-r-emerald-500 before:border-b-transparent before:border-l-transparent dark:before:border-t-emerald-400 dark:before:border-r-emerald-400 before:animate-[spin_1s_linear_infinite]',
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
                  max={100}
                  min={-100}
                  step={25}
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
                  <span>Shorter</span>
                  <span>Original</span>
                  <span>Longer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
