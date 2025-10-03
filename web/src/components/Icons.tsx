import React from 'react'

export type Kind = 'feed' | 'diaper' | 'sleep' | 'vitamin' | 'weight' | 'height' | 'other'

type Props = {
  kind: Kind
  className?: string
  width?: number
  height?: number
}

/** Icone minimal inline, rispettano width/height */
export function IconForKind({ kind, className, width = 16, height = 16 }: Props) {
  const common = { width, height, viewBox: '0 0 24 24', className, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' as const }

  switch (kind) {
    case 'feed':
      return (
        <svg {...common}>
          <path d="M7 10v7a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-7" />
          <rect x="8" y="5" width="8" height="5" rx="2" />
          <path d="M10 5V3m4 2V3" />
        </svg>
      )
    case 'diaper':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="8" rx="2" />
          <path d="M6 13v2a4 4 0 0 0 4 4h0" />
          <path d="M18 13v2a4 4 0 0 1-4 4h0" />
        </svg>
      )
    case 'sleep':
      return (
        <svg {...common}>
          <path d="M6 14a6 6 0 1 0 8-8 6 6 0 0 1-8 8z" />
          <path d="M14 3h5l-5 5h5" />
        </svg>
      )
    case 'vitamin':
      return (
        <svg {...common}>
          <rect x="5" y="3" width="6" height="18" rx="3" />
          <rect x="13" y="7" width="6" height="10" rx="3" />
        </svg>
      )
    case 'weight':
      return (
        <svg {...common}>
          <path d="M6 9h12l2 11H4l2-11Z" />
          <path d="M9 9a3 3 0 1 1 6 0" />
        </svg>
      )
    case 'height':
      return (
        <svg {...common}>
          <path d="M6 4v16M6 8h3M6 12h3M6 16h3" />
          <path d="M12 20l6-16" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      )
  }
}

export default IconForKind
