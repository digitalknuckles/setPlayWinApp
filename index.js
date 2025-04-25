// Import React and ReactDOM to render the React app
//import React from 'react';
//import ReactDOM from 'react-dom';
//import App from './App'; // Assuming your App component is in App.js

// Import PrizeGrabEmbed component (you already did this part)
//import PrizeGrabEmbed from './components/PrizeGrabEmbed';

// Vanilla JavaScript to handle tab functionality
document.addEventListener("DOMContentLoaded", () => {
  // Select buttons and tab sections
  const buttons = document.querySelectorAll("menu button");
  const sections = document.querySelectorAll(".tab-section");

  // Define background images for sections
  const backgrounds = [
    "setplaywin_Card0-01.png",
    "setplaywin_Card4-01.png",
    "setplaywin_Card3-01.png",
    "setplaywin_Card2-01.png",
    "setplaywin_Card-01.png",
    "setplaywin_Card5-01.png",
  ];

  /**
   * Activates a specific tab by index
   * @param {number} tabIndex - Index of the tab to activate
   */
  const activateTab = (tabIndex) => {
    buttons.forEach((button, idx) => {
      const isActive = idx === tabIndex;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive);
    });

    sections.forEach((section, idx) => {
      const isActive = idx === tabIndex;
      section.style.display = isActive ? "block" : "none";

      // Set background image for the active section
      if (isActive) {
        section.style.backgroundImage = `url('${backgrounds[idx]}')`;
        section.style.backgroundSize = "cover";
        section.style.backgroundPosition = "center";
        section.style.backgroundRepeat = "no-repeat";
      }
    });
  };

  // Add event listeners to buttons
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activateTab(index));
  });

  // Initialize the first tab on page load
  activateTab(0);
});

// Render React app into the DOM
ReactDOM.render(<App />, document.getElementById('root')); // 'root' is the target container in your HTML
