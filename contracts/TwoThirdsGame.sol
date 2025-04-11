// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TwoThirdsGame
 * @dev A game where players submit numbers between 0 and 1000, and the winner
 * is the one with the number closest to 2/3 of the average of all submissions
 */
contract TwoThirdsGame is ReentrancyGuard {

    // Game phases
    enum GamePhase {
        Registration,
        Submission,
        Reveal,
        Completed,
        Cancelled
    }
    
    // Game configuration
    address public gameAdmin;
    uint8 public minPlayers;
    uint256 public entryFee;
    uint8 public serviceFeePercent;
    uint256 public registrationDeadline;
    uint256 public submissionDeadline;
    
    // Game state
    GamePhase public currentPhase;
    uint256 private _playerIdCounter;
    uint256 public totalPrizePool;
    address public winner;
    uint256 public winningNumber;
    uint256 private _totalNumbersSum;
    uint256 private _targetNumber; // 2/3 of the average
    
    // Player structures
    struct PlayerInfo {
        address playerAddress;
        bool hasSubmitted;
        bool hasPaid;
    }
    
    // Player commitment structure
    struct Commitment {
        bytes32 commitment;
        uint256 revealedNumber;
        bool hasRevealed;
    }
    
    // Mappings
    mapping(uint256 => PlayerInfo) public players;
    mapping(address => uint256) public playerIds;
    mapping(uint256 => Commitment) private _playerCommitments;
    mapping(uint256 => address[]) private _numberToPlayers; // For tracking ties
    
    // Events
    event PlayerRegistered(address indexed player, uint256 indexed playerId);
    event NumberCommitted(address indexed player, bytes32 commitment);
    event NumberRevealed(address indexed player, uint256 number);
    event GameCompleted(address indexed winner, uint256 winningNumber, uint256 prize);
    event GameCancelled();
    
    /**
     * @dev Constructor initializes the game
     * @param _admin Admin of the game (usually the creator)
     * @param _minPlayers Minimum number of players required
     * @param _entryFee Fee to join the game in wei
     * @param _serviceFeePercent Percentage for the service provider
     * @param _registrationPeriod Duration of registration in seconds
     * @param _submissionPeriod Duration of submission in seconds
     */
    constructor(
        address _admin,
        uint8 _minPlayers,
        uint256 _entryFee,
        uint8 _serviceFeePercent,
        uint256 _registrationPeriod,
        uint256 _submissionPeriod
    ) {
        require(_minPlayers >= 3, "Minimum 3 players required");
        require(_serviceFeePercent <= 20, "Service fee too high");
        
        gameAdmin = _admin;
        minPlayers = _minPlayers;
        entryFee = _entryFee;
        serviceFeePercent = _serviceFeePercent;
        
        registrationDeadline = block.timestamp + _registrationPeriod;
        submissionDeadline = registrationDeadline + _submissionPeriod;
        
        currentPhase = GamePhase.Registration;
    }
    
    /**
     * @dev Allows a player to register for the game
     */
    function register() external payable nonReentrant {
        require(currentPhase == GamePhase.Registration, "Registration is not open");
        require(block.timestamp < registrationDeadline, "Registration period ended");
        require(playerIds[msg.sender] == 0, "Already registered");
        require(msg.value >= entryFee, "Insufficient entry fee");
        
        // Refund excess payment
        uint256 excess = msg.value - entryFee;
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }
        
        // Add player to the game
        _playerIdCounter++;
        uint256 playerId = _playerIdCounter;
        
        players[playerId] = PlayerInfo({
            playerAddress: msg.sender,
            hasSubmitted: false,
            hasPaid: true
        });
        
        playerIds[msg.sender] = playerId;
        totalPrizePool += entryFee;
        
        emit PlayerRegistered(msg.sender, playerId);
        
        // Check if we can move to submission phase
        if (_playerIdCounter >= minPlayers && block.timestamp >= registrationDeadline) {
            currentPhase = GamePhase.Submission;
        }
    }
    
    /**
     * @dev Force move to the submission phase if min players reached
     */
    function advanceToSubmission() external {
        require(currentPhase == GamePhase.Registration, "Not in registration phase");
        require(_playerIdCounter >= minPlayers, "Not enough players");
        require(msg.sender == gameAdmin, "Only admin can advance phases");
        
        currentPhase = GamePhase.Submission;
    }
    
    /**
     * @dev Force move to the reveal phase before deadline
     */
    function advanceToReveal() external {
        require(currentPhase == GamePhase.Submission, "Not in submission phase");
        require(msg.sender == gameAdmin, "Only admin can advance phases");
        
        // Make sure at least one player has submitted a number
        bool anySubmissions = false;
        for (uint256 i = 1; i <= _playerIdCounter; i++) {
            if (players[i].hasSubmitted) {
                anySubmissions = true;
                break;
            }
        }
        require(anySubmissions, "No number submissions yet");
        
        currentPhase = GamePhase.Reveal;
    }
    
    /**
     * @dev Allow players to submit a number commitment (hash)
     * We use commit-reveal to prevent players from seeing each other's numbers
     * @param commitment Hash of the player's number and a secret
     */
    function commitNumber(bytes32 commitment) external {
        require(currentPhase == GamePhase.Submission, "Submission is not open");
        require(block.timestamp < submissionDeadline, "Submission period ended");
        
        uint256 playerId = playerIds[msg.sender];
        require(playerId > 0, "Not registered");
        require(!players[playerId].hasSubmitted, "Already submitted");
        
        _playerCommitments[playerId] = Commitment({
            commitment: commitment,
            revealedNumber: 0,
            hasRevealed: false
        });
        
        players[playerId].hasSubmitted = true;
        
        emit NumberCommitted(msg.sender, commitment);
    }
    
    /**
     * @dev Allow players to reveal their number
     * @param number The number (0-1000) that was committed
     * @param secret Secret used in the commitment
     */
    function revealNumber(uint256 number, string calldata secret) external {
        require(currentPhase == GamePhase.Submission || currentPhase == GamePhase.Reveal, "Not in submission or reveal phase");
        
        if (block.timestamp >= submissionDeadline && currentPhase == GamePhase.Submission) {
            currentPhase = GamePhase.Reveal;
        }
        
        uint256 playerId = playerIds[msg.sender];
        require(playerId > 0, "Not registered");
        require(players[playerId].hasSubmitted, "No number committed");
        require(!_playerCommitments[playerId].hasRevealed, "Already revealed");
        require(number <= 1000, "Number must be 0-1000");
        
        // Verify commitment
        bytes32 commitment = keccak256(abi.encodePacked(number, secret, msg.sender));
        require(commitment == _playerCommitments[playerId].commitment, "Invalid number or secret");
        
        _playerCommitments[playerId].revealedNumber = number;
        _playerCommitments[playerId].hasRevealed = true;
        
        _totalNumbersSum += number;
        
        emit NumberRevealed(msg.sender, number);
        
        // Check if all players have revealed
        bool allRevealed = true;
        for (uint256 i = 1; i <= _playerIdCounter; i++) {
            if (players[i].hasSubmitted && !_playerCommitments[i].hasRevealed) {
                allRevealed = false;
                break;
            }
        }
        
        if (allRevealed) {
            _determineWinner();
        }
    }
    
    /**
     * @dev Finish the game if the submission deadline has passed 
     * and some players haven't revealed their numbers
     */
    function finishGame() external {
        require(currentPhase == GamePhase.Reveal, "Not in reveal phase");
        require(block.timestamp > submissionDeadline + 1 days, "Wait for all reveals");
        
        // Count how many players revealed their numbers
        uint256 revealCount = 0;
        for (uint256 i = 1; i <= _playerIdCounter; i++) {
            if (_playerCommitments[i].hasRevealed) {
                revealCount++;
            }
        }
        
        require(revealCount >= minPlayers, "Not enough reveals");
        
        _determineWinner();
    }
    
    /**
     * @dev Internal function to determine the winner
     */
    function _determineWinner() internal {
        require(currentPhase == GamePhase.Reveal, "Not in reveal phase");
        
        // Count revealed numbers
        uint256 revealedCount = 0;
        for (uint256 i = 1; i <= _playerIdCounter; i++) {
            if (_playerCommitments[i].hasRevealed) {
                revealedCount++;
            }
        }
        
        if (revealedCount < minPlayers) {
            // Cancel the game if not enough players revealed
            currentPhase = GamePhase.Cancelled;
            emit GameCancelled();
            return;
        }
        
        // Calculate 2/3 of the average
        uint256 average = _totalNumbersSum / revealedCount;
        _targetNumber = (average * 2) / 3;
        
        // Find the number closest to the target
        uint256 closestDifference = 1001; // Max difference + 1
        
        for (uint256 i = 1; i <= _playerIdCounter; i++) {
            if (_playerCommitments[i].hasRevealed) {
                uint256 number = _playerCommitments[i].revealedNumber;
                uint256 difference;
                
                if (number > _targetNumber) {
                    difference = number - _targetNumber;
                } else {
                    difference = _targetNumber - number;
                }
                
                if (difference < closestDifference) {
                    closestDifference = difference;
                    winningNumber = number;
                }
            }
        }
        
        // Find all players with the winning number (for tie resolution)
        for (uint256 i = 1; i <= _playerIdCounter; i++) {
            if (_playerCommitments[i].hasRevealed && _playerCommitments[i].revealedNumber == winningNumber) {
                _numberToPlayers[winningNumber].push(players[i].playerAddress);
            }
        }
        
        // Select winner (randomly if tied)
        address[] memory winningPlayers = _numberToPlayers[winningNumber];
        if (winningPlayers.length == 1) {
            winner = winningPlayers[0];
        } else if (winningPlayers.length > 1) {
            // Random selection among tied players using a pseudo-random number
            uint256 randomIndex = uint256(keccak256(abi.encodePacked(
                block.timestamp, 
                block.prevrandao, 
                blockhash(block.number - 1),
                _targetNumber
            ))) % winningPlayers.length;
            
            winner = winningPlayers[randomIndex];
        }
        
        // Distribute the prize
        _distributePrize();
        
        currentPhase = GamePhase.Completed;
        emit GameCompleted(winner, winningNumber, _calculatePrize());
    }
    
    /**
     * @dev Calculate the prize amount for the winner
     */
    function _calculatePrize() internal view returns (uint256) {
        uint256 serviceFee = (totalPrizePool * serviceFeePercent) / 100;
        return totalPrizePool - serviceFee;
    }
    
    /**
     * @dev Distribute the prize to the winner and service fee to the admin
     */
    function _distributePrize() internal {
        uint256 serviceFee = (totalPrizePool * serviceFeePercent) / 100;
        uint256 winnerPrize = totalPrizePool - serviceFee;
        
        // Send the prize to the winner
        payable(winner).transfer(winnerPrize);
        
        // Send the service fee to the admin
        payable(gameAdmin).transfer(serviceFee);
    }
    
    /**
     * @dev Allows players to withdraw their entry fee if the game is cancelled
     */
    function withdrawEntryFee() external nonReentrant {
        require(currentPhase == GamePhase.Cancelled, "Game not cancelled");
        
        uint256 playerId = playerIds[msg.sender];
        require(playerId > 0, "Not registered");
        require(players[playerId].hasPaid, "Already withdrawn");
        
        players[playerId].hasPaid = false;
        payable(msg.sender).transfer(entryFee);
    }
    
    /**
     * @dev Cancel the game if not enough players registered
     */
    function cancelGame() external {
        require(msg.sender == gameAdmin, "Only admin can cancel");
        require(currentPhase == GamePhase.Registration, "Not in registration phase");
        require(block.timestamp >= registrationDeadline, "Registration period not ended");
        require(_playerIdCounter < minPlayers, "Enough players registered");
        
        currentPhase = GamePhase.Cancelled;
        emit GameCancelled();
    }
    
    /**
     * @dev Get the current number of registered players
     */
    function getPlayerCount() external view returns (uint256) {
        return _playerIdCounter;
    }
    
    /**
     * @dev Check if a player has submitted a number
     */
    function hasPlayerSubmitted(address player) external view returns (bool) {
        uint256 playerId = playerIds[player];
        if (playerId == 0) return false;
        return players[playerId].hasSubmitted;
    }
    
    /**
     * @dev Get the target number (2/3 of average) after the game is completed
     */
    function getTargetNumber() external view returns (uint256) {
        require(currentPhase == GamePhase.Completed, "Game not completed");
        return _targetNumber;
    }
}