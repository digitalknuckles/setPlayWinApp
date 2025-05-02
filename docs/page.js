import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ethers } from 'ethers';
import Phaser from 'phaser';

import PrizeGrabEmbed from './src/components/PrizeGrabEmbed';
import CyberPetsAiTrainerEmbed from './src/components/CyberPetsAiTrainerEmbed';

const nftAddress = "0x1C37df48Fa365B1802D0395eE9F7Db842726Eb81";
const nftABI = ["function balanceOf(address owner) view returns (uint256)"];
const signatureMessage = "Sign this message to verify access to CyberPetsAI.";

let gameInitialized = false;

function initPhaserGame() {
  if (gameInitialized) return;
  gameInitialized = true;

  new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: {
      preload,
      create,
      update
    }
  });
}

function preload() {
  this.load.image('player', 'path/to/player/image.png');
}

function create() {
  this.add.image(400, 300, 'player');
}

function update() {
  // Game loop logic
}

function Page() {
  const [status, setStatus] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem("cyberpet_verified");
    if (verified === "true") {
      setIsVerified(true);
      setStatus("Welcome back!");
      initPhaserGame();
    }
  }, []);

  const handleWalletConnect = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required.");
        return;
      }

      setStatus("Verifying wallet...");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(nftAddress, nftABI, provider);
      const balance = await contract.balanceOf(userAddress);

      if (balance.toNumber() > 0) {
        const signature = await signer.signMessage(signatureMessage);
        if (signature) {
          sessionStorage.setItem("cyberpet_verified", "true");
          setIsVerified(true);
          initPhaserGame();
        }
      } else {
        setStatus("You don't own a CyberPet NFT.");
        setShowPurchase(true);
      }
    } catch (err) {
      console.error(err);
      setStatus("Verification failed.");
    }
  };

  return React.createElement(
    'main',
    { style: { padding: '2rem', fontFamily: 'sans-serif' } },
    React.createElement('div', { style: { marginBottom: '1rem' } }, status),
    !isVerified &&
      React.createElement(
        'button',
        { onClick: handleWalletConnect, style: { padding: '10px 20px' } },
        'Connect Wallet'
      ),
    showPurchase &&
      React.createElement(
        'div',
        { style: { marginTop: '1rem' } },
        React.createElement('p', null, "You can purchase a CyberPet NFT at our marketplace."),
        React.createElement(
          'a',
          {
            href: 'https://your-nft-marketplace.example',
            target: '_blank',
            rel: 'noreferrer'
          },
          'Buy Now'
        )
      ),
    isVerified && React.createElement(PrizeGrabEmbed),
    isVerified && React.createElement(CyberPetsAiTrainerEmbed),
    isVerified && React.createElement('div', { id: 'game-container' })
  );
}

// Mount it to the DOM (JS-compatible)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Page));
