import { Card } from "@/components/ui/card";
import { useRequest } from "@/hooks/useHooks";
import { referralService } from "@/services/referral";
import { formatNumber } from "@/utils/format";
import { Users, MousePointerClick, ArrowLeftRight, Wallet } from "lucide-react";

export function StatsCards() {
  const { data } = useRequest(referralService.querySummary);
  const { data: solPrice } = useRequest(referralService.querySolPrice);

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
      {/* <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs sm:text-sm font-medium">Link Clicks</h3>
        </div>
        <p className="mt-2 sm:mt-4 text-xl sm:text-2xl font-bold">{data?.link_clicks}</p>
      </Card> */}

      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs sm:text-sm font-medium">Invited Users</h3>
        </div>
        <p className="mt-2 sm:mt-4 text-xl sm:text-2xl font-bold">{data?.invite_total}</p>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs sm:text-sm font-medium">Transactions</h3>
        </div>
        <p className="mt-2 sm:mt-4 text-xl sm:text-2xl font-bold">{data?.transactions}</p>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs sm:text-sm font-medium">Total Volume</h3>
        </div>
        <div className="mt-2 sm:mt-4 space-y-1">
          <p className="text-xl sm:text-2xl font-bold">
            {formatNumber(data?.sol_amount || 0)} SOL
          </p>
          <p className="text-sm sm:text-base text-muted-foreground">
            ≈{" "}
            {formatNumber((data?.sol_amount || 0) * (solPrice || 0), {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
      </Card>
    </div>
  );
}
