# Debug Tiptap + React 19

This is a minimally reproducible scenario for React 19.1 with Tiptap NodeViews

## To reproduce bug

- `pnpm install`
- `pnpm dev`
- Navigate to app
- Click button in top right to insert a `container` Node with 1 child `item` Node
- Observe the `getPos` error in `prosemirror-view`'s `NodeViewDesc.posBeforeChild` on the 2nd render.

```
App.tsx:59 TypeError: Cannot read properties of undefined (reading 'size')
    at _NodeViewDesc.posBeforeChild (index.js:779:24)
    at ReactNodeView.getPos (index.js:1287:39)
    at Object.getPos (ReactNodeViewRenderer.tsx:84:26)
    at ContainerView (App.tsx:57:52)
    at react-stack-bottom-frame (react-dom-client.development.js:23863:20)
    at renderWithHooks (react-dom-client.development.js:5529:22)
    at updateFunctionComponent (react-dom-client.development.js:8897:19)
    at beginWork (react-dom-client.development.js:10522:18)
    at runWithFiberInDEV (react-dom-client.development.js:1519:30)
    at performUnitOfWork (react-dom-client.development.js:15132:22)
```

## Notes

This bug is only reproducible when causing an immediate re-render of the `container` Nodeview
