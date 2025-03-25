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