"use client";

import { useEffect, useState } from "react";
import { WalletConnect } from "../wallet/WalletConnect";
import { WalletAddress } from "../wallet/WalletAddress";
import { StatsCards } from "./StatsCards";
import { TransactionsTable } from "./TransactionsTable";
import { RewardsCard } from "./RewardsCard";
import { ActiveUsersTable } from "./ActiveUsersTable";
import { InviteLink } from "./InviteLink";
import { useWalletStatus } from "@/hooks/useWalletStatus";
import { ChartSection } from "./ChartSection";
import { authService } from "@/services/auth";
import { useRequest } from "@/hooks/useHooks";
import { useAuthStore, getAddressToken } from "@/stores/auth";
import { InviteCodes } from "./InviteCodes";

export function DashboardPage() {
  const { connected, account, isReady } = useWalletStatus();
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    if (account) {
      const savedToken = getAddressToken(account);
      setToken(savedToken, account);
    }
  }, [account, setToken]);

  const { loading } = useRequest(authService.auth, {
    refreshDeps: [account, connected, token],
    before: () => !!(account && connected) && !token,
    onSuccess: (res) => {
      setToken(res, account);
    },
  });

  if (!isReady || loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        loading...
      </div>
    );
  }

  if (!connected || !token) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <WalletConnect onConnect={() => {}} />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">KOL Dashboard</h1>
        <WalletAddress />
      </div>

      <StatsCards />

      <div className="grid gap-4 sm:gap-6 grid-cols-2 max-sm:grid-cols-1">
        <RewardsCard />
        {/* <InviteLink /> */}
         <InviteCodes />
      </div>

      <ChartSection />

      <div className="grid gap-4 sm:gap-6 grid-cols-2 max-sm:grid-cols-1">
        <ActiveUsersTable />
        <TransactionsTable />
      </div>
    </div>
  );
}
