import type { FilterType } from '../types';
import { TYPE_META } from '../utils/format';

export default function FilterChips({
  value, counts, onChange
}: {
  value: FilterType;
  counts: Partial<Record<Exclude<FilterType,'all'>, number>>;
  onChange: (t: FilterType) => void;
}) {
  const order: Exclude<FilterType,'all'>[] = ['feed','diaper','sleep','vitamin','weight','height','other'];

  return (
    <div className="row" style={{overflowX:'auto', paddingBottom:6}}>
      <button
        className="badge"
        onClick={()=>onChange('all')}
        style={{ borderColor: value==='all' ? '#58a6ff' : undefined }}
      >All</button>

      {order.map(t => (
        <button
          key={t}
          className="badge"
          onClick={()=>onChange(t)}
          style={{ borderColor: value===t ? '#58a6ff' : undefined }}
        >
          <span style={{marginRight:6}}>{TYPE_META[t].emoji}</span>
          {counts?.[t] ?? 0}
        </button>
      ))}
    </div>
  );
}
