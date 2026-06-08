import { notFound } from "next/navigation";
import { getClient } from "@/lib/actions/clients";
import { ClientForm } from "@/components/clients/client-form";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Edit client</h1>
      <ClientForm
        mode="edit"
        clientId={id}
        initial={{
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email ?? "",
          phone: client.phone ?? "",
          clientType: client.clientType,
          status: client.status,
        }}
      />
    </div>
  );
}
