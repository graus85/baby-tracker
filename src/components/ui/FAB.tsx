export default function FAB({ onClick }: { onClick: ()=>void }) {
  return (
    <button onClick={onClick} aria-label="Add"
      style={{
        position:'fixed', right:16, bottom:80, width:64, height:64, borderRadius:'50%',
        fontSize:28, border:'1px solid #30363d', background:'#0d1117', color:'#e6edf3',
        boxShadow:'0 6px 20px rgba(0,0,0,.35)', zIndex:10
      }}
    >+</button>
  );
}
