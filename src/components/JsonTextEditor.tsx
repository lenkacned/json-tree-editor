import type { ChangeEvent } from 'react'
import RenderBadge from './RenderBadge'
import { useRenderCount } from '../hooks/useRenderCount'

type JsonTextEditorProps = {
  value: string
  onChange?: (next: string) => void
  ariaLabel: string
}

export default function JsonTextEditor({
  value,
  onChange,
  ariaLabel,
}: JsonTextEditorProps) {
  const renderCount = useRenderCount()

  // Ako nema onChange callback-a, editor je readonly preview.
  // To koristimo za desni panel: prikazuje derived text, ali ne može da menja state.
  const readOnly = onChange === undefined // true / false

  // Controlled textarea: `value` dolazi iz parent state-a,
  // a onChange samo šalje novu vrednost nazad parentu.
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Guard za readonly/desni panel: ako nema callback-a, nema propagacije promene.
    if (!onChange) return  // desni panel samo prikazuje vrednost, ali ne može da je menja
    // React event nosi novu vrednost kroz e.target.value.
    // Tu vrednost šaljemo parentu, a parent odlučuje da li menja state.
    onChange(e.target.value) 
    /*
    React event ne menja UI sam.
    Event samo nosi informaciju.
    State menja UI.
    */
  }

  return (
    <div className="jsonTextEditorShell">
      <RenderBadge count={renderCount} label="JsonTextEditor" />
      <textarea
      className="jsonTextarea"
      value={value} // Controlled input: Prikaži u textarea ono što React state/props kaže. React kontroliše šta textarea prikazuje.
      onChange={handleChange} // Kada korisnik kuca, uhvati React event i pošalji novu vrednost parentu; promena ide nazad u React kroz callback.
      readOnly={readOnly} // Desni panel je readonly jer nema onChange callback.
      aria-label={ariaLabel}
      spellCheck={false}
    />
    </div>
  )
}

/*
 JsonTextEditor nije memoizovan jer mu se value realno menja dok korisnik kuca.
 Očekujemo da njegov render badge raste.
 Memo demonstracija je EditorHeader, jer on ima statične props, a JsonTextEditor ima dynamic props.
*/
