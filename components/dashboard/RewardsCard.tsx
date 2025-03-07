"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useRequest } from "@/hooks/useHooks";
import { referralService } from "@/services/referral";
import {
  formatExplorerUrl,
  formatNumber,
  formatNumberWithSubscript,
  formatSortAddress,
} from "@/utils/format";
import dayjs from "@/utils/dayjs";
import { Loading } from "../ui/Loading";
import Big from "big.js";

export function RewardsCard() {
  const [showTxDetails, setShowTxDetails] = useState(false);
  const { data: totalRewards } = useRequest(referralService.querySummary);
  const { data: lastTx, loading: lastTxLoading } = useRequest(
    async () => {
      const res = await referralService.queryRecentTransactions(0, 1);
      return res?.list?.[0];
    },
    {
      refreshDeps: [showTxDetails],
      before: () => showTxDetails,
      onSuccess: (res) =>
        !res && setTimeout(() => setShowTxDetails(false), 2000),
    }
  );

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Coins className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Rewards Summary</h2>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Rewards</span>
          <span className="font-bold">
            {new Big(totalRewards?.referral_fee || 0).lt(1)
              ? formatNumberWithSubscript(totalRewards?.referral_fee || 0)
              : formatNumber((totalRewards?.referral_fee || 0), {
                  maximumFractionDigits: 6,
                })}{" "}
            SOL
          </span>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowTxDetails(!showTxDetails)}
        >
          View Latest Reward Transaction
        </Button>

        {showTxDetails &&
          (lastTx ? (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-medium">
                  <span
                    className={
                      lastTx.type === "buy"
                        ? "text-green-600 mr-1"
                        : "text-red-600 mr-1"
                    }
                  >
                    {lastTx.type === "buy" ? "Buy" : "Sell"}
                  </span>
                  {formatNumber(lastTx.token_amount || 0, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  <span className="text-gray-400">{lastTx.token_symbol}</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Timestamp</span>
                <span className="font-medium">
                  {dayjs(lastTx?.time).format("YYYY-MM-DD HH:mm")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Transaction Hash
                </span>
                <a
                  href={formatExplorerUrl(lastTx?.tx_hash)}
                  target="_blank"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {formatSortAddress(lastTx?.tx_hash)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-300 text-xs">
              {lastTxLoading ? <Loading /> : "No data"}
            </div>
          ))}
      </div>
    </Card>
  );
}
