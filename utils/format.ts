
import { generateUrl } from '.';

export function formatSortAddress(address: string | undefined) {
  if (!address) return '';

  const domainSuffixes = ['.near', '.testnet', '.betanet', '.mainnet'];
  const maxLength = 12;

  const suffix = domainSuffixes.find((suffix) => address.endsWith(suffix));
  const isLongAddress = address.length > maxLength;

  if (suffix) {
    if (isLongAddress) {
      const visiblePartLength = maxLength - suffix.length - 10;
      if (visiblePartLength > 0) {
        return `${address.slice(0, 6)}...${address.slice(
          -4 - suffix.length,
          -suffix.length,
        )}${suffix}`;
      } else {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
      }
    } else {
      return address;
    }
  } else {
    return isLongAddress ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  }
}

export function formatNumber(val: string | number | undefined, options?: Intl.NumberFormatOptions) {
  if (val === undefined) return '';
  return new Intl.NumberFormat('en-US', options).format(Number(val));
}

const subscriptNumbers = [
  '₀',
  '₁',
  '₂',
  '₃',
  '₄',
  '₅',
  '₆',
  '₇',
  '₈',
  '₉',
  '₁₀',
  '₁₁',
  '₁₂',
  '₁₃',
  '₁₄',
  '₁₅',
  '₁₆',
  '₁₇',
  '₁₈',
  '₁₉',
  '₂₀',
];

export function formatNumberWithSubscript(value: string | number): string {
  const strVal = value.toString();
  const parts = strVal.split('.');
  if (parts.length <= 1) return strVal;

  const leadingZeros = parts[1].match(/^0+/)?.[0]?.length || 0;
  if (leadingZeros > 3 && leadingZeros <= 20) {
    const remainingDigits = parts[1].slice(leadingZeros);
    const subscriptNumber = subscriptNumbers[leadingZeros];
    parts[1] = '0' + subscriptNumber + remainingDigits;
  }
  return parts.join('.');
}

const explorerUrls = {
  solana: 'https://solscan.io',
};

export function formatExplorerUrl(
  val: string,
  type: 'transaction' | 'account' | 'token' = 'transaction',
) {
  return generateUrl(`${explorerUrls.solana}/${type === 'transaction' ? 'tx' : type}/${val}`, {
    cluster: process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'devnet' : 'mainnet-beta',
  });
}

