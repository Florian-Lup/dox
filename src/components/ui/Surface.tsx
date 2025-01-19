import { cn } from '@/lib/utils'
import { HTMLProps, forwardRef } from 'react'

/**
 * Surface variants for different visual styles
 */
export type SurfaceVariant = 'default' | 'elevated' | 'flat'

/**
 * Props for the Surface component
 * @property {boolean} withShadow - Whether to show a shadow
 * @property {boolean} withBorder - Whether to show a border
 * @property {SurfaceVariant} variant - Visual style variant
 * @property {React.ReactNode} children - Content to render inside the surface
 */
export type SurfaceProps = Omit<HTMLProps<HTMLDivElement>, 'ref'> & {
  withShadow?: boolean
  withBorder?: boolean
  variant?: SurfaceVariant
  role?: 'region' | 'article' | 'complementary' | 'contentinfo' | 'dialog' | 'form' | 'main' | 'navigation' | 'search'
}

/**
 * Surface is a container component that provides a consistent visual foundation.
 * It can be used for cards, panels, dialogs, or any other container that needs
 * to be visually distinct from its background.
 *
 * @example
 * ```tsx
 * <Surface withShadow withBorder>
 *   <h2>Content Title</h2>
 *   <p>Some content here...</p>
 * </Surface>
 * ```
 */
export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      children,
      className,
      withShadow = true,
      withBorder = true,
      variant = 'default',
      role,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const surfaceClass = cn(
      className,
      'bg-white rounded-lg dark:bg-black',
      withShadow && variant === 'default' && 'shadow-sm',
      withShadow && variant === 'elevated' && 'shadow-md',
      withBorder && 'border border-neutral-200 dark:border-neutral-800',
      variant === 'flat' && 'bg-transparent',
    )

    return (
      <div className={surfaceClass} ref={ref} role={role} aria-label={ariaLabel} {...props}>
        {children}
      </div>
    )
  },
)

Surface.displayName = 'Surface'
