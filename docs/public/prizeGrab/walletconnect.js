// walletconnect.js
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "https://unpkg.com/web3modal"; // or your preferred CDN
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";

const projectId = "15da3c431a74b29edb63198a503d45b5";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: projectId
    }
  }
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
  theme: "light"
});

async function connectWallet() {
  try {
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    console.log("🔌 Wallet connected:", address);
    return { provider: web3Provider, signer, address };
  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
    throw err;
  }
}

export async function mintPrizeNFT() {
  const wallet = await connectWallet();
  if (!wallet) return;

  try {
    const contract = new ethers.Contract(
      "0xcaB543F6Af365a9E75f56e7Fc85D9C84F1482B12",
      [
        {
          inputs: [],
          name: "mintPrize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ],
      wallet.signer
    );

    const tx = await contract.mintPrize();
    await tx.wait();
    console.log("🎉 NFT Minted Successfully!");
  } catch (err) {
    console.error("❌ Minting failed:", err);
    throw err;
  }
}
