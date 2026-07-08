import JsonTextEditor from './JsonTextEditor.tsx'
import Tabs from './Tabs.tsx'
import type { TabKey } from '../types/editor'

type EditorPanelProps = {
  tab: TabKey
  onTabChange: (next: TabKey) => void
  textValue: string
  onTextChange?: (next: string) => void
  panelLabel: string
  treePlaceholder: string
  // // Optional: samo panel koji prikazuje parsed preview mora da zna za parse error.
  parseError?: string | null // panel može, ali ne mora, da dobije parse error
}

// genericka komponenta
export default function EditorPanel({
  tab,
  onTabChange,
  textValue,
  onTextChange,
  panelLabel,
  treePlaceholder,
  parseError,
}: EditorPanelProps) {
  return (
    <section className="editorPanel" aria-label={panelLabel}>
      <div className="editorPanelHeader">
        <div className="editorPanelTitle">{panelLabel}</div>
        {/* 
        Conditional render: 
        Renderujemo error samo kada error postoji i parser vrati grešku.
        → ako je parseError null/undefined → ne prikaži ništa
        role="alert" pomaže da poruka bude jasna i accessibility alatima. */}
        {parseError ? (
          <div className="parseError" role="alert">
            {parseError}
          </div>
        ) : null}
      </div>

      {/* Panel ne čuva svoj tab state.
      Aktivni tab dolazi iz parenta, a klik šalje promenu nazad kroz callback. */}
      <Tabs value={tab} onChange={onTabChange} />
      
      {/* 
      Conditional render: 
      tab određuje koji prikaz (Text ili Tree) se renderuje. */}
      <div className="editorPanelBody">
        {tab === 'text' ? (
          <JsonTextEditor
            value={textValue}
            onChange={onTextChange}
            ariaLabel={`${panelLabel} JSON text`}
          />
        ) : (
          <div className="treePlaceholder">{treePlaceholder}</div>
        )}
      </div>
    </section>
  )
}

