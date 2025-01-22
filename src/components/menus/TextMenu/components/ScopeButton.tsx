import { Icon } from '@/components/ui/Icon'
import { Toolbar } from '@/components/ui/Toolbar'
import { Editor, useEditorState } from '@tiptap/react'
import { useScope } from '@/hooks/useScope'
import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/Tooltip'

interface ScopeButtonProps {
  editor: Editor
}

export const ScopeButton = memo(({ editor }: ScopeButtonProps) => {
  const { captureSelection } = useScope(editor)
  const limit = 1000 // Character limit for selection

  const { characterCount, percentage } = useEditorState({
    editor,
    selector: ctx => {
      const { from, to } = ctx.editor.state.selection
      const count = from === to ? 0 : ctx.editor.state.doc.textBetween(from, to, ' ', ' ').length
      const percent = Math.max(0, Math.min((count / limit) * 100, 100))
      return { characterCount: count, percentage: percent }
    },
  })

  const radius = 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const isOverLimit = characterCount > limit

  const getButtonColor = () => {
    if (isOverLimit) return 'text-neutral-500 dark:text-neutral-500'
    if (characterCount === 0) return 'text-neutral-400 dark:text-neutral-500'
    if (percentage <= 70) return 'text-green-500 dark:text-green-400'
    return 'text-yellow-500 dark:text-yellow-400'
  }

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip title={isOverLimit ? 'Selection exceeds 1000 characters' : 'Add scope'}>
        <Toolbar.Button
          onClick={captureSelection}
          disabled={isOverLimit}
          className={cn(isOverLimit && 'opacity-50 cursor-not-allowed')}
        >
          <Icon name="AtSign" className={getButtonColor()} />
        </Toolbar.Button>
      </Tooltip>

      <Tooltip title={`${characterCount}/${limit} characters (${percentage.toFixed(1)}%)`}>
        <div className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" className="transform -rotate-90">
            <circle
              cx="10"
              cy="10"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              className="text-neutral-200 dark:text-neutral-800"
            />
            <circle
              cx="10"
              cy="10"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={cn('transition-all duration-300', {
                'text-green-500 dark:text-green-400': percentage <= 70,
                'text-yellow-500 dark:text-yellow-400': percentage > 70 && percentage <= 100,
                'text-red-500 dark:text-red-400': isOverLimit,
              })}
              style={{
                transformOrigin: '50% 50%',
              }}
            />
          </svg>
        </div>
      </Tooltip>
    </div>
  )
})

ScopeButton.displayName = 'ScopeButton'
