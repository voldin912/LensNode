import { configureChains, createClient } from "@wagmi/core";
import { polygon } from "@wagmi/core/chains";
import { Web3Modal } from "@web3modal/html";

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

const chains = [polygon];
const projectId = "";
// Wagmi Core Client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: projectId }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: projectId,
    version: "2", // or "2"
    appName: "web3Modal",
    chains,
  }),
  provider,
});

// Web3Modal and Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);
const web3modal = new Web3Modal(
  { projectId: projectId },
  ethereumClient
);

// after connection via web3modal v2, get account details of connected user via wagmi

import { getAccount } from '@wagmi/core'
const account = getAccount()


export {web3modal}