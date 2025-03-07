declare namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_NETWORK: 'mainnet-beta' | 'devnet' | 'testnet';
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_REFERRAL_URL: string;
    }
  }
  