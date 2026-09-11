"use client";

import { useEffect, useState } from "react";

/** Map iframe mounts after hydration to avoid SSR/DOM mismatch. */
export default function FooterMap({
  mapSrc,
  mapLink,
  openMapAria,
  viewOnMap,
}: {
  mapSrc: string;
  mapLink: string;
  openMapAria: string;
  viewOnMap: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="footer-map group relative overflow-hidden rounded-lg border border-sand/15">
      {ready ? (
        <iframe
          title="AGOC Security office map"
          src={mapSrc}
          className="pointer-events-none h-28 w-full grayscale-[20%] transition duration-500 group-hover:grayscale-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
        />
      ) : (
        <div
          className="h-28 w-full bg-ink/60"
          aria-hidden
        />
      )}
      <a
        href={mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
        aria-label={openMapAria}
        title={openMapAria}
      >
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2.5 py-2 text-[10px] tracking-wide text-white uppercase rtl:tracking-normal rtl:normal-case">
          {viewOnMap}
        </span>
      </a>
    </div>
  );
}
