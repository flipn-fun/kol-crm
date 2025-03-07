'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@/lib/solana/wallet-adapter/modal'
import { useEffect } from 'react'

interface WalletConnectProps {
  onConnect: () => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const { connected } = useWallet()

  useEffect(() => {
    if (connected) {
      onConnect()
    }
  }, [connected, onConnect])

  return (
    <div className="text-center">
      <h2 className="mb-4 text-2xl font-bold">Connect Wallet</h2>
      <p className="mb-6 text-muted-foreground">
        Please connect your Solana wallet to access the dashboard
      </p>
      <div className="flex justify-center">
        <WalletMultiButton className='px-10' />
      </div>
    </div>
  )
} 