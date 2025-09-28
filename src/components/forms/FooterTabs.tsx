export type TabKey = 'daily' | 'summary' | 'more';

export default function FooterTabs({ tab, onChange }: { tab: TabKey; onChange:(t:TabKey)=>void }) {
  return (
    <nav className="footer">
      <button className={tab==='daily'?'active':''} onClick={()=>onChange('daily')}>📋<div className="small">Daily Log</div></button>
      <button className={tab==='summary'?'active':''} onClick={()=>onChange('summary')}>📊<div className="small">Summary</div></button>
      <button className={tab==='more'?'active':''} onClick={()=>onChange('more')}>⚙️<div className="small">More</div></button>
    </nav>
  );
}
