import { useState } from 'react';
import Modal from './ui/Modal';
import FeedForm from './forms/FeedForm';
import DiaperForm from './forms/DiaperForm';
import SleepForm from './forms/SleepForm';
import VitaminsForm from './forms/VitaminsForm';
import WeightForm from './forms/WeightForm';
import HeightForm from './forms/HeightForm';

const items = [
  { key:'feed',   label:'Feed',   emoji:'🍼' },
  { key:'diaper', label:'Diaper', emoji:'👶' },
  { key:'sleep',  label:'Sleep',  emoji:'😴' },
  { key:'vit',    label:'Vitamin',emoji:'💊' },
  { key:'weight', label:'Weight', emoji:'⚖️' },
  { key:'height', label:'Height', emoji:'🪜' },
  { key:'other',  label:'Other',  emoji:'📝', disabled:true }, // TODO
] as const;

export default function AddEventModal({
  open, onClose, date, onSaved
}: { open: boolean; onClose: ()=>void; date: string; onSaved: ()=>void }) {
  const [sel, setSel] = useState<string | null>(null);

  function backToGrid() { setSel(null); }

  return (
    <Modal open={open} onClose={() => {setSel(null); onClose();}} title="Add Event">
      {!sel && (
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(2, minmax(0,1fr))', gap:12
        }}>
          {items.map(it => (
            <button key={it.key} disabled={!!it.disabled}
              onClick={()=>setSel(it.key)} className="card"
              style={{textAlign:'center', padding:'24px 8px', opacity: it.disabled ? .5 : 1}}
            >
              <div style={{fontSize:36, lineHeight:1}}>{it.emoji}</div>
              <div style={{color:'#58a6ff', marginTop:8, fontWeight:600}}>{it.label}</div>
            </button>
          ))}
        </div>
      )}
      {!!sel && (
        <div>
          <button onClick={backToGrid} className="badge" style={{marginBottom:8}}>← Back</button>
          {sel === 'feed'   && <FeedForm     date={date} onSaved={()=>{onSaved(); onClose();}} />}
          {sel === 'diaper' && <DiaperForm   date={date} onSaved={()=>{onSaved(); onClose();}} />}
          {sel === 'sleep'  && <SleepForm    date={date} onSaved={()=>{onSaved(); onClose();}} />}
          {sel === 'vit'    && <VitaminsForm date={date} onSaved={()=>{onSaved(); onClose();}} />}
          {sel === 'weight' && <WeightForm   date={date} onSaved={()=>{onSaved(); onClose();}} />}
          {sel === 'height' && <HeightForm   date={date} onSaved={()=>{onSaved(); onClose();}} />}
        </div>
      )}
    </Modal>
  );
}
