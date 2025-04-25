// src/App.js
import React from 'react';
import PrizeGrabEmbed from './components/PrizeGrabEmbed'; // Import the game component

function App() {
  return (
    <div className="App">
      {/* Render the PrizeGrabEmbed component above existing features */}
      <PrizeGrabEmbed />

      {/* Render other features like cards, etc. */}
      <div className="cards-container">
        {/* Existing cards content */}
      </div>
    </div>
  );
}

export default App;
