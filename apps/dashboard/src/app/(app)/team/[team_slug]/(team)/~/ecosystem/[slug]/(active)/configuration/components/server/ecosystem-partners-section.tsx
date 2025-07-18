import type { Ecosystem } from "../../../../../types";
import { AddPartnerDialogButton } from "../client/AddPartnerDialogButton";
import { PartnersTable } from "./partners-table";

export function EcosystemPartnersSection({
  teamSlug,
  ecosystem,
  authToken,
  teamId,
}: {
  teamSlug: string;
  ecosystem: Ecosystem;
  authToken: string;
  teamId: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-6 lg:px-6">
      <div className="flex flex-col items-start justify-between max-sm:mb-5 lg:flex-row">
        <div>
          <h3 className="font-semibold text-xl tracking-tight">
            Ecosystem partners
          </h3>

          <p className="mt-1.5 mb-5 text-foreground text-sm">
            Configure apps that can use your wallet. Creating a partner will
            generate a unique partner ID that can access your ecosystem. <br />{" "}
            You will need to generate at least one partner ID for use in your
            own app.
          </p>
        </div>
        <AddPartnerDialogButton
          authToken={authToken}
          ecosystem={ecosystem}
          teamSlug={teamSlug}
        />
      </div>

      <PartnersTable
        authToken={authToken}
        ecosystem={ecosystem}
        teamId={teamId}
        teamSlug={teamSlug}
      />
    </div>
  );
}
