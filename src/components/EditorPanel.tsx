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
}

export default function EditorPanel({
  tab,
  onTabChange,
  textValue,
  onTextChange,
  panelLabel,
  treePlaceholder,
}: EditorPanelProps) {
  return (
    <section className="editorPanel" aria-label={panelLabel}>
      <div className="editorPanelHeader">
        <div className="editorPanelTitle">{panelLabel}</div>
      </div>

      {/* Panel ne čuva svoj tab state.
      Aktivni tab dolazi iz parenta, a klik šalje promenu nazad kroz callback. */}
      <Tabs value={tab} onChange={onTabChange} />
      
      {/* Conditional render: tab određuje koji prikaz (Text ili Tree) se renderuje. */}
      <div className="editorPanelBody">
        {/* Conditional render: tab određuje koji prikaz (Text ili Tree) se renderuje. */}
        {/* Faza 1: Tree prikaz je još placeholder; pravi recursive tree viewer dolazi u Fazi 3. */}  
        {tab === 'text' ? (
          <JsonTextEditor
            value={textValue}
            onChange={onTextChange}
            ariaLabel={`${panelLabel} JSON text`}
          />
        ) : (
          
          // Faza 1 samo prikazuje skeleton: pravi tree viewer dolazi u Fazi 3.
          <div className="treePlaceholder">{treePlaceholder}</div>
        )}
      </div>
    </section>
  )
}

