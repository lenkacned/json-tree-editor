import type { JsonParseResult, JsonValue } from '../types/json'

// Rekurzivna funkcija
/* JSON može biti samo: string, number, boolean, null, array, object */
function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) return true

  const valueType = typeof value

  if (
    valueType === 'string' ||
    valueType === 'number' ||
    valueType === 'boolean'
  ) {
    return true
  }

  // Array je validan JSON samo ako je svaki njegov element validan JSON: [1, "a", true, null] ok
  if (Array.isArray(value)) {
    return value.every(isJsonValue)
  }
  // Object je validan JSON ako su sve njegove vrednosti validan JSON: {a: 1, b: "a", c: true, d: null} ok
  if (valueType === 'object') {
    return Object.values(value as Record<string, unknown>).every(isJsonValue)
  }

  return false
}

/*
Probaj JSON.parse, 
- ako uspe → proveri da je JsonValue
- ako ne uspe → vrati error umesto crash-a
*/
export function safeParseJson(text: string): JsonParseResult {
  try {
    // ako iz text-a dobijes JS onda isJsonValue(parsed) proverava 
    // da li ta dobijena vrednost odgovara našem JsonValue tipu.
    const parsed: unknown = JSON.parse(text)

    if (!isJsonValue(parsed)) {
      return {
        ok: false,
        value: null,
        error: 'Invalid JSON',
      }
    }

    return {
      ok: true,
      value: parsed,
      error: null,
    }
  } catch (error: unknown) {
    return {
      ok: false,
      value: null,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    }
  }
}

export function formatJson(value: JsonValue): string {
  return JSON.stringify(value, null, 2)
}
