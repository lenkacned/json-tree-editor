// Debug/learning counter: pokazuje koliko puta je App renderovan.
// Ovo ne sme biti useState, jer bi setState sam izazvao novi render.
// useRef je "kutija" koja preživljava između rendera.
// Zato je ref dobar za debug brojač rendera: pamtimo broj, ali ne pravimo dodatni render.
import { useRef } from 'react' 

// ref se namerno čita/menja tokom rendera.
// ESLint neće prijavljivati greške za refs u ovom delu koda.

/* eslint-disable react-hooks/refs */
export function useRenderCount(): number {
  // ref pamti vrednost između rendera, 
  // ali promena ref-a sama ne pokreće novi render
  const countRef = useRef(0)
  countRef.current += 1 // Svaki put kad React pozove App(), ovaj broj poraste.
  return countRef.current
}
/* eslint-enable react-hooks/refs */
/*
Isključujemo ovo ESLint upozorenje samo u ovom fajlu, 
jer namerno koristimo ref kao render brojač. 
Ne koristimo ga da menjamo UI, nego samo da izmerimo 
-> koliko puta je komponenta prošla kroz render

 Ovaj hook namerno čita i menja ref tokom rendera da bi izmerio render prolaze.
 To je prihvatljivo samo za debug/learning alat, ne za običnu app logiku, jer
 tokom rendera menjaš vrednost -> Render ne bi trebalo da pravi skrivene promene sa strane.
 */
