import EditorPanel from './EditorPanel.tsx'
import type { TabKey } from '../types/editor'
import type { JsonParseResult } from '../types/json'

// generic type za sve panele, 
// tako da može da se koristi za levi i desni panel
type PanelConfig = {
  tab: TabKey
  onTabChange: (next: TabKey) => void
  textValue: string
  onTextChange?: (next: string) => void
  panelLabel: string
  // Tree tab koristi parseResult da prikaže readonly strukturu JSON-a.
  parseResult: JsonParseResult // svaki panel sada mora da dobije parseResult
  parseError?: string | null // "optional" zbog levog panela koji nema parse error
}

type EditorLayoutProps = {
  left: PanelConfig
  right: PanelConfig
}

// EditorLayout ne odlučuje kako se JSON prikazuje.
// Samo prosleđuje isti shape podataka svakom panelu.
export default function EditorLayout({ left, right }: EditorLayoutProps) {
  return (
    <div className="editorLayout">
      <EditorPanel
        tab={left.tab}
        onTabChange={left.onTabChange}
        textValue={left.textValue}
        onTextChange={left.onTextChange}
        panelLabel={left.panelLabel}
        parseResult={left.parseResult}
        parseError={left.parseError}
      />
      <EditorPanel
        tab={right.tab}
        onTabChange={right.onTabChange}
        textValue={right.textValue}
        onTextChange={right.onTextChange}
        panelLabel={right.panelLabel}
        parseResult={right.parseResult}
        parseError={right.parseError}
      />
    </div>
  )
}

