import { memo } from 'react'
import RenderBadge from './RenderBadge'
import { useRenderCount } from '../hooks/useRenderCount'

type EditorHeaderProps = {
  title: string
  subtitle: string
}


// React.memo radi shallow comparison props-a / plitko poređenje props-a.
// Da li je prop isti po referenci/vrednosti?
// Ako su title i subtitle (primitive vals) isti kao u prošlom renderu,
// React može da preskoči ponovno renderovanje EditorHeader-a.
// a title i subtile su def. van App komponente, pa se ne menjaju.

// Ako šalješ funkciju (npr. useRenderCount) u memoizovani child, 
// dobro je da ta funkcija ima stabilan identitet.

function EditorHeader({ title, subtitle }: EditorHeaderProps) {
  const renderCount = useRenderCount()

  return (
    <header className="editorHeader">
      <div className="editorHeaderText">
        <h1 className="editorHeaderTitle">{title}</h1>
        <p className="editorHeaderSubtitle">{subtitle}</p>
      </div>
      <div className="editorHeaderMeta">
        <RenderBadge count={renderCount} label="EditorHeader" />
        <p className="strictModeNote">
          StrictMode u dev modu može udvostručiti render ponašanje.
        </p>
      </div>
    </header>
  )
}

// React može da preskoči ponovno renderovanje EditorHeader ako su props isti.

// Memo ne znači "komponenta se nikad ne renderuje".
// Renderuje se na mount-u i opet ako se props promene.
export default memo(EditorHeader)
