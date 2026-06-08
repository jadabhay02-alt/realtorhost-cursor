import { notFound } from "next/navigation";
import { getClient } from "@/lib/actions/clients";
import { requireSession } from "@/lib/auth/session";
import { ClientDetail } from "@/components/clients/client-detail";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  return (
    <ClientDetail client={client} currentUserId={session.user.id} />
  );
}
