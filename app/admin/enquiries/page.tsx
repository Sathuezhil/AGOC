import { listEnquiries } from "@/lib/enquiries";
import EnquiryTable from "./EnquiryTable";

export default async function EnquiriesPage() {
  const items = await listEnquiries();
  const fresh = items.filter((item) => item.status === "new").length;

  return (
    <div>
      <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
        Inbox
      </p>
      <h1 className="mt-4 font-display text-4xl text-sand">Enquiries</h1>
      <p className="mt-2 text-mist">
        {fresh} new · {items.length} total. These are people who wrote in
        through the public site.
      </p>
      <EnquiryTable items={items} />
    </div>
  );
}
