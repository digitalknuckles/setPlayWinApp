import ReactDOM from 'react-dom/client';
import PrizeGrabEmbed from './src/components/PrizeGrabEmbed';
import CyberPetsAiTrainerEmbed from './src/components/CyberPetsAiTrainerEmbed';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Global state variable to control game loading
let gameInitialized = false;

async function startVerification() {
  try {
    // Check for MetaMask
    if (!window.ethereum) {
      alert("MetaMask is required.");
      return;
    }

    // Request wallet connection
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    // NFT contract interaction to verify ownership
    const contract = new ethers.Contract(0x1C37df48Fa365B1802D0395eE9F7Db842726Eb81, nftABI, provider);
    const balance = await contract.balanceOf(userAddress);

    if (balance.toNumber() > 0) {
      const signature = await signer.signMessage(signatureMessage);
      if (signature) {
        sessionStorage.setItem("cyberpet_verified", "true"); // Mark as verified
        showMainSite(); // Show React site after verification
        initPhaserGame(); // Initialize Phaser game after successful verification
      }
    } else {
      document.getElementById("status").innerText = "You don't own a CyberPet NFT.";
      document.getElementById("purchase-section").style.display = "block"; // Show buy section
    }
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Verification failed.";
  }
}

function showMainSite() {
  // React rendering logic
  root.render(
    React.createElement('div', null,
      React.createElement(PrizeGrabEmbed),
      React.createElement(CyberPetsAiTrainerEmbed)
    )
  );
}

function initPhaserGame() {
  if (!gameInitialized) {
    gameInitialized = true;

    // Initialize Phaser game here
    new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    });
  }
}

function preload() {
  this.load.image('player', 'path/to/player/image.png');
  // Other assets like background, sprites, etc.
}

function create() {
  this.add.image(400, 300, 'player');
  // Game logic and assets initialization
}

function update() {
  // Update game state each frame
}

// Wait for DOMContentLoaded to make sure the page is ready before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Event listener for wallet connection button
  document.getElementById("connect-wallet").addEventListener("click", startVerification);
});
