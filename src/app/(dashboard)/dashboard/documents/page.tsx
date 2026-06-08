import { Upload, FileCheck, ClipboardList } from "lucide-react";
import { AppCard, AppCardBody, AppCardHeader } from "@/components/ui/app-card";
import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
          Documents
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Uploads, pre-approvals, and closing checklists.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AppCard>
          <AppCardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h2 className="text-sm font-semibold">Upload documents</h2>
            </div>
          </AppCardHeader>
          <AppCardBody>
            <div className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 text-center">
              <Upload className="h-8 w-8 text-muted-foreground/60" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-muted-foreground">
                Drag files here or click to browse
              </p>
              <Button variant="outline" size="sm" className="mt-4" disabled>
                Choose files
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Storage integration coming soon
              </p>
            </div>
          </AppCardBody>
        </AppCard>

        <AppCard>
          <AppCardHeader>
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h2 className="text-sm font-semibold">Pre-approval tracker</h2>
            </div>
          </AppCardHeader>
          <AppCardBody className="space-y-3">
            {[
              { client: "—", lender: "Pending setup", status: "Not started" },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{row.client}</p>
                  <p className="text-xs text-muted-foreground">{row.lender}</p>
                </div>
                <span className="text-xs text-muted-foreground">{row.status}</span>
              </div>
            ))}
          </AppCardBody>
        </AppCard>

        <AppCard>
          <AppCardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h2 className="text-sm font-semibold">Closing checklist</h2>
            </div>
          </AppCardHeader>
          <AppCardBody>
            <ul className="space-y-2 text-sm">
              {[
                "Purchase agreement signed",
                "Inspection completed",
                "Appraisal ordered",
                "Title search",
                "Final walkthrough",
                "Closing disclosure",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                >
                  <span className="h-4 w-4 rounded border border-border" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </AppCardBody>
        </AppCard>
      </div>
    </div>
  );
}
