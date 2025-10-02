import type { Kind } from '../lib/events'

export function IconFeed(props: any){ return (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M8 6h8M10 3h4M9 8h6l1 3v7a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3V11l1-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)}

export function IconDiaper(props: any){ return (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M3 8h18v5a4 4 0 0 1-4 4h-2l-2-3-2 3H7a4 4 0 0 1-4-4V8Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
)}

export function IconSleep(props: any){ return (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M14 3a8 8 0 1 0 7 11 7 7 0 0 1-7-11Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
)}

export function IconVitamin(props: any){ return (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M7 12l5-5a3.5 3.5 0 0 1 5 5l-5 5a3.5 3.5 0 0 1-5-5Z" fill="none" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M9.5 9.5l5 5" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
)}

export function IconWeight(props: any){ return (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M6 7h12l2 13H4L6 7Z" fill="none" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 7V4m-3 0h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)}

export function IconHeight(props: any){ return (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M7 3v18M17 3v18M7 6h4M17 8h-4M7 12h4M17 14h-4M7 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)}

export function IconOther(props: any){ return (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M5 4h10l4 4v12H5V4Z" fill="none" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M15 4v4h4" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
)}

export function IconForKind({kind, className}:{kind:Kind,className?:string}){
  const p = { className }
  switch(kind){
    case 'feed': return <IconFeed {...p}/>
    case 'diaper': return <IconDiaper {...p}/>
    case 'sleep': return <IconSleep {...p}/>
    case 'vitamin': return <IconVitamin {...p}/>
    case 'weight': return <IconWeight {...p}/>
    case 'height': return <IconHeight {...p}/>
    default: return <IconOther {...p}/>
  }
}
