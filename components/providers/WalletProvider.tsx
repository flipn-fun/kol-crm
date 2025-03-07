"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@/lib/solana/wallet-adapter/modal";
import { OkxWalletAdapter } from "@/lib/solana/wallet-adapter/okx";
import { OkxWalletUIAdapter } from "@/lib/solana/wallet-adapter/okx/ui";
import {
  WalletConnectWalletAdapter,
  WalletConnectWalletAdapterConfig,
} from "@/lib/solana/wallet-adapter/walletconnect";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { getDeviceType } from "@/utils";

import "@/lib/solana/wallet-adapter/modal/index.css";

const WALLET_CONNECT_METADATA = {
  name: 'Meme KOLs Platform',
  description: "Meme KOLs Platform",
  url: typeof window !== "undefined" ? window.location.origin : "",
  icons: [
    typeof window !== "undefined"
      ? window.location.origin + "/favicon.ico"
      : "",
  ],
};

const WALLET_CONNECT_OPTIONS: WalletConnectWalletAdapterConfig["options"] = {
  projectId: "669d1b9f59163a92d90a3c1ff78a7326",
  metadata: WALLET_CONNECT_METADATA,
  features: {
    analytics: false,
    email: false,
    socials: false,
    emailShowWallets: false,
  },
};

function getEndpoint(
  netType = process.env.NEXT_PUBLIC_NETWORK as WalletAdapterNetwork
) {
  if (netType === WalletAdapterNetwork.Mainnet) {
    return (
      process.env.NEXT_PUBLIC_ENDPOINT ||
      "https://solana-mainnet.core.chainstack.com/26539386617197b730ed9e3c81b611df"
    );
  }

  return clusterApiUrl(netType);
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const network = process.env.NEXT_PUBLIC_NETWORK as WalletAdapterNetwork;
  const endpoint = useMemo(() => getEndpoint(network), []);

  const wallets = useMemo(() => {
    if (typeof window === "undefined") return [];
    return getDeviceType().mobile
      ? [
          new OkxWalletUIAdapter(),
          new WalletConnectWalletAdapter({
            network,
            options: WALLET_CONNECT_OPTIONS,
          }),
        ]
      : [
          new PhantomWalletAdapter(),
          new OkxWalletAdapter(),
          new WalletConnectWalletAdapter({
            network,
            options: WALLET_CONNECT_OPTIONS,
          }),
        ];
  }, []);

  const sortedWallets = ["WalletConnect", "Backpack", "Phantom", "OKX Wallet"];
  const disabledWallets = ["MetaMask"];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider
          sortedWallets={sortedWallets}
          disabledWallets={disabledWallets}
        >
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
