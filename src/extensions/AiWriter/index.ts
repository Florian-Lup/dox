import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { v4 as uuid } from 'uuid'

import { AiWriterView } from './components/AiWriterView'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    aiWriter: {
      setAiWriter: () => ReturnType
    }
  }
}

export const AiWriter = Node.create({
  name: 'aiWriter',

  group: 'block',

  content: '',

  selectable: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'node-aiWriter',
      },
    }
  },

  addAttributes() {
    return {
      id: {
        default: uuid(),
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => ({
          'data-id': attributes.id,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="ai-writer"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'ai-writer' })]
  },

  addCommands() {
    return {
      setAiWriter:
        () =>
        ({ chain }) => {
          console.log('Setting AI Writer')
          return chain()
            .insertContent({
              type: this.name,
              attrs: {
                id: uuid(),
              },
            })
            .run()
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(AiWriterView)
  },
})
