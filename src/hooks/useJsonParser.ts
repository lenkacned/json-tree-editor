/*
Kada se promeni leftText → hook proba da parsira JSON
→ ako je validan, napravi prettyText
→ ako nije validan, vrati error
*/
import { useMemo } from 'react'
import type { JsonParseResult } from '../types/json'
import { formatJson, safeParseJson } from '../utils/json'

type UseJsonParserResult = {
  parseResult: JsonParseResult
  prettyText: string
}

export function useJsonParser(text: string): UseJsonParserResult {
  // useMemo: pamti rezultat računice između rendera.
  // → pamti rezultat računice dok se dependency ne promeni
  // useMemo: parse je derived data iz `text`, ne side-effect.
  // Izračunavamo ga samo kad se `text` promeni, ne na svaki render parenta (kucanje u levi text editor, klik na text/tree levo ili desno)
  // tj. parsiraj JSON samo kada se promeni text
  const parseResult = useMemo(() => safeParseJson(text), [text]) 

  // prettyText je derived value: nastaje iz parseResult.
  // prettyText nije state jer zavisi isključivo od parse rezultata.
  // Držati ga u useState bi dupliralo podatke i zahtevalo useEffect za sync.
  // - ako parse nije uspeo → nema pretty text
  // - ako parse jeste uspeo → formatiraj JSON
  const prettyText = useMemo(() => {
    if (!parseResult.ok) return ''
    return formatJson(parseResult.value)
  }, [parseResult])

  return { parseResult, prettyText }
}
