import { Editor } from '@tiptap/react'
import { SidebarButton } from '@/components/BlockEditor/components/SidebarButton'

export const CommentList = ({ editor }: { editor: Editor }) => {
  return (
    <SidebarButton tooltip="Comments" icon="MessageSquareText" title="Comments" description="View and manage comments">
      <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">Comments feature coming soon! 🚀</div>
    </SidebarButton>
  )
}
