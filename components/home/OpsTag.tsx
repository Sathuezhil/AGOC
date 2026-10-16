import type { OpsTone } from "@/lib/home-ops";

export default function OpsTag({
  tone,
  children,
  className = "",
}: {
  tone: OpsTone;
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`ops-tag ops-tag-${tone} ${className}`}>{children}</span>;
}
