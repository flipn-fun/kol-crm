"use client";

import { Card } from "@/components/ui/card";
import { useRequest } from "@/hooks/useHooks";
import { referralService } from "@/services/referral";
import dayjs from "dayjs";
import { User } from "lucide-react";
import { Loading } from "../ui/Loading";
import { formatExplorerUrl, formatSortAddress } from "@/utils/format";

export function ActiveUsersTable() {
  const { data, loading } = useRequest(referralService.queryReferralUsers);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Active Users</h2>
      </div>

      <div className="overflow-auto max-h-[500px] text-sm max-sm:text-xs">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2 font-medium text-muted-foreground">
                User
              </th>
              <th className="pb-2 font-medium text-muted-foreground">
                Last Active
              </th>
              <th className="pb-2 font-medium text-muted-foreground">
                Transactions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.list?.length ? (
              data?.list?.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="py-3 font-mono">
                    <a
                      href={formatExplorerUrl(user.address, "account")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatSortAddress(user.address)}
                    </a>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {dayjs(user.update_time).fromNow()}
                  </td>
                  <td className="py-3">{user.transactions}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="p-4 text-center text-gray-300 text-xs"
                >
                  {loading ? <Loading /> : "No data"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
