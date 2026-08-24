import Reveal from "@/components/Reveal";

const items = [
  {
    title: "Our Mission",
    text: "Our mission is to provide unparalleled security solutions that ensure the safety and peace of mind of our clients. We are dedicated to delivering professional, reliable, and innovative security services tailored to meet the unique needs of each individual or organization we serve.",
  },
  {
    title: "Our Vision",
    text: "Our vision is to be the leading provider of cutting-edge security solutions, setting the industry standard for excellence and innovation. We envision a future where safety is never compromised, and our services are trusted globally for their effectiveness, reliability, and responsiveness.",
  },
];

export default function MissionVision() {
  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url(/images/surveillance.jpg)" }}
      />
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 120} motion={i === 0 ? "left" : "right"}>
            <article className="flex h-full flex-col items-center rounded-2xl border-[3px] border-ink bg-crimson px-8 py-10 text-center text-white shadow-xl transition duration-500 hover:-translate-y-1 hover:shadow-2xl md:px-10 md:py-12">
              <h2 className="font-display text-3xl md:text-4xl">{item.title}</h2>
              <span className="mt-4 block h-px w-12 bg-white/70" />
              <p className="mt-5 text-sm leading-relaxed text-white/95 md:text-base">
                {item.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
