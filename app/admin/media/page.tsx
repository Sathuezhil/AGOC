import MediaManager from "./MediaManager";

export default function MediaAdminPage() {
  return (
    <div>
      <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
        Library
      </p>
      <h1 className="mt-4 font-display text-4xl text-sand">Images</h1>
      <p className="mt-2 max-w-2xl text-mist">
        Upload photos, then pick them when editing services or website texts.
      </p>
      <MediaManager />
    </div>
  );
}
