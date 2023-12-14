import { createConfig, http, WagmiProvider} from 'wagmi'
import { defChain, Profile } from './Profile'
import { metaMask } from '@wagmi/connectors'
import { walletConnect } from '@wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './App.css'

const queryClient = new QueryClient() 

const mm = metaMask()
const wcc = walletConnect({
  projectId: '5a99d9369e7d9d41d706df47234a30e1'
})

const config = createConfig({
  chains: [defChain],
  transports: {
    [defChain.id]: http()
  },
  connectors: [mm, wcc]
})

function App() {
  return (
    <WagmiProvider config={config}>
       <QueryClientProvider client={queryClient}> 
          <Profile config={config} />
        </QueryClientProvider> 
    </WagmiProvider>
  )
}

export default App
