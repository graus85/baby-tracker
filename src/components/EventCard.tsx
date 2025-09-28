import { TYPE_META } from '../utils/format';

export default function EventCard({
  type, title, subtitle, time, onEdit, onDuplicate, onDelete
}: {
  type: keyof typeof TYPE_META;
  title: string;
  subtitle?: string;
  time: string;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="card" style={{display:'flex', gap:12, alignItems:'center'}}>
      <div style={{
        width:44, height:44, borderRadius:10, background:'rgba(88,166,255,.1)',
        display:'grid', placeItems:'center', fontSize:24
      }}>
        {TYPE_META[type].emoji}
      </div>

      <div style={{flex:1, minWidth:0}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <strong>{title}</strong>
          <span className="small">{time}</span>
        </div>
        {subtitle && <div className="small" style={{marginTop:4}}>{subtitle}</div>}
        <div className="row" style={{marginTop:8}}>
          <button onClick={onEdit} disabled={!onEdit}>Edit</button>
          <button onClick={onDuplicate}>Duplicate</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
