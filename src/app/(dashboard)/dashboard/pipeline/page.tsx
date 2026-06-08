import { getTransactions, updateTransactionStage } from "@/lib/actions/transactions";
import {
  formatClientName,
  formatCurrency,
  transactionStageLabel,
} from "@/lib/utils/labels";
import { AppCard, AppCardBody, AppCardHeader } from "@/components/ui/app-card";
import { Button } from "@/components/ui/button";
import type { TransactionStage } from "@/generated/prisma/client";

const STAGES: TransactionStage[] = [
  "LEAD",
  "SHOWING",
  "OFFER",
  "UNDER_CONTRACT",
  "CLOSED",
  "LOST",
];

export default async function PipelinePage() {
  const transactions = await getTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
          Pipeline
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kanban view from lead through closing.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const items = transactions.filter((t) => t.stage === stage);
          return (
            <div key={stage} className="min-w-[240px] flex-1">
              <AppCard className="h-full">
                <AppCardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold">
                      {transactionStageLabel(stage)}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                </AppCardHeader>
                <AppCardBody className="space-y-2">
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-4 text-center">
                      No deals
                    </p>
                  ) : (
                    items.map((tx) => (
                      <div
                        key={tx.id}
                        className="rounded-lg border border-border bg-background p-3 text-sm"
                      >
                        <p className="font-medium">{tx.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatCurrency(tx.value ? Number(tx.value) : null)}
                        </p>
                        {tx.client && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatClientName(
                              tx.client.firstName,
                              tx.client.lastName
                            )}
                          </p>
                        )}
                        <form
                          action={async (fd) => {
                            "use server";
                            const next = fd.get("stage") as TransactionStage;
                            if (next && next !== tx.stage) {
                              await updateTransactionStage(tx.id, next);
                            }
                          }}
                          className="mt-2"
                        >
                          <select
                            name="stage"
                            defaultValue={tx.stage}
                            className="h-7 w-full rounded-md border border-input bg-background px-2 text-xs"
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>
                                {transactionStageLabel(s)}
                              </option>
                            ))}
                          </select>
                          <Button
                            type="submit"
                            size="sm"
                            variant="ghost"
                            className="mt-1 h-7 w-full text-xs"
                          >
                            Move
                          </Button>
                        </form>
                      </div>
                    ))
                  )}
                </AppCardBody>
              </AppCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
