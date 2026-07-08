import JsonNode from './JsonNode'
import type { JsonParseResult } from '../types/json'

type JsonTreeViewerProps = {
  parseResult: JsonParseResult
}

export default function JsonTreeViewer({ parseResult }: JsonTreeViewerProps) {
  
  // Ako JSON nije validan → ne pokušava da crta tree vec prikaže poruku
  // sprecava crash-ovanje ako JSON nije validan
  if (!parseResult.ok) {
    return (
      <div className="treeViewer treeViewerError" role="status">
        <p>Tree prikaz nije dostupan dok JSON nije validan.</p>
        <p className="treeViewerErrorDetail">{parseResult.error}</p>
      </div>
    )
  }

  // Guard: Tree može da se prikaže samo kada parser ima validan value.
  // Tree prikaz je readonly derived UI: samo čita parseResult, ne menja leftText.
  // validan JSON → pošalji root vrednost u JsonNode, Root tree renderer
  // dalje prikazivanje preuzima rekurzivni JsonNode.
  return (
    <div className="treeViewer">
      <JsonNode value={parseResult.value} />
    </div>
  )
}
