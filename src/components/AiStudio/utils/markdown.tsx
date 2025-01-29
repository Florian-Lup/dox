import { Components } from 'react-markdown'
import { cn } from '@/lib/utils'
import remarkGfm from 'remark-gfm'

export const markdownComponents: Components = {
  pre({ children, ...props }) {
    return (
      <pre className="p-3 overflow-auto text-[13px] font-mono" {...props}>
        {children}
      </pre>
    )
  },
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    return (
      <code
        className={cn(
          'px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 font-mono text-[13px]',
          match?.[1] && className,
        )}
        {...props}
      >
        {children}
      </code>
    )
  },
  a({ children, ...props }) {
    return (
      <a className="font-medium" {...props} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
}

export const markdownConfig = {
  remarkPlugins: [remarkGfm],
}

export const markdownStyles = [
  'prose prose-sm dark:prose-invert max-w-none',
  'prose-p:mt-2 prose-p:first:mt-0 prose-p:leading-relaxed',
  'prose-pre:mt-2 prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-900/90',
  'prose-pre:rounded-md prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-neutral-800',
  'prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:font-medium',
  'prose-code:before:content-none prose-code:after:content-none',
  'prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100',
  'prose-h1:text-lg prose-h2:text-base prose-h3:text-base',
  'prose-h1:mt-4 prose-h2:mt-4 prose-h3:mt-4',
  'prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline',
  'prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100 prose-strong:font-semibold',
  'prose-ul:mt-2 prose-li:mt-1 prose-li:marker:text-neutral-400',
  'prose-hr:mt-4 prose-hr:border-neutral-200 dark:prose-hr:border-neutral-800',
]
