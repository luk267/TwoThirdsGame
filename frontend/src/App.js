import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import GameFactory from './artifacts/contracts/GameFactory.sol/GameFactory.json';
import TwoThirdsGame from './artifacts/contracts/TwoThirdsGame.sol/TwoThirdsGame.json';
import CreateGame from './components/CreateGame.js';
import GameList from './components/GameList.js';
import GameDetails from './components/GameDetails.js';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [factoryContract, setFactoryContract] = useState(null);
  const [gameList, setGameList] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Factory contract address - you'll need to update this after deployment
  const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example address

  useEffect(() => {
    const init = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          // First get the current accounts to ensure we have the latest
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          // Connect to MetaMask
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const account = await signer.getAddress();
          
          // Create contract instance
          const factory = new ethers.Contract(
            factoryAddress,
            GameFactory.abi,
            signer
          );
          
          setProvider(provider);
          setSigner(signer);
          setAccount(account);
          setFactoryContract(factory);
          
          // Fetch list of games
          await fetchGameList(factory);
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', handleAccountChange);
          
          setLoading(false);
        } else {
          setError("Please install MetaMask to use this application");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error initializing app:", err);
        setError("Failed to connect to the blockchain. Please check your MetaMask configuration.");
        setLoading(false);
      }
    };
    
    init();
    
    return () => {
      // Cleanup listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
      }
    };
  }, []);
  
  const handleAccountChange = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their account
      setAccount(null);
      setSigner(null);
    } else {
      // User switched accounts
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      
      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      
      // Recreate factory contract with new signer
      const factory = new ethers.Contract(
        factoryAddress,
        GameFactory.abi,
        signer
      );
      setFactoryContract(factory);
      
      // Refresh game list
      await fetchGameList(factory);
      
      // Reset selected game to force reload game details with new account
      if (selectedGame) {
        const currentGame = selectedGame;
        setSelectedGame(null);
        // Small delay to ensure state updates before reselecting
        setTimeout(() => setSelectedGame(currentGame), 100);
      }
    }
  };
  
  const fetchGameList = async (factory) => {
    try {
      const gameCount = await factory.getGameCount();
      const allGames = await factory.getAllGames();
      setGameList(allGames.slice(0, Number(gameCount)));
    } catch (err) {
      console.error("Error fetching game list:", err);
      setError("Failed to fetch game list from the blockchain");
    }
  };
  
  const handleCreateGame = async (gameParams) => {
    try {
      setLoading(true);
      
      const tx = await factoryContract.createGame(
        gameParams.minPlayers,
        ethers.parseEther(gameParams.entryFee.toString()),
        gameParams.serviceFeePercent,
        gameParams.registrationPeriod,
        gameParams.submissionPeriod
      );
      
      await tx.wait();
      
      // Refresh game list
      await fetchGameList(factoryContract);
      setLoading(false);
    } catch (err) {
      console.error("Error creating game:", err);
      setError("Failed to create a new game");
      setLoading(false);
    }
  };
  
  const handleSelectGame = (gameAddress) => {
    setSelectedGame(gameAddress);
  };
  
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Two-Thirds Average Game</h1>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="mb-3">
            <p><strong>Connected Account:</strong> {account || "Not connected"}</p>
          </div>
          
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">Create New Game</div>
                <div className="card-body">
                  <CreateGame onCreateGame={handleCreateGame} />
                </div>
              </div>
              
              <div className="card mt-3">
                <div className="card-header">Game List</div>
                <div className="card-body">
                  <GameList 
                    games={gameList} 
                    onSelectGame={handleSelectGame} 
                    selectedGame={selectedGame}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-md-8">
              {selectedGame ? (
                <GameDetails 
                  gameAddress={selectedGame} 
                  account={account} 
                  provider={provider} 
                  signer={signer}
                  gameAbi={TwoThirdsGame.abi}
                />
              ) : (
                <div className="card">
                  <div className="card-body">
                    <p className="text-center">Select a game from the list to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;