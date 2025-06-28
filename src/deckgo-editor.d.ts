declare namespace JSX {
  interface IntrinsicElements {
    'deckgo-editor': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & { ref?: React.Ref<HTMLDeckgoEditorElement> }
  }
}

interface HTMLDeckgoEditorElement extends HTMLElement {
  setSlides: (slides: unknown) => void
  getSlides?: () => Promise<unknown>
  export?: () => Promise<unknown>
}
