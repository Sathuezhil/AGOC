import Reveal from "@/components/Reveal";
import type { OpsStep } from "@/lib/pages-ops";
import OpsSectionHead from "./OpsSectionHead";

export default function OpsProcess({
  label,
  title,
  accent,
  text,
  steps,
  dark = false,
}: {
  label: string;
  title: string;
  accent?: string;
  text?: string;
  steps: OpsStep[];
  dark?: boolean;
}) {
  return (
    <section className={`${dark ? "ops-dark" : "ops-light"} relative overflow-hidden py-20 md:py-28`}>
      <div className="relative mx-auto max-w-6xl px-5">
        <OpsSectionHead label={label} title={title} accent={accent} text={text} dark={dark} center />
        <div
          className={`ops-steps mt-14 grid gap-5 ${
            steps.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"
          } ${dark ? "ops-steps-dark" : ""}`}
        >
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 110} className="h-full">
              <div className="ops-step h-full">
                <span className="ops-step-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{step.title}</h3>
                <p className="ops-step-text mt-2 text-[0.94rem] leading-relaxed">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
