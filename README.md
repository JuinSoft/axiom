# Axiom - No-Code AI Agent Platform for Injective

## Overview
Axiom is a no-code platform that enables users to design, deploy, and manage AI agents on the Injective blockchain using iAgent. The platform features a user-friendly interface for defining agent behaviors, AI-assisted design, and a marketplace for sharing and selling agent designs, ensuring security and compliance.

## Key Features
- **User-Friendly Interface**: Drag-and-drop tools and natural language input for describing agent behaviors
- **AI-Assisted Design**: Generate agent configurations from user descriptions with AI assistance
- **Agent Deployment**: Seamless integration with iAgent for blockchain deployment
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
4. Set up iAgent (see [iAgent Setup Guide](docs/iagent-setup.md))
5. Run the development servers

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

## iAgent Integration
This project integrates with iAgent, a Python-based AI agent framework developed by Injective Labs. iAgent allows you to create and manage AI agents that can interact with the Injective blockchain. For more information on setting up and using iAgent with this project, see the [iAgent Setup Guide](docs/iagent-setup.md).

## Technologies Used
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Blockchain**: Injective, CosmWasm
- **AI**: OpenAI API for agent configuration generation
- **iAgent**: Python-based AI agent framework for Injective

## Hackathon Information
This project is being developed for the [Injective AI Hackathon](https://dorahacks.io/hackathon/injective-ai/). 