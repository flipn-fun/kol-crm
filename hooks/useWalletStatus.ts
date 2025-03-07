import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    solanaWallet?: ReturnType<typeof useWalletStatus>;
  }
}

export function useWalletStatus() {
  const { connection } = useConnection();
  const walletHooks = useWallet();
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    window.solanaWallet={
      ...walletHooks,
      connection,
      isReady,
      account:walletHooks.publicKey?.toBase58(),
    }
  }, [walletHooks, connection, isReady])

  return {
    ...walletHooks,
    connection,
    isReady,
    account:walletHooks.publicKey?.toBase58(),
  }
} 