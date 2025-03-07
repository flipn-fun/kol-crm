"use client";

import { Card } from "@/components/ui/card";
import { useRequest } from "@/hooks/useHooks";
import { useWalletStatus } from "@/hooks/useWalletStatus";
import { referralService } from "@/services/referral";
import { Copy, Link } from "lucide-react";
import { useState, useMemo } from "react";

export function InviteLink() {
  const [copied, setCopied] = useState(false);

  const { data: link } = useRequest(referralService.queryReferralLink);

  const copyLink = async () => {
    try {
      if (!link) return;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Invite Link</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
        <span className="flex-1 font-mono text-sm truncate">
          {link || "Generating..."}
        </span>
        <button
          onClick={copyLink}
          className="p-2 hover:bg-background rounded-md transition-colors relative"
        >
          <Copy className="h-4 w-4" />
          {copied && (
            <span className="absolute right-0 -top-8 bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg text-sm whitespace-nowrap">
              Copied
            </span>
          )}
        </button>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Share this link with others. You'll earn rewards when they trade through
        your link.
      </p>
    </Card>
  );
}
