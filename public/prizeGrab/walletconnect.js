// walletconnect.js

const projectId = "15da3c431a74b29edb63198a503d45b5";

const metadata = {
  name: "FunFart Grab",
  description: "Mint NFTs after winning the game!",
  url: "https://digitalknuckles.github.io/prizeGrab/",
  icons: ["https://digitalknuckles.github.io/prizeGrab/icon.png"]
};

const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider.default,
    options: {
      infuraId: projectId
    }
  }
};

const web3Modal = new window.Web3Modal.default({
  cacheProvider: true,
  providerOptions,
  theme: "light",
  metadata
});

window.connectWallet = async function () {
  try {
    const provider = await web3Modal.connect();
    const web3Provider = new window.ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    console.log("🔌 Wallet connected:", address);
    return { provider: web3Provider, signer, address };
  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
    alert("❌ Failed to connect wallet: " + (err.message || err));
    return null;
  }
};

window.mintPrizeNFT = async function () {
  const wallet = await window.connectWallet();
  if (!wallet) return;

  try {
    const contract = new window.ethers.Contract(
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
    alert("🎉 NFT Minted Successfully!");
  } catch (err) {
    console.error("❌ Minting failed:", err);
    alert("❌ Minting failed: " + (err.reason || err.message || err));
  }
};
