import { useEffect, useRef, useState } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  lang?: string;        // es. 'it-IT' | 'en-US'
  multiline?: boolean;  // se true usa <textarea>
  disabled?: boolean;
};

export default function VoiceInput({
  value, onChange, placeholder, lang='it-IT', multiline=false, disabled
}: Props) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      const rec = new SR();
      rec.lang = lang;
      rec.interimResults = true;
      rec.continuous = false;
      rec.onresult = (e: any) => {
        let t = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          t += e.results[i][0].transcript;
        }
        onChange((value ? value + ' ' : '') + t.trim());
      };
      rec.onend = () => setListening(false);
      recRef.current = rec;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    if (!recRef.current) {
      alert('Riconoscimento vocale non supportato sul tuo browser.');
      return;
    }
    setListening(true);
    try { recRef.current.start(); } catch {}
  }
  function stop() { try { recRef.current?.stop(); } catch {} }

  return (
    <div style={{display:'flex', gap:8, alignItems:'center', width:'100%'}}>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={e=>onChange(e.target.value)}
          disabled={disabled}
          style={{flex:1, minHeight:60}}
        />
      ) : (
        <input
          placeholder={placeholder}
          value={value}
          onChange={e=>onChange(e.target.value)}
          disabled={disabled}
          style={{flex:1}}
        />
      )}
      <button
        type="button"
        onMouseDown={start} onMouseUp={stop} onTouchStart={start} onTouchEnd={stop}
        disabled={!supported || disabled}
        className="badge"
        title={supported ? 'Tieni premuto per parlare' : 'Non supportato'}
        style={{minWidth:44}}
      >
        {listening ? '🎙️' : '🎤'}
      </button>
    </div>
  );
}
