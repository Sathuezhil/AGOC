import LocaleLink from "@/components/LocaleLink";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

export default async function NotFound() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-28 text-center">
      <p className="olive-label text-sm tracking-[0.3em] text-olive uppercase">404</p>
      <h1 className="mt-4 font-display text-5xl text-sand">{dict.notFound.title}</h1>
      <p className="mt-4 max-w-md text-mist">{dict.notFound.text}</p>
      <LocaleLink
        href="/"
        className="mt-8 bg-crimson px-6 py-3 text-sm text-white hover:bg-crimson-dark"
      >
        {dict.notFound.back}
      </LocaleLink>
    </section>
  );
}
