import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean; error?: unknown }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('React error boundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{minHeight:'100dvh',display:'grid',placeItems:'center',background:'var(--bg)',color:'var(--fg)'}}>
          <div className="card" style={{maxWidth:700}}>
            <h2>App error</h2>
            <p style={{color:'var(--muted)'}}>Something went wrong while rendering.</p>
            <pre style={{whiteSpace:'pre-wrap',fontSize:12,opacity:.9}}>
              {String((this.state.error as any)?.message ?? this.state.error ?? 'Unknown error')}
            </pre>
            <div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}}>
              <a className="tab" href="/health" style={{textDecoration:'none'}}>Open health check</a>
              <a className="tab" href="/" style={{textDecoration:'none'}}>Home</a>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
