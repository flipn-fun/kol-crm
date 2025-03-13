"use client";

import { Card } from "@/components/ui/card";
import { useRequest } from "@/hooks/useHooks";
import { useWalletStatus } from "@/hooks/useWalletStatus";
import { referralService } from "@/services/referral";
import { formatSortAddress } from "@/utils/format";
import { Copy, Link } from "lucide-react";
import { useState, useMemo } from "react";

export function InviteCodes() {
  const { data } = useRequest(referralService.queryReferralCodes);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Invite Link</h2>
        </div>
      </div>
      {!!data?.code_list?.length && (
        <div className="flex items-center flex-wrap gap-2 mb-4">
          {data?.code_list?.map((item) => (
            <InviteLinkItem key={item.code} code={item.code} mode="link" />
          ))}
        </div>
      )}

      {!!data?.beta_code_list?.length && (
        <div className="flex items-center flex-wrap gap-2 mb-4">
          {data?.beta_code_list?.map((item) => (
            <InviteLinkItem
              key={item.code}
              code={item.code}
              usedAccountId={item.being_invited_account_id}
              mode="code"
            />
          ))}
        </div>
      )}
      <p className="mt-4 text-sm text-muted-foreground">
        Share this link with others. You'll earn rewards when they trade through
        your link.
      </p>
    </Card>
  );
}

function InviteLinkItem({
  mode,
  code,
  usedAccountId,
}: {
  mode: "code" | "link";
  code: string;
  usedAccountId?: string;
}) {
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => {
    return mode === "code" ? code : `${process.env.NEXT_PUBLIC_REFERRAL_URL}/ref?code=${code}`;
  }, [mode, code]);

  async function copyLink(  ) {
    try {
      if (!link) return;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  }

  const isUsed = !!usedAccountId;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-md ${
        isUsed ? "bg-muted/30" : "bg-muted/50"
      }`}
    >
      <div className="flex flex-col flex-1">
        <span
          className={`font-mono text-sm truncate whitespace-break-spaces break-all ${
            isUsed ? "text-muted-foreground" : ""
          }`}
        >
          {link}
        </span>
        {isUsed && (
          <span className="text-xs text-muted-foreground">
            Used by: {formatSortAddress(usedAccountId)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={copyLink}
          className="p-2 hover:bg-background rounded-md transition-colors relative"
          disabled={isUsed}
        >
          <Copy
            className={`h-4 w-4 ${isUsed ? "text-muted-foreground" : ""}`}
          />
          {copied && (
            <span className="absolute right-0 -top-8 bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg text-sm whitespace-nowrap">
              Copied
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
