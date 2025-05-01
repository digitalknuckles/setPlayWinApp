import React, { useState } from 'react';

const CyberPetsAiTrainerEmbed = () => {
  const [showGame, setShowGame] = useState(false);

  const handleStartGame = () => {
    setShowGame(true);
  };

  return React.createElement(
    'div',
    { style: { textAlign: 'center' } },
    !showGame &&
      React.createElement(
        'button',
        {
          onClick: handleStartGame,
          style: { padding: '10px 20px', fontSize: '16px' },
        },
        'Start Game'
      ),
    showGame &&
      React.createElement(
        'div',
        {
          style: {
            width: '100%',
            height: '600px',
            maxWidth: '800px',
            margin: '20px auto',
          },
        },
        React.createElement('iframe', {
          src: './public/CyberPetsAiTrainer/index.html',
          title: 'CyberPetAi Trainer Lite',
          width: '100%',
          height: '100%',
          style: { border: 'none', borderRadius: '8px' },
        })
      )
  );
};

export default CyberPetsAiTrainerEmbed;
