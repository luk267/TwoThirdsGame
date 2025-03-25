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