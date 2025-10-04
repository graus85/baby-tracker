import React from 'react'

type Props = { onClick: () => void }

export default function Fab({ onClick }: Props){
  return (
    <button
      onClick={onClick}
      aria-label="Add"
      style={{
        position:'fixed',
        right: `calc(16px + env(safe-area-inset-right))`,
        bottom:`calc(90px + env(safe-area-inset-bottom))`,
        width:64, height:64, borderRadius:32,
        background:'#2563eb', color:'#fff', border:'none',
        boxShadow:'0 10px 24px rgba(0,0,0,.35)',
        fontSize:28, lineHeight:'0'
      }}
    >+</button>
  )
}
