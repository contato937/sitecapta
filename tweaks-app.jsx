/* Capta+Edu — Tweaks island. Drives CSS variables on the live page. */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#FF4D1C",
  "headingFont": "Space Grotesk",
  "background": "Preto",
  "roundness": 18
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const root = document.documentElement;
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--font-display', `'${t.headingFont}', system-ui, sans-serif`);
  root.style.setProperty('--radius', t.roundness + 'px');
  root.style.setProperty('--radius-lg', (t.roundness + 8) + 'px');
  root.style.setProperty('--radius-xl', (t.roundness + 18) + 'px');
  document.body.classList.toggle('bg-midnight', t.background === 'Azul-meia-noite');
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => { applyTweaks(t); }, [t]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Marca" />
      <TweakColor
        label="Cor de destaque"
        value={t.accent}
        options={['#FF4D1C', '#1E8BFF', '#7A5AE0', '#1F9D6B']}
        onChange={(v) => setTweak('accent', v)}
      />
      <TweakSection label="Tipografia" />
      <TweakSelect
        label="Fonte dos títulos"
        value={t.headingFont}
        options={['Space Grotesk', 'Sora', 'Manrope']}
        onChange={(v) => setTweak('headingFont', v)}
      />
      <TweakSection label="Aparência" />
      <TweakRadio
        label="Fundo"
        value={t.background}
        options={['Preto', 'Azul-meia-noite']}
        onChange={(v) => setTweak('background', v)}
      />
      <TweakSlider
        label="Arredondamento"
        value={t.roundness}
        min={6} max={28} step={1} unit="px"
        onChange={(v) => setTweak('roundness', v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TweaksApp />);
