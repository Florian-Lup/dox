import { Extension } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'

export const useCharacterCount = (editor: any) => {
  return useEditorState({
    editor,
    selector: ctx => {
      const characterCount = ctx.editor?.storage.characterCount
      return {
        characters: characterCount?.characters?.() ?? 0,
        words: characterCount?.words?.() ?? 0,
        limit: characterCount?.limit ?? 5000,
      }
    },
  })
}

export const CharacterCounter = Extension.create({
  name: 'characterCounter',

  addStorage() {
    return {
      characters: 0,
      words: 0,
      limit: 5000,
    }
  },
})
