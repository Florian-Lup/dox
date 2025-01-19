import { Editor } from '@tiptap/react'
import { Menu } from '@/components/ui/PopoverMenu'
import { Icon } from '@/components/ui/Icon'

export const CommentList = ({ editor }: { editor: Editor }) => {
  return (
    <Menu trigger={<Icon name="MessageSquareText" />} tooltip="Comments">
      <div className="p-4 space-y-3 w-80">
        <div>
          <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">Comments</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">View and manage comments</p>
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">Comments feature coming soon! 🚀</div>
      </div>
    </Menu>
  )
}
