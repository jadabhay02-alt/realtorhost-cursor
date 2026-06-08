import { getTransactions, createTransaction, updateTransactionStage, deleteTransaction } from "@/lib/actions/transactions";
import { getClients } from "@/lib/actions/clients";
import { formatClientName, formatCurrency, transactionStageLabel } from "@/lib/utils/labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TransactionStage } from "@/generated/prisma/client";

export default async function TransactionsPage() {
  const [transactions, clients] = await Promise.all([
    getTransactions(),
    getClients(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Track deals in progress — kept simple for MVP.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async (fd) => {
              "use server";
              await createTransaction({
                title: fd.get("title") as string,
                clientId: (fd.get("clientId") as string) || undefined,
                value: fd.get("value") ? Number(fd.get("value")) : undefined,
              });
            }}
            className="flex flex-wrap gap-3 items-end"
          >
            <Input name="title" placeholder="Transaction title" required className="max-w-xs" />
            <select
              name="clientId"
              className="flex h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
            >
              <option value="">No client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {formatClientName(c.firstName, c.lastName)}
                </option>
              ))}
            </select>
            <Input name="value" type="number" placeholder="Value" className="max-w-[120px]" />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{tx.title}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(tx.value)}
                {tx.client &&
                  ` · ${formatClientName(tx.client.firstName, tx.client.lastName)}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <form
                action={async (fd) => {
                  "use server";
                  await updateTransactionStage(
                    tx.id,
                    fd.get("stage") as TransactionStage
                  );
                }}
                className="flex gap-2"
              >
                <select
                  name="stage"
                  defaultValue={tx.stage}
                  className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
                >
                  {(
                    [
                      "LEAD",
                      "SHOWING",
                      "OFFER",
                      "UNDER_CONTRACT",
                      "CLOSED",
                      "LOST",
                    ] as TransactionStage[]
                  ).map((s) => (
                    <option key={s} value={s}>
                      {transactionStageLabel(s)}
                    </option>
                  ))}
                </select>
                <Button type="submit" size="sm" variant="outline">
                  Update
                </Button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await deleteTransaction(tx.id);
                }}
              >
                <Button type="submit" size="sm" variant="ghost">
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
