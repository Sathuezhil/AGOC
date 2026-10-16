import OpsTag from "@/components/home/OpsTag";
import type { OpsStatusRow } from "@/lib/pages-ops";

export default function OpsStatusPanel({
  title,
  meta,
  rows,
  badge,
  footer,
  numbered = false,
}: {
  title: string;
  meta?: string;
  rows: OpsStatusRow[];
  badge?: string;
  footer?: React.ReactNode;
  numbered?: boolean;
}) {
  return (
    <div className="ops-panel">
      <div className="ops-window-bar">
        <span className="flex gap-1.5" aria-hidden>
          <i className="ops-dot bg-[#FF5F57]" />
          <i className="ops-dot bg-[#FEBC2E]" />
          <i className="ops-dot bg-[#28C840]" />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#0B1F2A]">{title}</span>
        {badge ? <OpsTag tone="info">{badge}</OpsTag> : null}
      </div>
      <div className="p-4 sm:p-5">
        {meta ? (
          <p className="ops-mono mb-3 text-[0.65rem] tracking-[0.2em] text-[#8593A3] uppercase rtl:tracking-normal">
            {meta}
          </p>
        ) : null}
        <ul className="space-y-2">
          {rows.map((row, i) => (
            <li
              key={row.label}
              className={`ops-row ${row.tone === "live" ? "is-focus" : ""}`}
              style={{ animationDelay: `${500 + i * 120}ms` }}
            >
              {numbered ? <span className="ops-code">{String(i + 1).padStart(2, "0")}</span> : null}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.92rem] font-semibold text-[#0B1F2A]">{row.label}</span>
                <span className="ops-mono block truncate text-[0.7rem] text-[#6B7A8B]">{row.meta}</span>
              </span>
              <OpsTag tone={row.tone}>{row.tag}</OpsTag>
            </li>
          ))}
        </ul>
        {footer ? <div className="mt-4">{footer}</div> : null}
      </div>
    </div>
  );
}
