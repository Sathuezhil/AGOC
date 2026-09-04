import { listOffers } from "@/lib/offers";
import { getServices } from "@/lib/services";
import OffersManager from "./OffersManager";

export default async function AdminOffersPage() {
  const [offers, services] = await Promise.all([
    listOffers({ includeHidden: true }),
    getServices(),
  ]);
  const live = offers.filter((o) => !o.hidden).length;
  const serviceOptions = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    short: s.short,
    image: s.image,
  }));

  return (
    <div>
      <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
        Promotions
      </p>
      <h1 className="mt-4 font-display text-4xl text-sand">Offers</h1>
      <p className="mt-2 max-w-2xl text-mist">
        Create offers linked to a service. Title, image, and enquire button come
        from that service. Arabic is generated automatically.
      </p>
      <p className="mt-2 text-sm text-mist">
        {live} live · {offers.length} total
      </p>
      <div className="mt-8">
        <OffersManager initialOffers={offers} services={serviceOptions} />
      </div>
    </div>
  );
}
