import LocaleLink from "@/components/LocaleLink";

export type Crumb = { name: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={`${item.name}-${i}`}>
          {i > 0 ? <span className="mx-2 opacity-40">/</span> : null}
          {item.href ? (
            <LocaleLink href={item.href} className="transition hover:text-[#0066FF]">
              {item.name}
            </LocaleLink>
          ) : (
            <span className="text-[#0B1F2A]">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
