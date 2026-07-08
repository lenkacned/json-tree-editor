// Prikazuje broj rendera u UI-ju// RenderBadge je prezentaciona komponenta.
// Ne broji render sama i nema state.
// Samo prikazuje count koji joj parent/hook prosledi.

type RenderBadgeProps = {
  count: number
  label?: string
}

// Prezentaciona oznaka: 
// samo prikazuje broj rendera, bez sopstvenog state-a.
export default function RenderBadge({ count, label }: RenderBadgeProps) {
  return (
    <span className="renderBadge">
      {label ? `${label}: ` : ''}renders: {count}
    </span>
  )
}
