import type { CSSProperties } from "react";

type Part = { text: string; accent?: boolean };

const ACCENT_STOPS: [number, number, number][] = [
  [0, 102, 255],
  [43, 140, 255],
  [201, 162, 39],
];

function accentColor(t: number) {
  const x = Math.min(0.9999, Math.max(0, t)) * (ACCENT_STOPS.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = ACCENT_STOPS[i];
  const b = ACCENT_STOPS[i + 1];
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/**
 * Headline split into words and letters for the letter-in entrance and the cursor weight effect.
 * Arabic is split by word only: splitting joined Arabic letters breaks their shapes.
 */
export default function SplitText({
  parts,
  rtl = false,
  delay = 120,
  stagger = 22,
  lineBreak = false,
}: {
  parts: Part[];
  rtl?: boolean;
  delay?: number;
  stagger?: number;
  lineBreak?: boolean;
}) {
  const full = parts.map((p) => p.text).join(" ");
  let index = 0;

  return (
    <>
      <span className="sr-only">{full}</span>
      <span aria-hidden className="ops-split">
        {parts.map((part, pi) => {
          const words = part.text.split(/\s+/).filter(Boolean);
          const accentLetters = part.accent ? words.join("").length : 0;
          let accentSeen = 0;
          const content = words.map((word, wi) => {
            const wordStart = index;
            if (rtl) {
              index += 1;
              return (
                <span key={`${pi}-${wi}`}>
                  <span
                    className={`ops-word ${part.accent ? "ops-accent" : ""}`}
                    style={{ "--d": `${delay + wordStart * stagger * 3}ms` } as CSSProperties}
                  >
                    {word}
                  </span>{" "}
                </span>
              );
            }
            const letters = Array.from(word);
            index += letters.length;
            return (
              <span key={`${pi}-${wi}`}>
                <span className="ops-word">
                  {letters.map((ch, ci) => {
                    const style: Record<string, string> = { "--d": `${delay + (wordStart + ci) * stagger}ms` };
                    if (part.accent) {
                      style.color = accentColor(accentLetters > 1 ? accentSeen / (accentLetters - 1) : 0);
                      accentSeen += 1;
                    }
                    return (
                      <span key={ci} className="kch" style={style as CSSProperties}>
                        {ch}
                      </span>
                    );
                  })}
                </span>{" "}
              </span>
            );
          });
          return (
            <span key={pi} className={lineBreak ? "block" : undefined}>
              {content}
            </span>
          );
        })}
      </span>
    </>
  );
}
