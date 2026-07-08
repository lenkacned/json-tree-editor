import { useState } from 'react'
import './App.css'
import EditorLayout from './components/EditorLayout'
import { useJsonParser } from './hooks/useJsonParser'
import type { TabKey } from './types/editor'

function App() {
  // leftText je jedini source of truth: korisnik menja samo levi editor.
  // Jedini JSON text state u aplikaciji. 
  // Right panel se računa iz ovog state-a, zato ne postoji rightText.
  // // Sve ostalo, kao parseResult i prettyText, računa se iz ove vrednosti.
  const [leftText, setLeftText] = useState<string>(() => {
    // Početni primer JSON-a da layout odmah bude koristan; parser dolazi u Fazi 2.
    return `{\n  "hello": "world",\n  "count": 1,\n  "nested": { "a": true, "b": [1, 2, 3] }\n}`
  })

  // Tabovi su UI state (šta korisnik gleda), a ne JSON state.
  // Oni samo čuvaju šta korisnik trenutno gleda: Text ili Tree.
  const [leftTab, setLeftTab] = useState<TabKey>('text')
  const [rightTab, setRightTab] = useState<TabKey>('text')

  // leftText je state, parseResult i prettyText su izvedeni iz leftTextt 
  // — bez useEffect sync-a i bez rightText state-a
  // App više ne parsira JSON direktno u sebi, 
  // nego koristi custom hook.
  // useJsonParser se na svaki re-render poziva, ali 
  // safeParseJson se ponovo izvrsava samo kada se text promeni
  // dakle, re-parse samo kada se text zaista promeni.
  // I Text preview i Tree preview koriste isti parseResult.
  // Desni panel je readonly preview: dobija izvedeni tekst i isti parseResult.
  const { parseResult, prettyText } = useJsonParser(leftText) 

  // Ovo je callback koji ide dole do textarea editora.
  // Callback koji child (JsonTextEditor) poziva kada korisnik kuca u levi editor.
  const handleLeftTextChange = (next: string) => {
    setLeftText(next) // app re-render → useJsonParser(leftText) izračuna parseResult i prettyText
  }

  // Desni Text preview: pretty kad je validan, inače raw leftText da korisnik vidi šta je ukucao.
  // validan JSON → desno prikazuje formatiran tekst
  // nevalidan JSON → desno prikazuje raw tekst + error
  // → izveden prikaz, ne novi state
  const rightTextPreview = parseResult.ok ? prettyText : leftText

  return (
    <div className="jsonEditorApp">
      <EditorLayout
        left={{
          tab: leftTab,
          onTabChange: setLeftTab,
          textValue: leftText,
          onTextChange: handleLeftTextChange, // levi panel može da menja tekst.
          panelLabel: 'Left',
          // Levi Tree čita isti parseResult iz leftText-a — bez posebnog JSON state-a.
          parseResult,
        }}
        right={{
          // Desni panel je izveden iz leftText-a, zato ne držimo poseban rightText state.
          tab: rightTab,
          onTabChange: setRightTab,
          // 1. Nema useEffect sync-a: right panel je derived render, jer mu direktno prosljeđujemo `leftText`.
          // Desni panel dobija isti leftText.
          // To je derived render, ne sync preko useEffect-a.
          // 2 .Nema useEffect sync-a: vrednost se računa u renderu iz parse rezultata.
          textValue: rightTextPreview, // dobija izvedeni tekst
          onTextChange: undefined, // nema callback za promenu
          panelLabel: 'Right',
          // Desni Tree je readonly preview istog parseResult-a.
          parseResult,
          parseError: parseResult.ok ? null : parseResult.error,
        }}
      />
    </div>
  )
}

export default App
