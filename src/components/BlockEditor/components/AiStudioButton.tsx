import { motion } from 'framer-motion'
import { Pen } from 'lucide-react'
import { Button } from '../../ui/Button'
import Tooltip from '../../ui/Tooltip'

interface AiStudioButtonProps {
  onClick: () => void
  className?: string
}

export const AiStudioButton = ({ onClick, className }: AiStudioButtonProps) => {
  return (
    <Tooltip title="AI Assistant">
      <Button
        onClick={onClick}
        className={`relative group overflow-hidden bg-neutral-800 dark:bg-neutral-200 text-neutral-200 dark:text-neutral-800 shadow-md hover:shadow-lg transition-all duration-300 scale-100 hover:scale-105 flex-shrink-0 border-0 sm:h-8 sm:w-8 ${className}`}
        variant="primary"
        buttonSize="iconSmall"
      >
        <motion.div className="p-1 sm:p-2 md:p-2.5" whileHover={{ scale: 1.1 }} initial={{ scale: 1 }}>
          <motion.div
            animate={{
              x: [-1, 2, -1],
              y: [-1, 1, -1],
              rotate: [-10, 0, -10],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Pen className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
          </motion.div>
        </motion.div>
      </Button>
    </Tooltip>
  )
}
