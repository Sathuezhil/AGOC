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
    <section className="relative overflow-hidden py-20 md:py-24">
      <div
        className="service-image-float absolute inset-0 scale-105 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
        {items.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i * 120}
            motion={i === 0 ? "left" : "right"}
          >
            <Card3D intensity={10}>
              <article className="flex h-full flex-col items-center rounded-2xl border-[3px] border-gold bg-navy px-8 py-10 text-center text-white shadow-xl transition-shadow duration-500 hover:shadow-2xl md:px-10 md:py-12">
                <h2 className="font-display text-3xl text-gold md:text-4xl">{item.title}</h2>
                <span className="mt-4 block h-px w-12 bg-gold/70" />
                <p className="mt-5 text-sm leading-relaxed text-white/90 md:text-base">
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
