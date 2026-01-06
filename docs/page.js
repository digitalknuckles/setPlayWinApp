import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0/client";
import { ethers } from "https://esm.sh/ethers@5.7.2";

import PrizeGrabEmbed from "./src/components/PrizeGrabEmbed.js";
import CyberPetsAiTrainerEmbed from "./src/components/CyberPetsAiTrainerEmbed.js";

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
  const [ens, setEns] = useState({ name: null, avatar: null });
  const [nft, setNft] = useState({ name: null, image: null });
  const [loading, setLoading] = useState(false);

  // Load verification from sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem("cyberpet_verified") === "true") {
      setIsVerified(true);
    }
  }, []);

  async function loadENS(provider, address) {
    try {
      let name = await provider.lookupAddress(address);
      let avatar = name ? await provider.getAvatar(name) : null;
      if (!avatar) avatar = `https://avatars.dicebear.com/api/identicon/${address}.svg`;
      setEns({ name: name || address.slice(0, 6) + "…" + address.slice(-4), avatar });
    } catch (err) {
      console.warn("ENS failed", err);
    }
  }

  async function loadNFTPreview(ownerAddress) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(nftAddress, nftABI, provider);

      // Assume tokenId 0
      const uri = (await contract.tokenURI(0)).replace("ipfs://", "https://ipfs.io/ipfs/");
      const meta = await fetch(uri).then(r => r.json());
      const image = meta.image.replace("ipfs://", "https://ipfs.io/ipfs/");

      setNft({ name: meta.name, image });

      // Optional: NFT-based UI skin
      document.body.style.setProperty("--primary", "#ffd700");
      document.body.style.setProperty("--accent", "#ff9800");
    } catch (err) {
      console.warn("NFT preview failed", err);
    }
  }

  async function handleWalletConnect() {
    if (!window.ethereum) {
      alert("MetaMask required");
      return;
    }

    try {
      setLoading(true);
      setStatus("Connecting wallet…");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();

      setStatus("Checking NFT ownership…");
      const contract = new ethers.Contract(nftAddress, nftABI, provider);
      const balance = await contract.balanceOf(addr);

      if (balance.toNumber() > 0) {
        setStatus("Signing verification message…");
        await signer.signMessage(signatureMessage);

        sessionStorage.setItem("cyberpet_verified", "true");
        setIsVerified(true);
        setStatus("Access granted");

        await loadENS(provider, addr);
        await loadNFTPreview(addr);
      } else {
        setStatus("NFT not detected");
      }
    } catch (err) {
      console.error(err);
      setStatus("Verification failed");
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { title: "Prize Grab", content: e(PrizeGrabEmbed) },
    { title: "AI Trainer", content: e(CyberPetsAiTrainerEmbed) }
  ];

  return e("main", null,
    // Wallet Modal / Spinner
    e("div", { id: "wallet-modal", className: loading ? "wallet-modal" : "wallet-modal hidden" },
      e("div", { className: "wallet-card" },
        e("div", { className: "spinner" }),
        e("h2", { id: "wallet-title" }, "Connect Wallet"),
        e("p", { id: "wallet-status" }, status)
      )
    ),

    // ENS Bar
    ens.name && e("div", { className: "ens-bar" },
      e("img", { src: ens.avatar, alt: "avatar" }),
      e("span", null, ens.name)
    ),

    // NFT Badge
    nft.image && e("div", { className: "nft-badge" },
      e("img", { src: nft.image, alt: nft.name }),
      e("p", null, nft.name)
    ),

    // Wallet Gate
    !isVerified && e("div", { className: "react-gate" },
      e("p", null, status),
      e("button", { className: "primary", onClick: handleWalletConnect }, "Connect Wallet")
    ),

    // Tabs
    isVerified && e(React.Fragment, null,
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
