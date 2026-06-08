import { ClientForm } from "@/components/clients/client-form";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New client</h1>
        <p className="text-muted-foreground">
          Add a buyer, seller, or both to start collaborating.
        </p>
      </div>
      <ClientForm mode="create" />
    </div>
  );
}
