import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0/client";
import { ethers } from "https://esm.sh/ethers@5.7.2";

import PrizeGrabEmbed from "./src/components/PrizeGrabEmbed.js";
import CyberPetsAiTrainerEmbed from "./src/components/CyberPetsAiTrainerEmbed.js";

const nftAddress = "0x1C37df48Fa365B1802D0395eE9F7Db842726Eb81";
const nftABI = ["function balanceOf(address owner) view returns (uint256)"];
const signatureMessage = "Sign this message to verify access to CyberPetsAI.";

const e = React.createElement;

function Page() {
  const [status, setStatus] = useState("Connect wallet to verify access.");
  const [isVerified, setIsVerified] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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

      setStatus("Verifying wallet...");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();

      const contract = new ethers.Contract(nftAddress, nftABI, provider);
      const balance = await contract.balanceOf(addr);

      if (balance.toNumber() > 0) {
        await signer.signMessage(signatureMessage);
        sessionStorage.setItem("cyberpet_verified", "true");
        setIsVerified(true);
        setStatus("Access granted");
      } else {
        setStatus("NFT not detected");
      }
    } catch {
      setStatus("Verification failed");
    }
  }
async function loadNFTPreview(contract, tokenId) {
  try {
    let uri = await contract.uri(tokenId);
    uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    const meta = await fetch(uri).then(r => r.json());

    document.getElementById("nft-preview").innerHTML = `
      <img src="${meta.image.replace("ipfs://", "https://ipfs.io/ipfs/")}" />
      <p>${meta.name}</p>
    `;
  } catch {
    console.warn("NFT preview failed");
  }
}
  const tabs = [
    { title: "Prize Grab", content: e(PrizeGrabEmbed) },
    { title: "AI Trainer", content: e(CyberPetsAiTrainerEmbed) }
  ];

  return e("main", null,
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
