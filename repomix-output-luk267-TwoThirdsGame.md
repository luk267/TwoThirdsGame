This file is a merged representation of the entire codebase, combined into a single document by Repomix. The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information

## Additional Info

# Directory Structure
```
cache/
  solidity-files-cache.json
contracts/
  GameFactory.sol
  TwoThirdsGame.sol
frontend/
  public/
    index.html
  src/
    artifacts/
      @openzeppelin/
        contracts/
          utils/
            ReentrancyGuard.sol/
              ReentrancyGuard.dbg.json
              ReentrancyGuard.json
      build-info/
        29886402c2f1558e988b85a50a3854eb.json
      contracts/
        GameFactory.sol/
          GameFactory.dbg.json
          GameFactory.json
        TwoThirdsGame.sol/
          TwoThirdsGame.dbg.json
          TwoThirdsGame.json
    components/
      CreateGame.js
      GameDetails.js
      GameList.js
    App.css
    App.js
  package.json
scripts/
  deploy.js
Design_Document.md
hardhat.config.js
package.json
README.md
```

# Files

## File: cache/solidity-files-cache.json
````json
{
  "_format": "hh-sol-cache-2",
  "files": {
    "/Users/lukasharbeck/TwoThirdsGame/contracts/GameFactory.sol": {
      "lastModificationDate": 1742918523564,
      "contentHash": "823e182587364be82f6530cfee582f5b",
      "sourceName": "contracts/GameFactory.sol",
      "solcConfig": {
        "version": "0.8.20",
        "settings": {
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          "evmVersion": "paris",
          "outputSelection": {
            "*": {
              "*": [
                "abi",
                "evm.bytecode",
                "evm.deployedBytecode",
                "evm.methodIdentifiers",
                "metadata"
              ],
              "": [
                "ast"
              ]
            }
          }
        }
      },
      "imports": [
        "./TwoThirdsGame.sol"
      ],
      "versionPragmas": [
        "^0.8.20"
      ],
      "artifacts": [
        "GameFactory"
      ]
    },
    "/Users/lukasharbeck/TwoThirdsGame/contracts/TwoThirdsGame.sol": {
      "lastModificationDate": 1742920275409,
      "contentHash": "c79663ec5950d944454c695119c20d7c",
      "sourceName": "contracts/TwoThirdsGame.sol",
      "solcConfig": {
        "version": "0.8.20",
        "settings": {
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          "evmVersion": "paris",
          "outputSelection": {
            "*": {
              "*": [
                "abi",
                "evm.bytecode",
                "evm.deployedBytecode",
                "evm.methodIdentifiers",
                "metadata"
              ],
              "": [
                "ast"
              ]
            }
          }
        }
      },
      "imports": [
        "@openzeppelin/contracts/utils/ReentrancyGuard.sol"
      ],
      "versionPragmas": [
        "^0.8.20"
      ],
      "artifacts": [
        "TwoThirdsGame"
      ]
    },
    "/Users/lukasharbeck/TwoThirdsGame/node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol": {
      "lastModificationDate": 1742917743524,
      "contentHash": "190613e556d509d9e9a0ea43dc5d891d",
      "sourceName": "@openzeppelin/contracts/utils/ReentrancyGuard.sol",
      "solcConfig": {
        "version": "0.8.20",
        "settings": {
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          "evmVersion": "paris",
          "outputSelection": {
            "*": {
              "*": [
                "abi",
                "evm.bytecode",
                "evm.deployedBytecode",
                "evm.methodIdentifiers",
                "metadata"
              ],
              "": [
                "ast"
              ]
            }
          }
        }
      },
      "imports": [],
      "versionPragmas": [
        "^0.8.20"
      ],
      "artifacts": [
        "ReentrancyGuard"
      ]
    }
  }
}
````

## File: contracts/GameFactory.sol
````
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TwoThirdsGame.sol";

/**
 * @title GameFactory
 * @dev Factory contract for creating Two-Thirds Average Game instances
 */
contract GameFactory {
    // Mapping from game ID to game address
    mapping(uint256 => address) public games;
    
    // Array to keep track of all created games
    address[] public allGames;
    
    // Counter for game IDs
    uint256 private _gameIdCounter;
    
    // Event emitted when a new game is created
    event GameCreated(uint256 indexed gameId, address indexed gameAddress, address creator);
    
    /**
     * @dev Creates a new Two-Thirds Average Game
     * @param minPlayers Minimum number of players required
     * @param entryFee Fee to join the game in wei
     * @param serviceFeePercent Percentage of the prize pool that goes to the service provider
     * @param registrationPeriod Duration of the registration period in seconds
     * @param submissionPeriod Duration of the number submission period in seconds
     * @return gameId ID of the created game
     * @return gameAddress Address of the created game
     */
    function createGame(
        uint8 minPlayers,
        uint256 entryFee,
        uint8 serviceFeePercent,
        uint256 registrationPeriod,
        uint256 submissionPeriod
    ) external returns (uint256 gameId, address gameAddress) {
        require(minPlayers >= 3, "Minimum 3 players required");
        require(serviceFeePercent <= 20, "Service fee too high");
        
        // Create a new game contract
        TwoThirdsGame game = new TwoThirdsGame(
            msg.sender,
            minPlayers,
            entryFee,
            serviceFeePercent,
            registrationPeriod,
            submissionPeriod
        );
        
        // Assign game ID and store the game address
        gameId = _gameIdCounter++;
        gameAddress = address(game);
        
        // Store the game address
        games[gameId] = gameAddress;
        allGames.push(gameAddress);
        
        // Emit event
        emit GameCreated(gameId, gameAddress, msg.sender);
        
        return (gameId, gameAddress);
    }
    
    /**
     * @dev Returns the number of games created
     * @return Number of games
     */
    function getGameCount() external view returns (uint256) {
        return allGames.length;
    }
    
    /**
     * @dev Returns a list of all games
     * @return Array of game addresses
     */
    function getAllGames() external view returns (address[] memory) {
        return allGames;
    }
}
````

## File: contracts/TwoThirdsGame.sol
````
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
````

## File: frontend/public/index.html
````html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Two-Thirds Average Game</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
````

## File: frontend/src/artifacts/@openzeppelin/contracts/utils/ReentrancyGuard.sol/ReentrancyGuard.dbg.json
````json
{
  "_format": "hh-sol-dbg-1",
  "buildInfo": "../../../../build-info/29886402c2f1558e988b85a50a3854eb.json"
}
````

## File: frontend/src/artifacts/@openzeppelin/contracts/utils/ReentrancyGuard.sol/ReentrancyGuard.json
````json
{
  "_format": "hh-sol-artifact-1",
  "contractName": "ReentrancyGuard",
  "sourceName": "@openzeppelin/contracts/utils/ReentrancyGuard.sol",
  "abi": [
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    }
  ],
  "bytecode": "0x",
  "deployedBytecode": "0x",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

````

## File: frontend/src/artifacts/contracts/GameFactory.sol/GameFactory.dbg.json
````json
{
  "_format": "hh-sol-dbg-1",
  "buildInfo": "../../build-info/29886402c2f1558e988b85a50a3854eb.json"
}
````

## File: frontend/src/artifacts/contracts/GameFactory.sol/GameFactory.json
````json
{
  "_format": "hh-sol-artifact-1",
  "contractName": "GameFactory",
  "sourceName": "contracts/GameFactory.sol",
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "gameAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "GameCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allGames",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "minPlayers",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "entryFee",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "serviceFeePercent",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "registrationPeriod",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "submissionPeriod",
          "type": "uint256"
        }
      ],
      "name": "createGame",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "gameAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "games",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllGames",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getGameCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
 
````

## File: frontend/src/artifacts/contracts/TwoThirdsGame.sol/TwoThirdsGame.dbg.json
````json
{
  "_format": "hh-sol-dbg-1",
  "buildInfo": "../../build-info/29886402c2f1558e988b85a50a3854eb.json"
}
````

## File: frontend/src/artifacts/contracts/TwoThirdsGame.sol/TwoThirdsGame.json
````json
{
  "_format": "hh-sol-artifact-1",
  "contractName": "TwoThirdsGame",
  "sourceName": "contracts/TwoThirdsGame.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_admin",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "_minPlayers",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_entryFee",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "_serviceFeePercent",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_registrationPeriod",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_submissionPeriod",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "GameCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "winningNumber",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "prize",
          "type": "uint256"
        }
      ],
      "name": "GameCompleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "commitment",
          "type": "bytes32"
        }
      ],
      "name": "NumberCommitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "number",
          "type": "uint256"
        }
      ],
      "name": "NumberRevealed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "playerId",
          "type": "uint256"
        }
      ],
      "name": "PlayerRegistered",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "advanceToSubmission",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cancelGame",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "commitment",
          "type": "bytes32"
        }
      ],
      "name": "commitNumber",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentPhase",
      "outputs": [
        {
          "internalType": "enum TwoThirdsGame.GamePhase",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "entryFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "finishGame",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gameAdmin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPlayerCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTargetNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "hasPlayerSubmitted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minPlayers",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "playerIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "players",
      "outputs": [
        {
          "internalType": "address",
          "name": "playerAddress",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "hasSubmitted",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "hasPaid",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "register",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "registrationDeadline",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "number",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "secret",
          "type": "string"
        }
      ],
      "name": "revealNumber",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "serviceFeePercent",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "submissionDeadline",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalPrizePool",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "winner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "winningNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawEntryFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  
````

## File: frontend/src/components/CreateGame.js
````javascript
import React, { useState } from 'react';

function CreateGame({ onCreateGame }) {
  const [formData, setFormData] = useState({
    minPlayers: 3,
    entryFee: 0.01,
    serviceFeePercent: 5,
    registrationPeriod: 3600, // 1 hour in seconds
    submissionPeriod: 3600 // 1 hour in seconds
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'entryFee' ? parseFloat(value) : parseInt(value)
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateGame(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="minPlayers" className="form-label">Minimum Players</label>
        <input
          type="number"
          className="form-control"
          id="minPlayers"
          name="minPlayers"
          min="3"
          value={formData.minPlayers}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="entryFee" className="form-label">Entry Fee (ETH)</label>
        <input
          type="number"
          className="form-control"
          id="entryFee"
          name="entryFee"
          min="0.0001"
          step="0.001"
          value={formData.entryFee}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="serviceFeePercent" className="form-label">Service Fee (%)</label>
        <input
          type="number"
          className="form-control"
          id="serviceFeePercent"
          name="serviceFeePercent"
          min="1"
          max="20"
          value={formData.serviceFeePercent}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="registrationPeriod" className="form-label">Registration Period (seconds)</label>
        <input
          type="number"
          className="form-control"
          id="registrationPeriod"
          name="registrationPeriod"
          min="300"
          value={formData.registrationPeriod}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="submissionPeriod" className="form-label">Submission Period (seconds)</label>
        <input
          type="number"
          className="form-control"
          id="submissionPeriod"
          name="submissionPeriod"
          min="300"
          value={formData.submissionPeriod}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit" className="btn btn-primary w-100">Create Game</button>
    </form>
  );
}

export default CreateGame;
````

## File: frontend/src/components/GameDetails.js
````javascript
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
        const regTimeLeft = Math.max(0, gameInfo.registrationDeadline - now);
        const subTimeLeft = Math.max(0, gameInfo.submissionDeadline - now);
        
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
````

## File: frontend/src/components/GameList.js
````javascript
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
````

## File: frontend/src/App.css
````css
body {
    background-color: #f8f9fa;
  }
  
  .card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .card-header {
    background-color: #f1f1f1;
    font-weight: bold;
  }
  
  .list-group-item {
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .list-group-item:hover {
    background-color: #f1f1f1;
  }
  
  .list-group-item.active {
    background-color: #007bff;
    border-color: #007bff;
  }
  
  small {
    word-break: break-all;
  }
````

## File: frontend/src/App.js
````javascript
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import GameFactory from './artifacts/contracts/GameFactory.sol/GameFactory.json';
import TwoThirdsGame from './artifacts/contracts/TwoThirdsGame.sol/TwoThirdsGame.json';
import CreateGame from './components/CreateGame';
import GameList from './components/GameList';
import GameDetails from './components/GameDetails';
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
      
      // Refresh game list
      if (factoryContract) {
        await fetchGameList(factoryContract);
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
````

## File: frontend/package.json
````json
{
  "name": "frontend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "@metamask/providers": "^21.0.0",
    "ethers": "^6.13.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-scripts": "^5.0.1",
    "web3": "^4.16.0"
  }
}
````

## File: scripts/deploy.js
````javascript
const hre = require("hardhat");

async function main() {
  // Deploy the GameFactory contract
  const GameFactory = await hre.ethers.getContractFactory("GameFactory");
  const gameFactory = await GameFactory.deploy();
  await gameFactory.deploymentTransaction().wait();

  console.log(`GameFactory deployed to: ${gameFactory.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
````

## File: Design_Document.md
````markdown
# Two-Thirds Average Game - Design Document

## Game Mechanics Overview

The Two-Thirds Average Game is a classic example of game theory. Players submit numbers between 0-1000, and the winner is the player whose number is closest to 2/3 of the average of all submissions. This creates an interesting strategic scenario:

- If all players chose randomly, the average would be around 500, and 2/3 of that would be ~333
- However, knowing this, rational players might choose 333
- But if everyone chooses 333, then 2/3 of that would be ~222
- This recursive thinking can continue...

The Nash equilibrium of this game is actually for all players to choose 0, but in practice, humans rarely converge to this solution immediately.

## System Architecture

### Smart Contract Architecture

The system uses a factory pattern with two main contracts:

1. **GameFactory**: Creates and tracks game instances
   - Allows creating games with custom parameters
   - Maintains a registry of all created games
   - Enforces minimum requirements for game creation

2. **TwoThirdsGame**: The actual game logic
   - Manages player registration and fee collection
   - Implements the commit-reveal scheme for number submissions
   - Calculates the winner and distributes prizes
   - Handles exceptional cases (timeouts, cancellations)

### Game Phases

Each game progresses through several phases:
1. **Registration**: Players join by paying the entry fee
2. **Submission**: Players commit to their numbers (hidden)
3. **Reveal**: Players reveal their committed numbers
4. **Completed**: Game finished, winner determined and prize distributed
5. **Cancelled**: Game aborted due to insufficient players

## Key Design Decisions

### Factory Pattern

We implemented the Factory Pattern to allow:
- Creation of multiple game instances with different parameters
- Clear separation of concerns between game creation and game logic
- Easy discovery of active games
- Future extensibility for different game variants

### Commit-Reveal Scheme

To prevent players from gaining an advantage by seeing others' submissions:
- Players first submit a hash of their number + a secret + their address
- After all submissions, players reveal their actual numbers
- The contract verifies the revealed number matches the original commitment

This is critical for fairness, as otherwise players could wait until the last moment and adjust their strategy based on others' submissions.

### Time-Based Phases

We implemented time limits for each phase:
- Registration period: Ensures games don't wait indefinitely for players
- Submission period: Gives players adequate time to submit numbers
- Reveal handled by participant action: Players must actively reveal their numbers

### Handling Non-Responsive Players

Several mechanisms address players who abandon the game:
- If not enough players register, the game can be cancelled and fees returned
- If a player doesn't submit a number, they forfeit their entry fee
- If a player doesn't reveal their number, they're excluded from the winner calculation
- The `finishGame` function allows concluding the game if some players don't reveal

### Tie-Breaking Mechanism

For ties (multiple players with the same closest number):
- A pseudo-random selection is made using multiple blockchain variables
- Uses a keccak256 hash of timestamp, prevrandao, last block hash, and target number
- While not cryptographically perfect, it's sufficient for this use case and resistant to simple manipulation

### Prize Distribution

- Winner receives the prize pool minus the service fee
- Service fee goes to the game admin (creator)
- In case of cancellation, players can withdraw their entry fees

## Security Considerations

### Preventing Front-Running

The commit-reveal pattern prevents front-running attacks where players could observe others' transactions and adjust their numbers accordingly.

### Secure Randomness

For tie-breaking, we use multiple sources of blockchain entropy. While this isn't perfectly random, it's adequate for this non-critical application and resistant to basic manipulation.

### Timeout Handling

The contract includes mechanisms to handle timeouts:
- Games can be cancelled if not enough players register
- Games can be completed even if some players don't reveal

### Reentrancy Protection

We use OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks when handling ETH transfers.

### Access Control

Only the game admin (creator) can perform certain administrative actions like advancing phases or cancelling games.

## Gas Optimization Techniques

### Efficient Data Structures

- Use of uint8 for small values (minPlayers, serviceFeePercent)
- Careful structuring of player data to minimize storage slots
- Mapping-based lookups for efficient data retrieval

### Minimal Storage Operations

- Use of memory variables where possible
- Batching operations to reduce storage writes
- Efficient use of events for tracking state changes

### Avoiding Loops

- Design decisions to minimize or eliminate loops in critical functions
- Where loops are necessary, they're bounded by the number of players

## Frontend Design

The web interface is designed to be simple but functional:
- Clear display of game phases and deadlines
- Easy registration and number submission
- Automatic saving of submission details for the reveal phase
- MetaMask integration for Ethereum transactions

## Alternative Approaches Considered

### Pull vs. Push Payment

We chose a pull payment approach for withdrawals in cancelled games, which is more gas-efficient and safer than automatic push payments.

### Randomness Alternatives

We considered using Chainlink VRF for true randomness but opted for a simpler solution given:
- The low stakes of the application
- The added complexity and cost of external oracles
- The adequacy of the implemented pseudo-random solution for this use case

### Different Time Management Approaches

We considered having players vote to advance phases but opted for time-based phases with admin override for simplicity and predictability.

## Future Improvements

### Enhanced Randomness

Integrate with Chainlink VRF or similar services for provably fair randomness.

### Multiple Rounds

Implement multi-round gameplay where players can adjust their strategies between rounds.

### Scalability Improvements

Optimize for larger player counts and lower gas costs.

### UI Enhancements

Add more visual feedback, game statistics, and player history.

### Cross-Chain Compatibility

Enable the game to work across multiple blockchain networks.
````

## File: hardhat.config.js
````javascript
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337 // MetaMask compatibility
    }
  },
  paths: {
    artifacts: './frontend/src/artifacts',
  }
};
````

## File: package.json
````json
{
  "name": "twothirdsgame",
  "version": "1.0.0",
  "description": "This project implements a blockchain-based game where players submit numbers between 0 and 1000, and the winner is the player closest to 2/3 of the average of all submitted numbers.",
  "main": "hardhat.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/luk267/TwoThirdsGame.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "bugs": {
    "url": "https://github.com/luk267/TwoThirdsGame/issues"
  },
  "homepage": "https://github.com/luk267/TwoThirdsGame#readme",
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^5.0.0",
    "hardhat": "^2.22.19"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.2.0",
    "ethers": "^6.13.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
````

## File: README.md
````markdown
# Two-Thirds Average Game

This project implements a blockchain-based game where players submit numbers between 0 and 1000, and the winner is the player closest to 2/3 of the average of all submitted numbers.

## Game Rules

1. Players register and pay an entry fee
2. Players submit a number between 0 and 1000
3. The winner is the player whose number is closest to 2/3 of the average
4. In case of a tie, the winner is selected randomly
5. The winner receives the prize pool (minus service fee)

## Technical Architecture

The project uses:
- Solidity smart contracts deployed on a local Ethereum blockchain
- Factory pattern for creating game instances
- Commit-reveal scheme to hide player submissions
- React-based frontend for interacting with the game

## Smart Contract Security

The smart contracts implement several security measures:
- Commit-reveal pattern to prevent players from seeing each other's submissions
- Time limits for registration and submission phases
- Handling of non-responsive players
- Secure randomness for tie-breaking
- Protection against common vulnerabilities (reentrancy, etc.)

## Gas Optimizations

Gas optimizations implemented in the contracts:
- Use of uint8 for small values (minPlayers, serviceFeePercent)
- Efficient storage layout (packing variables)
- Minimal use of loops in critical functions
- Use of events for tracking game state changes
- Lazy evaluation patterns

## Installation and Setup

### Prerequisites

- Node.js and npm installed
- MetaMask browser extension

### Setup Instructions

1. Clone the repository
   ```
   git clone [repository-url]
   cd two-thirds-game
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start local Ethereum network
   ```
   npx hardhat node
   ```

4. In a new terminal, deploy the contracts
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. Copy the GameFactory contract address from the deployment output

6. Update the `factoryAddress` variable in `frontend/src/App.js` with the copied address

7. Start the frontend application
   ```
   cd frontend
   npm start
   ```

8. Connect MetaMask to the local network:
   - Network Name: Localhost 8545
   - RPC URL: http://localhost:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

9. Import some test accounts into MetaMask using the private keys from the Hardhat node output

## Usage

1. Create a new game by setting parameters (min players, entry fee, service fee, etc.)
2. Join the game by registering and paying the entry fee
3. Submit your number during the submission phase
4. Reveal your number when the reveal phase begins
5. Check the results after all players have revealed or the game has been finished

## Implementation Notes

- The contract uses a commit-reveal scheme to prevent players from seeing each other's numbers
- Players must reveal their numbers after the submission period ends
- If a player doesn't reveal their number, they forfeit their entry fee
- The admin can cancel the game if not enough players register
- Players can withdraw their entry fee if the game is cancelled

## Future Improvements

Potential improvements for future versions:
- Multiple rounds of play
- Leaderboard for tracking player performance
- Time-weighted randomness for better tie-breaking
- Gas optimization for larger player counts
- Cross-chain compatibility
- Tournament mode
````
