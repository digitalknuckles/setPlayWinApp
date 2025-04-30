// Import React and ReactDOM to render the React app
import React from 'react';
import { createRoot } from 'react-dom/client';

// Import PrizeGrabEmbed and CyberPetsAiTrainerEmbed components
import PrizeGrabEmbed from './src/components/PrizeGrabEmbed';
import CyberPetsAiTrainerEmbed from './src/components/CyberPetsAiTrainerEmbed';

// Vanilla JavaScript to handle tab functionality
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("menu button");
  const sections = document.querySelectorAll(".tab-section");

  const backgrounds = [
    "setplaywin_Card0-01.png",
    "setplaywin_Card4-01.png",
    "setplaywin_Card3-01.png",
    "setplaywin_Card2-01.png",
    "setplaywin_Card-01.png",
    "setplaywin_Card5-01.png",
  ];

  const activateTab = (tabIndex) => {
    buttons.forEach((button, idx) => {
      const isActive = idx === tabIndex;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive);
    });

    sections.forEach((section, idx) => {
      const isActive = idx === tabIndex;
      section.style.display = isActive ? "block" : "none";
      if (isActive) {
        section.style.backgroundImage = `url('${backgrounds[idx]}')`;
        section.style.backgroundSize = "cover";
        section.style.backgroundPosition = "center";
        section.style.backgroundRepeat = "no-repeat";
      }
    });
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activateTab(index));
  });

  activateTab(0); // Initialize first tab

  // React rendering logic
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <div>
          <PrizeGrabEmbed />
          <CyberPetsAiTrainerEmbed />
        </div>
      </React.StrictMode>
    );
  } else {
    console.error("Could not find #root element to mount React components.");
  }
});
