import type { TabKey } from '../types/editor'

type TabsProps = {
  value: TabKey
  onChange: (next: TabKey) => void
}

export default function Tabs({ value, onChange }: TabsProps) {
  return (
    <div className="editorTabs" role="tablist" aria-label="Editor tabs">
      <button
        type="button"
        role="tab"
        aria-selected={value === 'text'}
        className={value === 'text' ? 'tabButton tabButtonActive' : 'tabButton'}
        onClick={() => onChange('text')}
        // Klik ne menja lokalni state u Tabs komponenti.
        // Tabs samo javlja parentu: "korisnik želi text tab".
      >
        Text
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === 'tree'}
        className={value === 'tree' ? 'tabButton tabButtonActive' : 'tabButton'}
        onClick={() => onChange('tree')}
        // Isti callback pattern: child javlja nameru, parent menja state.
      >
        Tree
      </button>
    </div>
  )
}

