import { ReactNode } from 'react';

export default function Modal({
  open, onClose, children, title
}: { open: boolean; onClose: ()=>void; children: ReactNode; title?: string }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true"
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,.5)',
        display:'flex', alignItems:'center', justifyContent:'center', zIndex:999
      }}
      onClick={onClose}
    >
      <div className="card" style={{width:'min(680px, 92vw)'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2 style={{margin:0}}>{title ?? 'Add Event'}</h2>
          <button onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div style={{marginTop:12}}>{children}</div>
      </div>
    </div>
  );
}
