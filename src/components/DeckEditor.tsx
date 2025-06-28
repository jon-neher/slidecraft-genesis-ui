import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

interface DeckEditorProps {
  initialSlides: unknown
  onApply: (slides: unknown) => void
}

const DeckEditor = ({ initialSlides, onApply }: DeckEditorProps) => {
  const editorRef = useRef<HTMLDeckgoEditorElement | null>(null)
  const [showGrid, setShowGrid] = useState(false)

  // Load the DeckDeckGo editor script once
  useEffect(() => {
    const moduleId = 'deckgo-editor-module'
    const nomoduleId = 'deckgo-editor-nomodule'

    if (!document.getElementById(moduleId)) {
      const script = document.createElement('script')
      script.id = moduleId
      script.type = 'module'
      script.src =
        'https://unpkg.com/@deckdeckgo/editor@latest/dist/deckdeckgo/editor/deckdeckgo-editor.esm.js'
      document.body.appendChild(script)
    }

    if (!document.getElementById(nomoduleId)) {
      const script = document.createElement('script')
      script.id = nomoduleId
      script.setAttribute('nomodule', '')
      script.src =
        'https://unpkg.com/@deckdeckgo/editor@latest/dist/deckdeckgo/editor/deckdeckgo-editor.js'
      document.body.appendChild(script)
    }
  }, [])

  // Populate slides when the editor mounts
  useEffect(() => {
    if (editorRef.current && initialSlides) {
      // DeckDeckGo editor exposes a setSlides method
      editorRef.current.setSlides(initialSlides)
    }
  }, [initialSlides])

  const handleApply = async () => {
    if (!editorRef.current) return

    let slides
    if (typeof editorRef.current.getSlides === 'function') {
      slides = await editorRef.current.getSlides()
    } else if (typeof editorRef.current.export === 'function') {
      slides = await editorRef.current.export()
    }

    if (slides) {
      onApply(slides)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Switch
          id="show-grid"
          checked={showGrid}
          onCheckedChange={setShowGrid}
        />
        <label htmlFor="show-grid" className="text-sm text-slate-gray">
          Show Grid
        </label>
        <Button onClick={handleApply}>Apply Edits</Button>
      </div>
      <div className="relative">
        {/* The DeckDeckGo editor web component */}
        <deckgo-editor ref={editorRef}></deckgo-editor>
        {showGrid && <div className="grid-overlay pointer-events-none absolute inset-0" />}
      </div>
    </div>
  )
}

export default DeckEditor
