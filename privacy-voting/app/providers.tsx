'use client';

import { FhevmProvider } from '@fhevm/sdk';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      {children}
    </FhevmProvider>
  );
}
