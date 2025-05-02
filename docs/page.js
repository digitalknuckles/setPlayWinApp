// Import only necessary libraries
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

async function handleWalletConnect() {
  const status = document.getElementById('status');
  const purchaseSection = document.getElementById('purchase-section');

  try {
    if (!window.ethereum) {
      alert("MetaMask is required.");
      return;
    }

    status.textContent = "Verifying wallet...";

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
        status.textContent = "Verification successful!";
        purchaseSection.style.display = "none";

        showVerifiedContent();
        initPhaserGame();
      }
    } else {
      status.textContent = "You don't own a CyberPet NFT.";
      purchaseSection.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    status.textContent = "Verification failed.";
  }
}

function showVerifiedContent() {
  const gameContainer = document.createElement('div');
  gameContainer.id = 'game-container';
  document.body.appendChild(gameContainer);

  // OPTIONAL: You can embed your components like this if they're HTML-based
  // If PrizeGrabEmbed and CyberPetsAiTrainerEmbed are React components, you'll need to rebuild them as web components or HTML
}

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const verified = sessionStorage.getItem("cyberpet_verified");
  const status = document.getElementById('status');
  const connectButton = document.getElementById('connect-wallet');
  const purchaseSection = document.getElementById('purchase-section');

  if (verified === "true") {
    status.textContent = "Welcome back!";
    showVerifiedContent();
    initPhaserGame();
  }

  if (connectButton) {
    connectButton.addEventListener("click", handleWalletConnect);
  }
});
