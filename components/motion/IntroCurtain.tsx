const SHIELD_PATH =
  "M0,-1.12 C0.34,-0.97 0.64,-0.94 0.92,-0.98 C0.95,-0.28 0.8,0.56 0,1.12 C-0.8,0.56 -0.95,-0.28 -0.92,-0.98 C-0.64,-0.94 -0.34,-0.97 0,-1.12 Z";

export const introInitScript = `(function(){try{var d=document.documentElement;var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!r)d.setAttribute('data-motion','1');if(r||sessionStorage.getItem('agoc-intro')){d.setAttribute('data-intro-seen','1');}else{d.setAttribute('data-intro','1');sessionStorage.setItem('agoc-intro','1');setTimeout(function(){d.removeAttribute('data-intro');},1450);}setTimeout(function(){if(!window.__agocMotion)d.removeAttribute('data-motion');},8000);}catch(e){}})();`;

export default function IntroCurtain({ tagline }: { tagline: string }) {
  return (
    <div className="ops-curtain" aria-hidden>
      <div className="ops-curtain-glow" />
      <div className="ops-curtain-inner">
        <svg viewBox="-1.2 -1.3 2.4 2.6" className="ops-curtain-mark">
          <path d={SHIELD_PATH} pathLength={1} className="ops-curtain-outline" />
          <path d={SHIELD_PATH} transform="translate(0 -0.024) scale(0.6)" pathLength={1} className="ops-curtain-ring" />
        </svg>
        <span className="ops-curtain-word">
          {["A", "G", "O", "C"].map((ch, i) => (
            <span key={ch} style={{ animationDelay: `${0.35 + i * 0.07}s` }}>
              {ch}
            </span>
          ))}
        </span>
        <span className="ops-curtain-sub">{tagline}</span>
        <span className="ops-curtain-line">
          <i />
        </span>
      </div>
    </div>
  );
}
