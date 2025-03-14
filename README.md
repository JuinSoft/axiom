# Axiom - No-Code AI Agent Platform for Injective

## Overview
Axiom is a no-code platform that enables users to design, deploy, and manage AI agents on the Injective blockchain using iAgent 2.0. The platform features a user-friendly interface for defining agent behaviors, AI-assisted design, and a marketplace for sharing and selling agent designs, ensuring security and compliance.

## Key Features
- **User-Friendly Interface**: Drag-and-drop tools and natural language input for describing agent behaviors
- **AI-Assisted Design**: Generate agent configurations from user descriptions with AI assistance
- **Agent Deployment**: Seamless integration with iAgent 2.0 for blockchain deployment
- **Marketplace**: Buy, sell, and share agent designs with secure smart contract transactions

## Project Structure
- `frontend/`: React-based web application for the no-code interface
- `backend/`: Node.js server for handling AI processing and blockchain interactions
- `contracts/`: CosmWasm smart contracts for the agent marketplace
- `docs/`: Documentation for the platform

## Getting Started
1. Clone this repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Run the development servers

## Development Setup
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Run frontend development server
cd ../frontend
npm run dev

# Run backend development server
cd ../backend
npm run dev
```

## Technologies Used
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Blockchain**: Injective iAgent 2.0, CosmWasm
- **AI**: OpenAI API for agent configuration generation

## Hackathon Information
This project is being developed for the [Injective AI Hackathon](https://dorahacks.io/hackathon/injective-ai/). 