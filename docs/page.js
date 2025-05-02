import ReactDOM from 'react-dom/client';
import PrizeGrabEmbed from './src/components/PrizeGrabEmbed';
import CyberPetsAiTrainerEmbed from './src/components/CyberPetsAiTrainerEmbed';

const root = ReactDOM.createRoot(document.getElementById('root'));
const nftAddress = "0x1C37df48Fa365B1802D0395eE9F7Db842726Eb81";
const nftABI = ["function balanceOf(address owner) view returns (uint256)"];
const signatureMessage = "Sign this message to verify access to CyberPetsAI.";
let gameInitialized = false;

async function checkSession() {
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
      document.getElementById("status").innerText = "You don't own a CyberPet NFT.";
      document.getElementById("purchase-section").style.display = "block";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Verification failed.";
  }
}

function showMainSite() {
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
  // Load other game assets here
}

function create() {
  this.add.image(400, 300, 'player');
  // Game setup logic here
}

function update() {
  // Game loop logic here
}

// Initialize verification check after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  document.getElementById("connect-wallet").addEventListener("click", startVerification);
});
