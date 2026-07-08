import { useState, useCallback } from 'react'
import './App.css'
// EditorHeader stoji u App, ali pošto je memoizovan, ne mora da se renderuje svaki put kad App raste.
import EditorHeader from './components/EditorHeader'
import EditorLayout from './components/EditorLayout'
import RenderBadge from './components/RenderBadge'
import { useJsonParser } from './hooks/useJsonParser'
import { useRenderCount } from './hooks/useRenderCount'
import type { TabKey } from './types/editor'

/*
// Konstante su van App komponente da bi props za memoizovani EditorHeader ostali stabilni.
// Dok korisnik kuca, App se re-renderuje, ali title/subtitle se ne menjaju.
*/
const APP_TITLE = 'JSON Tree Editor'
const APP_SUBTITLE =
  'Left je source of truth. Right je readonly derived preview (Text + Tree).'

function App() {
  // Dok kucaš u levi JSON editor, App mora da se renderuje, ali statični EditorHeader ne mora.
  // To sada dokazujemo render badge-ovima.
  const appRenderCount = useRenderCount()
  // leftText je jedini source of truth: korisnik menja samo levi editor.
  // Jedini JSON text state u aplikaciji. 
  // Desni panel ne čuva svoj tekst
  // Desni panel se računa iz ovog state-a, zato ne postoji rightText.
  // Sve ostalo, kao parseResult i prettyText, računa se iz ove vrednosti.
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
  // leftText -> parseResult -> prettyText -> right preview / tree
  const { parseResult, prettyText } = useJsonParser(leftText) 

  // Ovo je callback koji ide dole do textarea editora.
  // Callback koji child (JsonTextEditor) poziva kada korisnik kuca u levi editor.
  // Stabilizacija: Napravi funkciju jednom i zadrži isti identitet između rendera.
  const handleLeftTextChange = useCallback((next: string) => {
    setLeftText(next) // app re-render → useJsonParser(leftText) izračuna parseResult i prettyText
  }, []) // ne mora u dep. array jer je setter std f.ja izmedju rendera, kako garantuje react

  // Desni Text preview: pretty kad je validan, inače raw leftText da korisnik vidi šta je ukucao.
  // validan JSON → desno prikazuje formatiran tekst
  // nevalidan JSON → desno prikazuje raw tekst + error
  // → izveden prikaz, ne novi state
  const rightTextPreview = parseResult.ok ? prettyText : leftText

  return (
    <div className="jsonEditorApp">
      <div className="appTopBar">
        <EditorHeader title={APP_TITLE} subtitle={APP_SUBTITLE} />
        <RenderBadge count={appRenderCount} label="App" />
      </div>
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
