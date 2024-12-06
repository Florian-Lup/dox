import { mergeAttributes, Node } from '@tiptap/core'

export const Figcaption = Node.create({
  name: 'figcaption',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  content: 'inline*',

  selectable: false,

  draggable: false,

  marks: 'link',

  parseHTML() {
    return [
      {
        tag: 'figcaption',
      },
    ]
  },

  addKeyboardShortcuts() {
    return {
      // On Enter at the end of line, create new paragraph and focus
      Enter: ({ editor }) => {
        const {
          state: {
            selection: { $from, empty },
          },
        } = editor

        if (!empty || $from.parent.type !== this.type) {
          return false
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2

        if (!isAtEnd) {
          return false
        }

        const pos = editor.state.selection.$from.end()

        return editor.chain().focus(pos).insertContentAt(pos, { type: 'paragraph' }).run()
      },

      // On Backspace at the beginning of line,
      // allow default behavior
      Backspace: ({ editor }) => {
        const {
          state: {
            selection: { $from, empty },
          },
        } = editor

        if (!empty || $from.parent.type !== this.type) {
          return false
        }

        return false
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['figcaption', mergeAttributes(HTMLAttributes), 0]
  },
})

export default Figcaption
