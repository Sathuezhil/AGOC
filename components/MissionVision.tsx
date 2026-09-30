import Reveal from "@/components/Reveal";
import Card3D from "@/components/Card3D";

export default function MissionVision({
  missionTitle,
  missionText,
  visionTitle,
  visionText,
  image,
}: {
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  image: string;
}) {
  const items = [
    { title: missionTitle, text: missionText },
    { title: visionTitle, text: visionText },
  ];

  return (
    <section className="mission-vision relative overflow-hidden section-y">
      {/* Watermark — contain so logo isn’t cropped */}
      <div
        className="mission-vision-bg absolute inset-0"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />
      {/* Soft vignette — keeps cards readable, logo still visible */}
      <div className="mission-vision-veil pointer-events-none absolute inset-0" aria-hidden />

      <div className="site-wrap relative grid gap-cards md:grid-cols-2">
        {items.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i * 120}
            motion={i === 0 ? "left" : "right"}
          >
            <Card3D intensity={10}>
              <article className="flex h-full flex-col items-center rounded-2xl border-[3px] border-gold bg-navy/92 px-8 py-10 text-center text-white shadow-xl backdrop-blur-[2px] transition-shadow duration-500 hover:shadow-2xl md:px-10 md:py-12">
                <h2 className="type-card text-gold md:text-[1.75rem]">
                  {item.title}
                </h2>
                <span className="mt-4 block h-px w-12 bg-gold/70" />
                <p className="type-body measure mt-5 text-white/90">
                  {item.text}
                </p>
              </article>
            </Card3D>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
