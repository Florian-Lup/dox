import { Button } from '../ui/Button'
import Tooltip from '../ui/Tooltip'

interface ComposerButtonProps {
  onClick: () => void
  className?: string
}

export const ComposerButton = ({ onClick, className }: ComposerButtonProps) => {
  return (
    <Tooltip title="AI Assistant">
      <Button
        onClick={onClick}
        className={`relative group overflow-hidden flex items-center justify-center flex-shrink-0 border-0 sm:h-8 sm:w-8 p-0 rounded-full ${className}`}
        variant="ghost"
        buttonSize="iconSmall"
      >
        <img
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white dark:border-black animate-pulse"
          src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Adrian&backgroundColor=6366f1`}
          alt="AI Assistant avatar"
        />
      </Button>
    </Tooltip>
  )
}
