export type TabKey = 'summary' | 'daily' | 'more'

export default function FooterTabs({
  tab,
  onChange
}: {
  tab: TabKey
  onChange: (t: TabKey) => void
}) {
  return (
    <nav className="footer" role="tablist" aria-label="Main navigation">
      <button
        role="tab"
        aria-selected={tab === 'summary'}
        className={tab === 'summary' ? 'active' : ''}
        onClick={() => onChange('summary')}
        title="Summary"
      >
        📊
        <div className="small">Summary</div>
      </button>

      <button
        role="tab"
        aria-selected={tab === 'daily'}
        className={tab === 'daily' ? 'active' : ''}
        onClick={() => onChange('daily')}
        title="Daily Log"
      >
        📋
        <div className="small">Daily Log</div>
      </button>

      <button
        role="tab"
        aria-selected={tab === 'more'}
        className={tab === 'more' ? 'active' : ''}
        onClick={() => onChange('more')}
        title="More"
      >
        ⚙️
        <div className="small">More</div>
      </button>
    </nav>
  )
}
