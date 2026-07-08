import EditorPanel from './EditorPanel.tsx'
import type { TabKey } from '../types/editor'

type PanelConfig = {
  tab: TabKey
  onTabChange: (next: TabKey) => void
  textValue: string
  onTextChange?: (next: string) => void
  panelLabel: string
  treePlaceholder: string
}

type EditorLayoutProps = {
  left: PanelConfig
  right: PanelConfig
}

export default function EditorLayout({ left, right }: EditorLayoutProps) {
  return (
    <div className="editorLayout">
      <EditorPanel
        tab={left.tab}
        onTabChange={left.onTabChange}
        textValue={left.textValue}
        onTextChange={left.onTextChange}
        panelLabel={left.panelLabel}
        treePlaceholder={left.treePlaceholder}
      />
      <EditorPanel
        tab={right.tab}
        onTabChange={right.onTabChange}
        textValue={right.textValue}
        onTextChange={right.onTextChange}
        panelLabel={right.panelLabel}
        treePlaceholder={right.treePlaceholder}
      />
    </div>
  )
}

