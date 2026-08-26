import { getContent } from "@/lib/content";
import ContentForm from "./ContentForm";

export default async function ContentAdminPage() {
  const content = await getContent();
  return (
    <div>
      <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
        Website
      </p>
      <h1 className="mt-4 font-display text-4xl text-sand">Texts & copy</h1>
      <p className="mt-2 max-w-2xl text-mist">
        Edit the important words and section images shown on the public site.
      </p>
      <ContentForm initial={content} />
    </div>
  );
}
