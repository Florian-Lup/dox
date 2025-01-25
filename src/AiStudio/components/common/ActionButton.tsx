import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}

export const ActionButton = ({
  children,
  loading,
  icon,
  variant = 'primary',
  className,
  disabled,
  ...props
}: ActionButtonProps) => {
  const variantStyles = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700',
    ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
  }

  return (
    <Button
      {...props}
      disabled={loading || disabled}
      className={cn(
        'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
        variantStyles[variant],
        loading && 'opacity-70 cursor-not-allowed',
        className,
      )}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </Button>
  )
}
