// src/components/PrizeGrabEmbed.jsx

import React, { useState } from 'react';

const PrizeGrabEmbed = () => {
  const [showGame, setShowGame] = useState(false); // State to manage visibility

  const handleStartGame = () => {
    setShowGame(true); // When the button is clicked, show the game
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Button to trigger the game display */}
      {!showGame && (
        <button onClick={handleStartGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Start Game
        </button>
      )}

      {/* Game iframe, only shown when showGame is true */}
      {showGame && (
        <div style={{ width: '100%', height: '600px', maxWidth: '800px', margin: '20px auto' }}>
          <iframe
            src="/prizeGrab/index.html"
            title="Prize Grab Game"
            width="100%"
            height="100%"
            style={{ border: 'none', borderRadius: '8px' }}
          />
        </div>
      )}
    </div>
  );
};

export default PrizeGrabEmbed;
