import JsonNode from './JsonNode'
import RenderBadge from './RenderBadge'
import { useRenderCount } from '../hooks/useRenderCount'
import type { JsonParseResult } from '../types/json'

type JsonTreeViewerProps = {
  parseResult: JsonParseResult
}

export default function JsonTreeViewer({ parseResult }: JsonTreeViewerProps) {
  const renderCount = useRenderCount()

  const badge = <RenderBadge count={renderCount} label="JsonTreeViewer" />
  
  // Ako JSON nije validan → ne pokušava da crta tree vec prikaže poruku
  // sprecava crash-ovanje ako JSON nije validan
  if (!parseResult.ok) {
    return (
      <div className="treeViewer treeViewerError" role="status">
        {badge}
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
      {badge}
      <JsonNode value={parseResult.value} />
    </div>
  )
}
