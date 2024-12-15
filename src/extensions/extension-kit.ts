'use client'

import { HocuspocusProvider } from '@hocuspocus/provider'

import {
  BlockquoteFigure,
  CharacterCount,
  CodeBlock,
  Color,
  Document,
  DocumentImport,
  DocumentExport,
  Dropcursor,
  Figcaption,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  Link,
  Placeholder,
  Selection,
  SlashCommand,
  StarterKit,
  TableOfContents,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
  UniqueID,
  AiWriter,
} from '.'

import Focus from '@tiptap/extension-focus'

import { TableOfContentsNode } from './TableOfContentsNode'
import { isChangeOrigin } from '@tiptap/extension-collaboration'

interface ExtensionKitProps {
  provider?: HocuspocusProvider | null
}

export const ExtensionKit = ({ provider }: ExtensionKitProps) => [
  Document,
  Selection,
  DocumentImport,
  DocumentExport,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  HorizontalRule,
  UniqueID.configure({
    types: ['paragraph', 'heading', 'blockquote', 'codeBlock'],
    filterTransaction: transaction => !isChangeOrigin(transaction),
  }),
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    history: false,
    codeBlock: false,
  }),
  CodeBlock,
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: false,
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  CharacterCount.configure({
    limit: 5000,
    mode: 'textSize',
  }),
  TableOfContents,
  TableOfContentsNode,
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {}
    },
  }).configure({
    types: ['heading', 'paragraph'],
  }),
  Typography,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => '',
  }),
  SlashCommand,
  Focus.configure({
    mode: 'shallowest',
    className: 'has-focus',
  }),
  Figcaption,
  BlockquoteFigure,
  Dropcursor.configure({
    width: 2,
    class: 'ProseMirror-dropcursor border-black',
  }),
  AiWriter,
]

export default ExtensionKit
