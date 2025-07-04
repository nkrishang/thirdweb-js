import Link from "next/link";
import { TeamPlanBadge } from "@/components/blocks/TeamPlanBadge";
import { Button } from "@/components/ui/button";
import type { CreditsRecord } from "./ApplyForOpCreditsModal";

type PlanCardProps = {
  creditsRecord: CreditsRecord;
  teamSlug: string;
};

export function PlanCard({ creditsRecord, teamSlug }: PlanCardProps) {
  return (
    <div className="relative rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold text-foreground text-lg tracking-tight">
          {creditsRecord.upTo || "Up To"} {creditsRecord.credits} Gas Credits
        </h2>
        <TeamPlanBadge plan={creditsRecord.plan} teamSlug={teamSlug} />
      </div>

      <div className="flex flex-col gap-2 px-6 py-4">
        {creditsRecord.features && (
          <ul className="list-disc space-y-1 pl-4 text-muted-foreground text-sm">
            {creditsRecord.features.map((feature) => (
              <li className="text-muted-foreground" key={feature}>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end border-t px-6 py-4">
        <Button
          asChild
          className="gap-2 bg-background"
          size="sm"
          variant="outline"
        >
          <Link href={`/team/${teamSlug}/~/settings/billing`}>Upgrade</Link>
        </Button>
      </div>
    </div>
  );
}
