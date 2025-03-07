'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@/lib/solana/wallet-adapter/modal'
import { Copy } from 'lucide-react'
import { useState } from 'react'

export function WalletAddress() {
  const { publicKey } = useWallet()
  const [copied, setCopied] = useState(false)

  if (!publicKey) return null

  const address = publicKey.toBase58()
  const displayAddress = `${address.slice(0, 6)}****${address.slice(-4)}`

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address', err)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton className="h-11 mb-0 px-3" />
      {/* <button
        onClick={copyAddress}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
      >
        <span className="font-mono">{displayAddress}</span>
        <Copy className="h-4 w-4" />
        {copied && (
          <span className="absolute bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg -mt-8 right-0">
            Copied
          </span>
        )}
      </button> */}
    </div>
  )
} 