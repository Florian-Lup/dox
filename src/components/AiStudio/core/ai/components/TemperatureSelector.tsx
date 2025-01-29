import { useCallback, useState } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

interface TemperatureSelectorProps {
  temperature: number
  onTemperatureChange: (value: number) => void
}

export const TemperatureSelector = ({ temperature, onTemperatureChange }: TemperatureSelectorProps) => {
  const [localTemperature, setLocalTemperature] = useState(temperature)

  const handleValueChange = useCallback(
    (values: number[]) => {
      const newTemp = values[0]
      setLocalTemperature(newTemp)
      onTemperatureChange(newTemp)
    },
    [onTemperatureChange],
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[localTemperature]}
            max={1}
            min={0}
            step={0.01}
            onValueChange={handleValueChange}
          >
            <Slider.Track className="bg-neutral-200 dark:bg-neutral-800 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className={cn(
                'block w-4 h-4 bg-white rounded-full border-2 border-blue-500',
                'hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'dark:bg-neutral-900 dark:focus:ring-offset-neutral-900',
              )}
            />
          </Slider.Root>
          <span className="text-sm font-medium text-neutral-900 dark:text-white min-w-[36px] text-right">
            {localTemperature.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 px-1">
        <span>Consistent</span>
        <span>Creative</span>
      </div>
    </div>
  )
}
