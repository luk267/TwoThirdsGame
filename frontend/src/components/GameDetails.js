import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function GameDetails({ gameAddress, account, provider, signer, gameAbi }) {
  const [game, setGame] = useState(null);
  const [gameInfo, setGameInfo] = useState({
    phase: '',
    admin: '',
    minPlayers: 0,
    entryFee: '',
    serviceFeePercent: 0,
    registrationDeadline: 0,
    submissionDeadline: 0,
    playerCount: 0,
    hasRegistered: false,
    hasSubmitted: false,
    winner: null,
    winningNumber: 0,
    targetNumber: 0
  });
  
  const [numberInput, setNumberInput] = useState('');
  const [secret, setSecret] = useState(ethers.randomBytes(32).toString('hex'));
  const [commitment, setCommitment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    registration: 0,
    submission: 0
  });
  
  useEffect(() => {
    const loadGameDetails = async () => {
      try {
        // Create game contract instance
        const gameContract = new ethers.Contract(
          gameAddress,
          gameAbi,
          signer
        );
        
        setGame(gameContract);
        
        // Fetch basic game info
        const phase = await gameContract.currentPhase();
        const admin = await gameContract.gameAdmin();
        const minPlayers = await gameContract.minPlayers();
        const entryFee = await gameContract.entryFee();
        const serviceFeePercent = await gameContract.serviceFeePercent();
        const registrationDeadline = await gameContract.registrationDeadline();
        const submissionDeadline = await gameContract.submissionDeadline();
        const playerCount = await gameContract.getPlayerCount();
        
        // Check if the current user has registered
        const playerId = await gameContract.playerIds(account);
        const hasRegistered = playerId > 0;
        
        // Check if the user has submitted a number
        const hasSubmitted = hasRegistered ? 
          await gameContract.hasPlayerSubmitted(account) : 
          false;
        
        // Fetch winner info if game is completed
        let winner = null;
        let winningNumber = 0;
        let targetNumber = 0;
        
        if (phase === 4) { // Completed phase
          winner = await gameContract.winner();
          winningNumber = await gameContract.winningNumber();
          try {
            targetNumber = await gameContract.getTargetNumber();
          } catch (err) {
            // Target number might not be available
            console.log("Target number not available yet");
          }
        }
        
        const phaseNames = ["Registration", "Submission", "Reveal", "Completed", "Cancelled"];
        
        setGameInfo({
          phase: phaseNames[phase],
          admin,
          minPlayers,
          entryFee: ethers.formatEther(entryFee),
          serviceFeePercent,
          registrationDeadline,
          submissionDeadline,
          playerCount,
          hasRegistered,
          hasSubmitted,
          winner,
          winningNumber,
          targetNumber
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading game details:", err);
        setError("Failed to load game details");
        setLoading(false);
      }
    };
    
    if (gameAddress && signer) {
      loadGameDetails();
    }
  }, [gameAddress, account, signer, gameAbi]);
  
  // Update time left every second
  useEffect(() => {
    const timer = setInterval(() => {
      if (gameInfo.registrationDeadline && gameInfo.submissionDeadline) {
        const now = Math.floor(Date.now() / 1000);
        // Convert BigInt to Number before arithmetic operations
        const regDeadline = typeof gameInfo.registrationDeadline === 'bigint' 
          ? Number(gameInfo.registrationDeadline) 
          : gameInfo.registrationDeadline;
          
        const subDeadline = typeof gameInfo.submissionDeadline === 'bigint' 
          ? Number(gameInfo.submissionDeadline) 
          : gameInfo.submissionDeadline;

        const regTimeLeft = Math.max(0, regDeadline - now);
        const subTimeLeft = Math.max(0, subDeadline - now);

        setTimeLeft({
          registration: regTimeLeft,
          submission: subTimeLeft
        });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameInfo.registrationDeadline, gameInfo.submissionDeadline]);
  
  // Format time left as HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleRegister = async () => {
    try {
      setLoading(true);
      
      const tx = await game.register({
        value: ethers.parseEther(gameInfo.entryFee)
      });
      
      await tx.wait();
      
      // Refresh game info
      window.location.reload();
    } catch (err) {
      console.error("Error registering for game:", err);
      setError("Failed to register for the game");
      setLoading(false);
    }
  };
  
  const handleNumberChange = (e) => {
    const value = e.target.value;
    
    // Only accept numbers in range 0-1000
    if (!value || (parseInt(value) >= 0 && parseInt(value) <= 1000)) {
      setNumberInput(value);
      
      // Generate commitment when a valid number is entered
      if (value && parseInt(value) >= 0 && parseInt(value) <= 1000) {
        generateCommitment(parseInt(value));
      } else {
        setCommitment('');
      }
    }
  };
  
  const generateCommitment = async (number) => {
    // Create a commitment hash from the number, secret, and user address
    const encodedData = ethers.solidityPacked(
      ["uint256", "string", "address"],
      [number, secret, account]
    );
    
    const commitmentHash = ethers.keccak256(encodedData);
    setCommitment(commitmentHash);
  };
  
  const handleSubmitNumber = async () => {
    if (!numberInput || !commitment) {
      setError("Please enter a valid number (0-1000)");
      return;
    }
    
    try {
      setLoading(true);
      
      const tx = await game.commitNumber(commitment);
      await tx.wait();
      
      // Store number and secret in localStorage for later reveal
      localStorage.setItem(`game_${gameAddress}_number`, numberInput);
      localStorage.setItem(`game_${gameAddress}_secret`, secret);
      
      // Refresh game info
      window.location.reload();
    } catch (err) {
      console.error("Error submitting number:", err);
      setError("Failed to submit the number");
      setLoading(false);
    }
  };
  
  const handleReveal = async () => {
    try {
      setLoading(true);
      
      // Get saved number and secret from localStorage
      const savedNumber = localStorage.getItem(`game_${gameAddress}_number`);
      const savedSecret = localStorage.getItem(`game_${gameAddress}_secret`);
      
      if (!savedNumber || !savedSecret) {
        setError("Could not find your submitted number and secret. Did you submit from this browser?");
        setLoading(false);
        return;
      }
      
      const tx = await game.revealNumber(parseInt(savedNumber), savedSecret);
      await tx.wait();
      
      // Refresh game info
      window.location.reload();
    } catch (err) {
      console.error("Error revealing number:", err);
      setError("Failed to reveal the number");
      setLoading(false);
    }
  };
  
  const handleAdvancePhase = async () => {
    try {
      setLoading(true);
      
      const tx = await game.advanceToSubmission();
      await tx.wait();
      
      // Refresh game info
      window.location.reload();
    } catch (err) {
      console.error("Error advancing phase:", err);
      setError("Failed to advance the game phase");
      setLoading(false);
    }
  };
  
  const handleFinishGame = async () => {
    try {
      setLoading(true);
      
      const tx = await game.finishGame();
      await tx.wait();
      
      // Refresh game info
      window.location.reload();
    } catch (err) {
      console.error("Error finishing game:", err);
      setError("Failed to finish the game");
      setLoading(false);
    }
  };
  
  const handleCancelGame = async () => {
    try {
      setLoading(true);
      
      const tx = await game.cancelGame();
      await tx.wait();
      
      // Refresh game info
      window.location.reload();
    } catch (err) {
      console.error("Error cancelling game:", err);
      setError("Failed to cancel the game");
      setLoading(false);
    }
  };
  
  const handleWithdraw = async () => {
    try {
      setLoading(true);
      
      const tx = await game.withdrawEntryFee();
      await tx.wait();
      
      // Refresh game info
      window.location.reload();
    } catch (err) {
      console.error("Error withdrawing entry fee:", err);
      setError("Failed to withdraw entry fee");
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <div className="card-header">
        <h5>Game Details</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6>Game Status</h6>
            <p><strong>Phase:</strong> {gameInfo.phase}</p>
            <p><strong>Admin:</strong> {gameInfo.admin === account ? `${gameInfo.admin} (You)` : gameInfo.admin}</p>
            <p><strong>Min Players:</strong> {gameInfo.minPlayers}</p>
            <p><strong>Entry Fee:</strong> {gameInfo.entryFee} ETH</p>
            <p><strong>Service Fee:</strong> {gameInfo.serviceFeePercent}%</p>
            <p><strong>Players:</strong> {gameInfo.playerCount}</p>
            
            {(gameInfo.phase === "Registration" || gameInfo.phase === "Submission") && (
              <>
                <p>
                  <strong>Registration Time Left:</strong>{' '}
                  {timeLeft.registration > 0 ? formatTime(timeLeft.registration) : "Ended"}
                </p>
                
                {gameInfo.phase === "Submission" && (
                  <p>
                    <strong>Submission Time Left:</strong>{' '}
                    {timeLeft.submission > 0 ? formatTime(timeLeft.submission) : "Ended"}
                  </p>
                )}
              </>
            )}
            
            {gameInfo.phase === "Completed" && (
              <>
                <h6 className="mt-4">Game Results</h6>
                <p><strong>Winner:</strong> {gameInfo.winner === account ? `${gameInfo.winner} (You)` : gameInfo.winner}</p>
                <p><strong>Winning Number:</strong> {gameInfo.winningNumber.toString()}</p>
                <p><strong>Target (2/3 of Average):</strong> {gameInfo.targetNumber.toString()}</p>
              </>
            )}
          </div>
          
          <div className="col-md-6">
            <h6>Your Status</h6>
            <p><strong>Registered:</strong> {gameInfo.hasRegistered ? "Yes" : "No"}</p>
            {gameInfo.hasRegistered && (
              <p><strong>Number Submitted:</strong> {gameInfo.hasSubmitted ? "Yes" : "No"}</p>
            )}
            
            <div className="mt-4">
              {gameInfo.phase === "Registration" && !gameInfo.hasRegistered && (
                <button 
                  className="btn btn-primary w-100"
                  onClick={handleRegister}
                >
                  Register ({gameInfo.entryFee} ETH)
                </button>
              )}
              
              {gameInfo.phase === "Submission" && gameInfo.hasRegistered && !gameInfo.hasSubmitted && (
                <div>
                  <div className="form-group mb-3">
                    <label htmlFor="numberInput">Enter your number (0-1000):</label>
                    <input
                      type="number"
                      className="form-control"
                      id="numberInput"
                      value={numberInput}
                      onChange={handleNumberChange}
                      min="0"
                      max="1000"
                    />
                  </div>
                  <button 
                    className="btn btn-primary w-100"
                    onClick={handleSubmitNumber}
                    disabled={!numberInput || parseInt(numberInput) < 0 || parseInt(numberInput) > 1000}
                  >
                    Submit Number
                  </button>
                  
                  {commitment && (
                    <div className="mt-3">
                      <small>
                        <strong>Important:</strong> Your number and secret will be saved in your browser for the reveal phase.
                        Do not clear your browser data before revealing your number!
                      </small>
                    </div>
                  )}
                </div>
              )}
              
              {((gameInfo.phase === "Submission" && timeLeft.submission === 0) || gameInfo.phase === "Reveal") && 
               gameInfo.hasRegistered && gameInfo.hasSubmitted && (
                <button 
                  className="btn btn-primary w-100"
                  onClick={handleReveal}
                >
                  Reveal Your Number
                </button>
              )}
              
              {/* Admin controls */}
              {gameInfo.admin === account && (
                <div className="mt-4">
                  <h6>Admin Controls</h6>
                  
                  {gameInfo.phase === "Registration" && gameInfo.playerCount >= gameInfo.minPlayers && (
                    <button 
                      className="btn btn-warning w-100 mb-2"
                      onClick={handleAdvancePhase}
                    >
                      Advance to Submission Phase
                    </button>
                  )}
                  
                  {gameInfo.phase === "Registration" && timeLeft.registration === 0 && gameInfo.playerCount < gameInfo.minPlayers && (
                    <button 
                      className="btn btn-danger w-100 mb-2"
                      onClick={handleCancelGame}
                    >
                      Cancel Game (Not Enough Players)
                    </button>
                  )}
                  
                  {gameInfo.phase === "Reveal" && (
                    <button 
                      className="btn btn-warning w-100"
                      onClick={handleFinishGame}
                    >
                      Finish Game
                    </button>
                  )}
                </div>
              )}
              
              {/* Withdrawal option for cancelled games */}
              {gameInfo.phase === "Cancelled" && gameInfo.hasRegistered && (
                <button 
                  className="btn btn-success w-100"
                  onClick={handleWithdraw}
                >
                  Withdraw Entry Fee
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetails;