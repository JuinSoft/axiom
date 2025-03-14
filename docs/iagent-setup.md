# iAgent Setup Guide

This guide explains how to set up and use iAgent with the Axiom platform.

## Overview

iAgent is a Python-based AI agent framework developed by Injective Labs. It allows you to create and manage AI agents that can interact with the Injective blockchain. The Axiom platform integrates with iAgent to provide a no-code interface for creating and managing these agents.

## Prerequisites

- Python 3.12 or higher
- Node.js 16 or higher
- Git

## Setting up iAgent

1. Clone the iAgent repository:
   ```bash
   git clone https://github.com/InjectiveLabs/iAgent.git
   cd iAgent
   ```

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your OpenAI API key:
   ```bash
   export OPENAI_API_KEY="your_openai_api_key_here"
   ```

4. Start the iAgent server:
   ```bash
   python agent_server.py --port 5000
   ```

## Configuring Axiom to use iAgent

1. Create a `.env` file in the `backend` directory of your Axiom project with the following content:
   ```
   IAGENT_API_URL=http://localhost:5000
   ```

2. If you're running iAgent on a different machine or port, update the URL accordingly.

## Using iAgent with Axiom

The Axiom platform provides a user-friendly interface for creating and managing AI agents. Here's how to use it:

1. Create a new agent through the Axiom interface.
2. Configure the agent with the desired parameters.
3. Deploy the agent to iAgent.
4. Interact with the agent through the Axiom interface.

## Agent Configuration

When creating an agent, you can configure the following parameters:

- **Name**: The name of the agent.
- **Description**: A description of what the agent does.
- **Prompt**: The initial prompt for the agent.
- **Model**: The OpenAI model to use (default: gpt-4).
- **Tools**: The tools the agent can use.
- **Memory**: Whether the agent should have memory (default: false).
- **Address**: The Injective wallet address to use for transactions.
- **Private Key**: The private key for the wallet.
- **Network**: The Injective network to use (mainnet or testnet).

## API Endpoints

The iAgent API provides the following endpoints:

- `POST /agents`: Create a new agent.
- `GET /agents/{agent_id}`: Get information about an agent.
- `DELETE /agents/{agent_id}`: Delete an agent.
- `POST /chat`: Chat with an agent.

## Troubleshooting

If you encounter issues with iAgent, check the following:

1. Make sure the iAgent server is running.
2. Verify that the `IAGENT_API_URL` environment variable is set correctly.
3. Check the logs of both the iAgent server and the Axiom backend for error messages.

## Additional Resources

- [iAgent GitHub Repository](https://github.com/InjectiveLabs/iAgent)
- [Injective Documentation](https://docs.injective.network/) 