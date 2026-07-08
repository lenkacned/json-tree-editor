// samo tipovi koji su validni JSON, pravila/oblici podataka za TypeScript
// kakav oblik podataka ocekujemo.

export type JsonPrimitive = string | number | boolean | null

export type JsonArray = JsonValue[]

export type JsonObject = { [key: string]: JsonValue }

export type JsonValue = JsonPrimitive | JsonArray | JsonObject

// parser uvek vraća jedan od dva oblika
export type JsonParseResult =
  | { ok: true; value: JsonValue; error: null }
  | { ok: false; value: null; error: string }
