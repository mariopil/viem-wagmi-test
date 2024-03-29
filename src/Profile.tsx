import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useConnectorClient } from 'wagmi'
import { zkSyncTestnet } from "viem_zksync_chains"
import { simulateContract } from "viem_zksync/src/actions"
import { eip712WalletActions } from 'viem_zksync_chains/zksync'
import { readContract } from '@wagmi/core';
import {
  stringify,
} from "viem_zksync";
import { utils } from "zksync-web3";
import { gaslessPaymasterContract } from './paymaster-contract';
import { greeterContract } from './greeter-contract';

const usePaymasterHelper = async () => {
  const paymasterParams = utils.getPaymasterParams(
    gaslessPaymasterContract.address,
    {
      type: "General",
      innerInput: new Uint8Array(),
    }
  );

  return {
    gasPerPubdata: BigInt(utils.DEFAULT_GAS_PER_PUBDATA_LIMIT),
    paymaster: paymasterParams.paymaster as `0x${string}`,
    paymasterInput: paymasterParams.paymasterInput as `0x${string}`
  }
};

export const zkSyncLocalnet = {
  ...zkSyncTestnet,
  id: 270,
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:3050'],
      webSocket: ['ws://127.0.0.1:3051/ws'],
    },
    public: {
      http: ['http://127.0.0.1:3050'],
      webSocket: ['ws://127.0.0.1:3051/ws'],
    },
  },
}

export const defChain = zkSyncTestnet

export function Profile({ config }: any) {
  const { address, isConnected } = useAccount()
  const { connect, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [greet, setGreet] = useState<string>();
  const [customGreet, setCustomGreet] = useState<string>();
  const [paymasterParams, setPaymasterParams] = useState(null);
  const { data: walletClient } = useConnectorClient(config) 

  const sendEip712T = async() => {
    const request = {
      chainId: defChain.id,
      account: address,
      to: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049',
      maxFeePerGas: 250000000n,
      maxPriorityFeePerGas: 0n,
      value: 100000,
      ...paymasterParams
    }
    const client = walletClient?.extend(eip712WalletActions());
    const hash = await client.sendTransaction(request)
    console.log(hash)
  }
  
  const writeEip712T = async() => {
    
    const client = walletClient?.extend(eip712WalletActions());
    const {request} = await simulateContract(client, {
      ...greeterContract,
      functionName: "setGreeting",
      args: [customGreet],
      maxFeePerGas: 250000000n,
      maxPriorityFeePerGas: 0n,
      type: 'eip712',
      ...paymasterParams,
      account: address,
    })

    const hash = await client.writeContract(request)
    console.log("Hash: " + hash)
  }

  const readGreet = async () => {
    const value = await readContract(config, {
      ...greeterContract,
      functionName: "greet",
    });
    setGreet(value);
  };
 
  if (isConnected) {
    if (paymasterParams === null) {
      usePaymasterHelper().then((p) => setPaymasterParams(p))
    }

    return (
      <div>
        Connected to {address} 
        <button onClick={() => disconnect()}>Disconnect</button><br/>
        <input type="text" value={customGreet} onChange={e => setCustomGreet(e.target.value)}/>
        <button onClick={() => writeEip712T()}>Set greeting</button>
        <button onClick={readGreet}>Read greet</button>
        <button onClick={() => sendEip712T()}>Send transaction</button>
        {greet && (
          <>
            <div>
              Message:{" "}
              <pre>
                <code>{stringify(greet, null, 2)}</code>
              </pre>
            </div>
          </>
        )}
      </div>
    )
  }
  return (
  <div>
  {connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ))}

  {error && <div>{error.message}</div>}
</div>)
}
