# Two Thirds Game - Development Guide

## Build/Run Commands
```bash
# Root Project (Smart Contracts)
npm install                                           # Install dependencies
npx hardhat compile                                   # Compile contracts
npx hardhat node                                      # Run local Ethereum node
npx hardhat run scripts/deploy.js --network localhost # Deploy contracts

# Frontend
cd frontend
npm install
npm start                                             # Start dev server
npm test                                              # Run React tests
npm run build                                         # Build for production
```

## Code Style Guidelines

### Solidity
- Use NatSpec comments for functions and contracts
- Explicitly declare function visibility (external, public, internal, private)
- Use ReentrancyGuard for external calls
- Emit events for all state changes
- Organization: enums → state vars → structs → mappings → events → functions

### JavaScript/React
- Use functional components with hooks
- Maintain consistent import order: React → libraries → local components
- Error handling: Try/catch for async operations, conditional rendering for null states
- Follow React naming conventions (useXxx for hooks, handleXxx for event handlers)
- Use descriptive variable and function names