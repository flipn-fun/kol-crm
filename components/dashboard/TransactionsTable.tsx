"use client";

import { Card } from "@/components/ui/card";
import { useRequest } from "@/hooks/useHooks";
import { referralService } from "@/services/referral";
import dayjs from "@/utils/dayjs";
import {
  formatExplorerUrl,
  formatNumber,
  formatNumberWithSubscript,
  formatSortAddress,
} from "@/utils/format";
import Big from "big.js";

export function TransactionsTable() {
  const { data } = useRequest(referralService.queryRecentTransactions);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
      </div>
      <div className="overflow-auto max-h-[500px] text-sm max-sm:text-xs">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2 font-medium text-muted-foreground">
                Time
              </th>
              <th className="pb-2 font-medium text-muted-foreground">
                Type
              </th>
              <th className="pb-2 font-medium text-muted-foreground">
                Amount
              </th>
              <th className="pb-2 font-medium text-muted-foreground">
                Price (SOL)
              </th>
              <th className="pb-2 font-medium text-muted-foreground">
                Referral Fee (SOL)
              </th>
              <th className="pb-2 font-medium text-muted-foreground">
                Tx
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.list?.length ? (
              data?.list?.map((tx) => (
                <tr key={tx.id} className="border-b last:border-0">
                  <td className="py-3">
                    {dayjs(tx.time).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="py-3">
                    <span
                      className={
                        tx.type === "buy" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {tx.type === "buy" ? "Buy" : "Sell"}
                    </span>
                  </td>
                  <td className="py-3">
                    {formatNumber(tx.token_amount, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    <span className="text-gray-400">{tx.token_symbol}</span>
                  </td>
                  <td className="py-3">
                    {new Big(tx.price || 0).lt(1)
                      ? formatNumberWithSubscript(tx.price)
                      : formatNumber(tx.price)}
                  </td>
                  <td className="py-3">
                    {new Big(tx.referral_fee || 0).lt(1)
                      ? formatNumberWithSubscript(tx.referral_fee)
                      : formatNumber(tx.referral_fee)}
                  </td>
                  <td className="py-3 font-mono">
                    <a
                      href={formatExplorerUrl(tx.tx_hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatSortAddress(tx.tx_hash)}
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-gray-300 text-xs"
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
