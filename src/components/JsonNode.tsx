/*
JsonNode dobije jednu JSON vrednost
→ proveri da li je primitive / array / object
→ prikaže je
→ ako ima decu, pozove opet JsonNode za svako dete
*/
import type { JsonPrimitive, JsonValue } from '../types/json'
import { joinJsonPath } from '../utils/jsonPath'

type JsonNodeProps = {
  path: string
  expandedPaths: Set<string>
  onTogglePath: (path: string) => void
  // label je optional jer root JSON nema ime,
  // dok object key i array index imaju label
  label?: string
  value: JsonValue
}

// type guard.
// ako ova funkcija vrati true, TS zna da je value string/number/boolean/null
function isJsonPrimitive(value: JsonValue): value is JsonPrimitive {
  return value === null || typeof value !== 'object'
}

// Primitive formatiramo za prikaz u Tree UI-ju.
// String prikazujemo sa navodnicima da izgleda kao JSON vrednost.
function formatPrimitive(value: JsonPrimitive): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  return String(value)
}

// Komponenta koja prikazuje jedan čvor u JSON stablu (primitive, array, object)
export default function JsonNode({
  path,
  expandedPaths,
  onTogglePath,
  label,
  value,
}: JsonNodeProps) {
  // Primitive prikazujemo direktno.
  // Primitive nema decu, zato se samo renderuje vrednost.
  // Primitive nema decu, pa nema expand/collapse toggle.
  if (isJsonPrimitive(value)) {
    return (
      <div className="jsonNode jsonNodePrimitive">
        {label !== undefined ? (
          <span className="jsonKey">{label}: </span>
        ) : null}
        <span className="jsonPrimitive">{formatPrimitive(value)}</span>
      </div>
    )
  }

  const isExpanded = expandedPaths.has(path)
  // Rekurzija: svaki item u array-u je opet JsonValue,
  // pa ga prikazuje ista JsonNode komponenta.
  if (Array.isArray(value)) {
    return (
      <div className="jsonNode">
        <div className="jsonNodeRow">
          <button
            type="button"
            className="jsonNodeToggle"
            onClick={() => onTogglePath(path)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse array' : 'Expand array'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          {label !== undefined ? (
            <span className="jsonKey">{label}: </span>
          ) : null}
          <span className="jsonType">Array [{value.length}]</span>
        </div>
        {/* Object/array renderuju children samo kada je path expanded. */}
        {isExpanded ? (
          <div className="jsonChildren">
            {value.map((item, index) => (
              <JsonNode
                key={index}
                path={joinJsonPath(path, String(index))}
                expandedPaths={expandedPaths}
                onTogglePath={onTogglePath}
                label={`[${index}]`}
                value={item}
              />
            ))}
          </div>
        ) : null}
      </div>
    )
  }
  // Uzima kljuceve objekta i poziva JsonNode za svaki kljuc.
  const keys = Object.keys(value)

  // Object prikazujemo kao key/value grane.
  // Svaka value grana opet ide kroz JsonNode.
  return (
    <div className="jsonNode">
      <div className="jsonNodeRow">
        <button
          type="button"
          className="jsonNodeToggle"
          onClick={() => onTogglePath(path)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse object' : 'Expand object'}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
        {label !== undefined ? <span className="jsonKey">{label}: </span> : null}
        <span className="jsonType">
          Object {'{'}
          {keys.length} {keys.length === 1 ? 'key' : 'keys'}
          {'}'}
        </span>
      </div>
      {isExpanded ? (
        <div className="jsonChildren">
          {keys.map((key) => (
            <JsonNode
              key={key}
              path={joinJsonPath(path, key)}
              expandedPaths={expandedPaths}
              onTogglePath={onTogglePath}
              label={key}
              value={value[key]}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

/*
JsonNode za ceo niz
→ vrati JSX za Array [3]
→ unutra map napravi 3 child JsonNode-a
→ svaki child vrati svoj JSX
→ React sve to spoji u UI

...Znači array JsonNode vraća veliki JSX koji u sebi ima decu.
Znači ima povratne vrednosti, samo nisu “obični podaci”, nego React elementi / JSX opis UI-ja.
*/
