import Reveal from "@/components/Reveal";
import { splitAccent } from "@/lib/pages-ops";

export default function OpsSectionHead({
  label,
  title,
  accent,
  text,
  dark = false,
  center = false,
  action,
}: {
  label: string;
  title: string;
  accent?: string;
  text?: string;
  dark?: boolean;
  center?: boolean;
  action?: React.ReactNode;
}) {
  const [lead, tail] = accent === undefined ? splitAccent(title) : [title, accent];
  return (
    <Reveal>
      <div
        className={`flex flex-col gap-6 ${
          center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
        }`}
      >
        <div className={center ? "max-w-3xl" : "max-w-3xl"}>
          <p className={`ops-eyebrow ${dark ? "ops-eyebrow-dark" : ""}`}>{label}</p>
          <h2 className={`ops-h2 mt-4 ${dark ? "text-white" : ""}`}>
            {lead ? <>{lead} </> : null}
            <span className={dark ? "ops-accent-dark" : "ops-accent"}>{tail}</span>
          </h2>
          {text ? (
            <p
              className={`mt-5 text-[1.05rem] leading-relaxed ${
                dark ? "text-white/75" : "text-[#3E4F61]"
              } ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
            >
              {text}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </Reveal>
  );
}
