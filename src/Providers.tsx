import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { passkeyConnector, wrapSmartWallet } from "@zerodev/wallet"
import { sepolia } from "viem/chains";
import { http, createConfig, WagmiProvider } from 'wagmi'
import { metaMask } from "wagmi/connectors"

const PROJECT_ID = import.meta.env.VITE_SEPOLIA_PROJECT_ID || "";

if (!PROJECT_ID) {
  throw new Error("Missing VITE_SEPOLIA_PROJECT_ID");
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  const config = createConfig({
    chains: [sepolia],
    connectors: [
        wrapSmartWallet(metaMask({
            dappMetadata: {
              name: "ZeroDev Walletconnect Demo",
            }
          }), PROJECT_ID, "v3"),
          passkeyConnector(PROJECT_ID, sepolia, "v3", "zerodev_walletconnect_demo")],
    transports: {
      [sepolia.id]: http(),
    },
  })
   
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}