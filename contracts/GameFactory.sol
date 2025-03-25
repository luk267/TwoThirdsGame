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