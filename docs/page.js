import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0/client";
import { ethers } from "https://esm.sh/ethers@5.7.2";

import PrizeGrabEmbed from "./src/components/PrizeGrabEmbed.js";
import CyberPetsAiTrainerEmbed from "./src/components/CyberPetsAiTrainerEmbed.js";

function showWalletModal(message = "Verifying wallet…", loading = true) {
  document.getElementById("wallet-modal")?.classList.remove("hidden");
  document.getElementById("wallet-status").textContent = message;
  document.querySelector(".spinner")?.classList.toggle("hidden", !loading);
}

function hideWalletModal() {
  document.getElementById("wallet-modal")?.classList.add("hidden");
}

const nftAddress = "0x1C37df48Fa365B1802D0395eE9F7Db842726Eb81";
const nftABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];
const signatureMessage = "Sign this message to verify access to CyberPetsAI.";

const e = React.createElement;

function Page() {
  const [status, setStatus] = useState("Connect wallet to verify access.");
  const [isVerified, setIsVerified] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [ens, setEns] = useState(null);
  const [nft, setNft] = useState(null);

  async function loadNFTPreview(ownerAddress) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(nftAddress, nftABI, provider);

    // Assume tokenId 0 or 1 (adjust if needed)
    let uri = await contract.tokenURI(0);
    uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");

    const meta = await fetch(uri).then(r => r.json());
    const img = meta.image.replace("ipfs://", "https://ipfs.io/ipfs/");

    document.getElementById("nft-preview").innerHTML = `
      <img src="${img}" />
      <p>${meta.name}</p>
    `;

    // 🎨 NFT-based UI skin
    document.body.style.setProperty("--primary", "#ffd700");
    document.body.style.setProperty("--accent", "#ff9800");

  } catch (e) {
    console.warn("NFT preview failed", e);
  }
}
  
  useEffect(() => {
    if (sessionStorage.getItem("cyberpet_verified") === "true") {
      setIsVerified(true);
    }
  }, []);

async function handleWalletConnect() {
  try {
    if (!window.ethereum) {
      alert("MetaMask required");
      return;
    }

    showWalletModal("Connecting wallet…", true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();

    showWalletModal("Checking NFT ownership…", true);

    const contract = new ethers.Contract(nftAddress, nftABI, provider);
    const balance = await contract.balanceOf(addr);

    if (balance.toNumber() > 0) {
      showWalletModal("Signing verification message…", true);

      await signer.signMessage(signatureMessage);

      sessionStorage.setItem("cyberpet_verified", "true");
      setIsVerified(true);
      setStatus("Access granted");

async function loadENS(provider, address) {
  const ensBar = document.getElementById("ens-profile");
  if (!ensBar) return;

  let name = await provider.lookupAddress(address);
  let avatar = null;

  if (name) {
    avatar = await provider.getAvatar(name);
  }

  if (!avatar) {
    avatar = `https://avatars.dicebear.com/api/identicon/${address}.svg`;
  }

  ensBar.innerHTML = `
    <img src="${avatar}" alt="avatar" />
    <span>${name || address.slice(0,6) + "…" + address.slice(-4)}</span>
  `;
}

  const tabs = [
    { title: "Prize Grab", content: e(PrizeGrabEmbed) },
    { title: "AI Trainer", content: e(CyberPetsAiTrainerEmbed) }
  ];

  return e("main", null,

    ens && e("div", { className: "ens-bar" },
      ens.avatar && e("img", { src: ens.avatar }),
      e("span", null, ens.name)
    ),

    nft && e("div", { className: "nft-badge" },
      e("img", { src: nft.image }),
      e("p", null, nft.name)
    ),

    !isVerified &&
      e("div", { className: "react-gate" },
        e("p", null, status),
        e("button", { className: "primary", onClick: handleWalletConnect }, "Connect Wallet")
      ),

    isVerified &&
      e(React.Fragment, null,
        e("menu", { className: "tab-buttons" },
          tabs.map((t, i) =>
            e("button", {
              key: i,
              className: activeTab === i ? "active" : "",
              onClick: () => setActiveTab(i)
            }, t.title)
          )
        ),
        e("div", { className: "tab-section active" }, tabs[activeTab].content)
      )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(e(Page));
