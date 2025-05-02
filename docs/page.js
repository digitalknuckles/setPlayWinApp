import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import PrizeGrabEmbed from './src/components/PrizeGrabEmbed';
import CyberPetsAiTrainerEmbed from './src/components/CyberPetsAiTrainerEmbed';
import { ethers } from 'ethers';
import Phaser from 'phaser';

const nftAddress = "0x1C37df48Fa365B1802D0395eE9F7Db842726Eb81";
const nftABI = ["function balanceOf(address owner) view returns (uint256)"];
const signatureMessage = "Sign this message to verify access to CyberPetsAI.";
let gameInitialized = false;

export default function Page() {
  useEffect(() => {
    checkSession();

    const button = document.getElementById('connect-wallet');
    if (button) {
      button.addEventListener('click', startVerification);
    }

    return () => {
      if (button) {
        button.removeEventListener('click', startVerification);
      }
    };
  }, []);

  return (
    <main>
      <div id="status" style={{ marginBottom: '1rem', fontSize: '1rem' }}></div>
      <button id="connect-wallet" style={{ padding: '10px 20px', fontSize: '1rem' }}>
        Connect Wallet
      </button>
      <div id="purchase-section" style={{ display: 'none', marginTop: '1rem' }}>
        <p>You can purchase a CyberPet NFT at our marketplace.</p>
        <a href="https://your-nft-marketplace.example" target="_blank">Buy Now</a>
      </div>
      <div id="root" style={{ marginTop: '2rem' }}></div>
    </main>
  );
}

function checkSession() {
  const verified = sessionStorage.getItem("cyberpet_verified");
  if (verified === "true") {
    showMainSite();
    initPhaserGame();
  }
}

async function startVerification() {
  try {
    if (!window.ethereum) {
      alert("MetaMask is required.");
      return;
    }

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
        showMainSite();
        initPhaserGame();
      }
    } else {
      const status = document.getElementById("status");
      if (status) status.innerText = "You don't own a CyberPet NFT.";
      document.getElementById("purchase-section").style.display = "block";
    }
  } catch (err) {
    console.error(err);
    const status = document.getElementById("status");
    if (status) status.innerText = "Verification failed.";
  }
}

function showMainSite() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <>
      <PrizeGrabEmbed />
      <CyberPetsAiTrainerEmbed />
    </>
  );
}

function initPhaserGame() {
  if (gameInitialized) return;
  gameInitialized = true;

  new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
  // game loop
}
