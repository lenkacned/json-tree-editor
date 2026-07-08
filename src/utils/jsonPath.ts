// JSON Pointer-like path segment escape (~ -> ~0, / -> ~1).
// zaštita za čudne JSON ključeve
export function escapePathSegment(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1')
}

// Služi da napravi adresu deteta. 
// joinJsonPath('/', 'user') -> /user
// joinJsonPath('/user', 'address') -> /user/address
export function joinJsonPath(parentPath: string, segment: string): string {
  const escaped = escapePathSegment(segment)
  if (parentPath === '/') {
    return `/${escaped}`
  }
  return `${parentPath}/${escaped}`
}

/*
Ako /user ima dete "name": 
joinJsonPath('/user', 'name')

dobiješ:  /user/name

Tako svaki node ima svoju adresu.
*/