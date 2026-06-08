import { notFound } from "next/navigation";
import { getListing } from "@/lib/actions/listings";
import { ListingForm } from "@/components/listings/listing-form";
import { decimalToInputValue, formatIntDisplay } from "@/lib/utils/format";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Edit listing</h1>
      <ListingForm
        listingId={id}
        initial={{
          photoUrl: listing.photoUrl ?? "",
          address: listing.address,
          city: listing.city,
          state: listing.state,
          zip: listing.zip,
          listPrice: decimalToInputValue(listing.listPrice),
          beds: formatIntDisplay(listing.beds, ""),
          baths: decimalToInputValue(listing.baths),
          sqft: formatIntDisplay(listing.sqft, ""),
          status: listing.status,
          description: listing.description ?? "",
        }}
      />
    </div>
  );
}
