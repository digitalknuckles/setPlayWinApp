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
  { title: 'Overview', content: (
      <ul>
        <li>Welcome to SetPlayWinApp, the platform that brings together FunFart Games, DigitalKnuckles, and LazerPixel Dev.</li>
        <li>Explore games, NFTs, tokens, and community utilities in one place!</li>
      </ul>
  ) },
  { title: 'Key Features', content: (
      <ul>
        <li>Interactive Gaming Hub: Play and discover new games, track progress, and compete with others.</li>
        <li>Web3 Integration: Experience blockchain-powered gaming, NFT collecting, and token utilities.</li>
        <li>Community-Driven Platform: Connect with enthusiasts, join events, and contribute to projects.</li>
      </ul>
  ) },
  { title: 'Core Projects', content: (
      <ul>
        <li>FunFart Games: Quirky and innovative games like "HB Studio", "Funfart Grab", "CyberpetsAi Trainer", and more.</li>
        <li>DigitalKnuckles: Exclusive NFTs and utilities to enhance your gaming experience.</li>
        <li>Digitalknuckles Dev: Experimental projects, tutorials, and tools for game developers.</li>
      </ul>
  ) },
  { title: 'Roadmap', content: (
      <ul>
        <li>Phase 1: Launch the gaming hub and NFT marketplace.</li>
        <li>Phase 2: Introduce new tokens, collections, utilities, and holistic access.</li>
        <li>Phase 3: Experimental community features like co-op gaming.</li>
        <li>Phase 4: Launch the SetPlayWin entertainment ecosystem.</li>
      </ul>
  ) },
  { title: 'Contact', content: (
      <ul>
        <li>Email: setplaywin@gmail.com</li>
        <li>Discord: Join the SetPlayWin, Digitalknuckles, and Funfart Games Community</li>
        <li>Website: <a href="http://www.setplaywin.com" target="_blank" rel="noreferrer">www.setplaywin.com</a></li>
        <li>Website: <a href="http://www.digitalknuckles.xyz" target="_blank" rel="noreferrer">Digitalknuckles.xyz (GMC Token Gated)</a></li>
      </ul>
  ) },
  { title: 'FunFart Arcade', content: (
      <div>
        <div className="game-container">
          <button className="primary" id="start-prizegrab">Start PrizeGrab</button>
          <div id="game-container" className="iframe-wrapper" style={{display: 'none'}}>
            <iframe
              src="public/prizeGrab/index.html"
              title="PrizeGrab Game"
              width="100%"
              height="600"
              style={{border: 'none', borderRadius: '12px'}}
            ></iframe>
          </div>
        </div>

        <div className="game-container">
          <button className="primary" id="start-ai-trainer">Start CyberPets Trainer</button>
          <div id="ai-trainer-container" className="iframe-wrapper" style={{display: 'none'}}>
            <iframe
              src="public/CyberPetsAiTrainer/index.html"
              title="CyberPets Ai Trainer"
              width="100%"
              height="600"
              style={{border: 'none', borderRadius: '12px'}}
            ></iframe>
          </div>
        </div>

        <h2>FunFart Games Info</h2>
        <ul>
          <li>Email: funfart85@gmail.com</li>
          <li>Discord: Join the FunFart Games Community on Discord!</li>
          <li>Website: <a href="http://www.funfartgames.xyz" target="_blank" rel="noreferrer">www.funfartgames.com (Under Construction)</a></li>
        </ul>
      </div>
  ) }
];

function Page() {
  const [status, setStatus] = useState('Connect your wallet to verify NFT access.');
  const [isVerified, setIsVerified] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Check sessionStorage on load
  useEffect(() => {
    if (sessionStorage.getItem("cyberpet_verified") === "true") {
      setIsVerified(true);
    }
  }, []);

  // Wallet Connect & NFT Verification
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
          setStatus("Access granted! Welcome.");
        }
      } else {
        setStatus("You do not own the required NFT.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Verification failed. Try again.");
    }
  };

  // Game Buttons
  useEffect(() => {
    const prizeBtn = document.getElementById('start-prizegrab');
    const aiBtn = document.getElementById('start-ai-trainer');

    prizeBtn?.addEventListener('click', () => {
      prizeBtn.style.display = 'none';
      document.getElementById('game-container').style.display = 'block';
    });

    aiBtn?.addEventListener('click', () => {
      aiBtn.style.display = 'none';
      document.getElementById('ai-trainer-container').style.display = 'block';
    });

    return () => {
      prizeBtn?.removeEventListener('click', () => {});
      aiBtn?.removeEventListener('click', () => {});
    };
  }, [isVerified]);

  return (
    <main>
      {!isVerified && (
        <div className="react-gate">
          <p className="status-text">{status}</p>
          <button className="primary" onClick={handleWalletConnect}>Connect Wallet</button>
        </div>
      )}

      {isVerified && (
        <>
          <menu className="tab-buttons">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={activeTab === index ? 'active' : ''}
                onClick={() => setActiveTab(index)}
              >
                {tab.title}
              </button>
            ))}
          </menu>

          <div id="tab-content">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`tab-section ${activeTab === index ? 'active' : ''}`}
              >
                {tab.content}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

// Mount React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Page />);
