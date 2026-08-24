import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-28 text-center">
      <p className="olive-label text-sm tracking-[0.3em] text-olive uppercase">404</p>
      <h1 className="mt-4 font-display text-5xl text-sand">Page not found</h1>
      <p className="mt-4 max-w-md text-mist">
        The page has moved or never existed. Return home or speak with the
        operations team.
      </p>
      <Link
        href="/"
        className="mt-8 bg-crimson px-6 py-3 text-sm text-white hover:bg-crimson-dark"
      >
        Back to home
      </Link>
    </section>
  );
}
