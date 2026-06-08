import { ListingForm } from "@/components/listings/listing-form";

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">New listing</h1>
      <ListingForm />
    </div>
  );
}
