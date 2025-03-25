import React from 'react';

function GameList({ games, onSelectGame, selectedGame }) {
  if (games.length === 0) {
    return <p>No games available. Create a new game to get started!</p>;
  }
  
  return (
    <div className="list-group">
      {games.map((gameAddress, index) => (
        <button
          key={index}
          className={`list-group-item list-group-item-action ${selectedGame === gameAddress ? 'active' : ''}`}
          onClick={() => onSelectGame(gameAddress)}
        >
          Game #{index + 1}
          <br />
          <small className="text-truncate d-block">{gameAddress}</small>
        </button>
      ))}
    </div>
  );
}

export default GameList;