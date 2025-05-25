import { mergeAttributes, Node, type NodeViewProps } from '@tiptap/core'
import {
  EditorContent,
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect, useState } from 'react'

import './App.css'

const Item = Node.create({
  name: 'item',
  content: 'inline*',

  addNodeView() {
    return ReactNodeViewRenderer(ItemView)
  },
  parseHTML() {
    return [{ tag: 'item' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['item', mergeAttributes(HTMLAttributes), 0]
  },
})
const ItemView = () => {
  return (
    <NodeViewWrapper>
      <NodeViewContent />
    </NodeViewWrapper>
  )
}

const Container = Node.create({
  name: 'container',
  content: `item+`,
  group: 'block',

  addNodeView() {
    return ReactNodeViewRenderer(ContainerView)
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: 'container' }),
      0,
    ]
  },
})

const ContainerView = (nodeViewProps: NodeViewProps) => {
  try {
    // ERROR HERE - This errors on the 2nd render triggered by setCount(2)
    console.log('ContainerView pos', nodeViewProps.getPos())
  } catch (e) {
    console.warn(e)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCount] = useState(1)

  useEffect(() => {
    console.log(`ContainerView MOUNT`)
    setCount(2)
    return () => {
      console.log(`ContainerView UNMOUNT`)
    }
  }, [])
  return (
    <NodeViewWrapper>
      <NodeViewContent />
    </NodeViewWrapper>
  )
}

const App = () => {
  const editor = useEditor({
    extensions: [StarterKit.configure(), Container, Item],
    content: '<p>Hello World!</p>',
    editable: true,
    onCreate: ({ editor: e }) => {
      // Move cursor to end of document and focus
      e.chain().setTextSelection(e.state.doc.content.size).focus().run()
    },
  })

  const insertContainerWithItems = useCallback(() => {
    if (!editor) return
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'container',
        content: [
          {
            type: 'item',
            content: [{ type: 'text', text: 'Container Item 1' }],
          },
        ],
      })
      .run()
  }, [editor])

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>Debug Tiptap + React 19</div>

        <button onClick={insertContainerWithItems}>
          Click to insert container+item
        </button>
      </div>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '4px',
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default App
