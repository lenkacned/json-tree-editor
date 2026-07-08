import { useState } from 'react'
import './App.css'
import EditorLayout from './components/EditorLayout'
import type { TabKey } from './types/editor'

function App() {
  // leftText je jedini source of truth: korisnik menja samo levi editor.
  // Jedini JSON text state u aplikaciji.
  // Right panel se računa iz ovog state-a, zato ne postoji rightText.
  const [leftText, setLeftText] = useState<string>(() => {
    // Početni primer da layout odmah bude koristan; parser dolazi u Fazi 2.
    return `{\n  "hello": "world",\n  "count": 1,\n  "nested": { "a": true, "b": [1, 2, 3] }\n}`
  })

  // Tabovi su UI state (šta korisnik gleda), a ne JSON state.
  const [leftTab, setLeftTab] = useState<TabKey>('text')
  const [rightTab, setRightTab] = useState<TabKey>('text')

  const handleLeftTextChange = (next: string) => {
    setLeftText(next)
  }

  return (
    <div className="jsonEditorApp">
      <EditorLayout
        left={{
          tab: leftTab,
          onTabChange: setLeftTab,
          textValue: leftText,
          onTextChange: handleLeftTextChange,
          panelLabel: 'Left',
          treePlaceholder: 'Left Tree: Tree editor/viewer dolazi u Fazi 3.',
        }}
        right={{
          // Desni panel je izveden iz leftText-a, zato ne držimo poseban rightText state.
          tab: rightTab,
          onTabChange: setRightTab,
          // Nema useEffect sync-a: right panel je derived render, jer mu direktno prosljeđujemo `leftText`.
          // Desni panel dobija isti leftText.
          // To je derived render, ne sync preko useEffect-a.
          textValue: leftText,
          // Desni panel nema callback za promenu teksta.
          // Zbog toga JsonTextEditor automatski postaje readonly preview.
          onTextChange: undefined,
          panelLabel: 'Right',
          treePlaceholder: 'Right Tree: Tree preview dolazi u Fazi 3.',
        }}
      />
    </div>
  )
}

export default App
