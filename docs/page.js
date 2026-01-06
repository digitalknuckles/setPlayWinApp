import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ethers } from 'ethers';
import PrizeGrabEmbed from './src/components/PrizeGrabEmbed';
import CyberPetsAiTrainerEmbed from './src/components/CyberPetsAiTrainerEmbed';

// NFT Token Gate Config
const nftAddress = "0x1C37df48Fa365B1802D0395eE9F7Db842726Eb81";
const nftABI = ["function balanceOf(address owner) view returns (uint256)"];
const signatureMessage = "Sign this message to verify access to CyberPetsAI.";

const tabs = [
  { title: 'Overview', content: React.createElement('ul', null,
      React.createElement('li', null, 'Welcome to SetPlayWinApp, the platform that brings together FunFart Games, DigitalKnuckles, and LazerPixel Dev.'),
      React.createElement('li', null, 'Explore games, NFTs, tokens, and community utilities in one place!')
  )},
  { title: 'Key Features', content: React.createElement('ul', null,
      React.createElement('li', null, 'Interactive Gaming Hub'),
      React.createElement('li', null, 'Web3 Integration'),
      React.createElement('li', null, 'Community Driven Platform')
  )},
  { title: 'FunFart Arcade', content:
      React.createElement('div', null,
        React.createElement(PrizeGrabEmbed),
        React.createElement(CyberPetsAiTrainerEmbed)
      )
  }
];

function Page() {
  const [status, setStatus] = useState('Connect your wallet to verify NFT access.');
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
        alert("MetaMask is required.");
        return;
      }

      setStatus("Verifying wallet...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(nftAddress, nftABI, provider);
      const balance = await contract.balanceOf(address);

      if (balance.gt(0)) {
        await signer.signMessage(signatureMessage);
        sessionStorage.setItem("cyberpet_verified", "true");
        setIsVerified(true);
      } else {
        setStatus("NFT not detected.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Verification failed.");
    }
  }

  return React.createElement(
    'main',
    null,
    !isVerified &&
      React.createElement('div', { className: 'react-gate' },
        React.createElement('p', { className: 'status-text' }, status),
        React.createElement('button', { className: 'primary', onClick: handleWalletConnect }, 'Connect Wallet')
      ),

    isVerified &&
      React.createElement(React.Fragment, null,
        React.createElement('menu', { className: 'tab-buttons' },
          tabs.map((tab, i) =>
            React.createElement('button', {
              key: i,
              className: activeTab === i ? 'active' : '',
              onClick: () => setActiveTab(i)
            }, tab.title)
          )
        ),
        React.createElement('div', { id: 'tab-content' },
          tabs.map((tab, i) =>
            React.createElement('div', {
              key: i,
              className: `tab-section ${activeTab === i ? 'active' : ''}`
            }, tab.content)
          )
        )
      )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Page));
