#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, WasmMsg,
    CosmosMsg, SubMsg, Addr,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, AgentInfo, AgentResponse, AgentsResponse};
use crate::state::{AGENTS, AGENT_COUNT, Config, CONFIG};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:axiom-marketplace";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let config = Config {
        owner: info.sender.clone(),
        fee_percentage: msg.fee_percentage,
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    CONFIG.save(deps.storage, &config)?;
    AGENT_COUNT.save(deps.storage, &0u64)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("fee_percentage", msg.fee_percentage.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::ListAgent { name, description, price, category } => {
            execute_list_agent(deps, env, info, name, description, price, category)
        },
        ExecuteMsg::UpdateAgent { agent_id, name, description, price, category } => {
            execute_update_agent(deps, env, info, agent_id, name, description, price, category)
        },
        ExecuteMsg::RemoveAgent { agent_id } => {
            execute_remove_agent(deps, env, info, agent_id)
        },
        ExecuteMsg::PurchaseAgent { agent_id } => {
            execute_purchase_agent(deps, env, info, agent_id)
        },
    }
}

pub fn execute_list_agent(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    name: String,
    description: String,
    price: Uint128,
    category: String,
) -> Result<Response, ContractError> {
    let mut count = AGENT_COUNT.load(deps.storage)?;
    let agent_id = count + 1;
    count += 1;
    AGENT_COUNT.save(deps.storage, &count)?;

    let agent = AgentInfo {
        id: agent_id,
        owner: info.sender.clone(),
        name,
        description,
        price,
        category,
        is_active: true,
    };

    AGENTS.save(deps.storage, agent_id, &agent)?;

    Ok(Response::new()
        .add_attribute("method", "list_agent")
        .add_attribute("agent_id", agent_id.to_string())
        .add_attribute("owner", info.sender))
}

pub fn execute_update_agent(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    agent_id: u64,
    name: Option<String>,
    description: Option<String>,
    price: Option<Uint128>,
    category: Option<String>,
) -> Result<Response, ContractError> {
    let mut agent = AGENTS.load(deps.storage, agent_id)?;

    // Only the owner can update the agent
    if agent.owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    // Update fields if provided
    if let Some(name) = name {
        agent.name = name;
    }
    if let Some(description) = description {
        agent.description = description;
    }
    if let Some(price) = price {
        agent.price = price;
    }
    if let Some(category) = category {
        agent.category = category;
    }

    AGENTS.save(deps.storage, agent_id, &agent)?;

    Ok(Response::new()
        .add_attribute("method", "update_agent")
        .add_attribute("agent_id", agent_id.to_string()))
}

pub fn execute_remove_agent(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    agent_id: u64,
) -> Result<Response, ContractError> {
    let agent = AGENTS.load(deps.storage, agent_id)?;

    // Only the owner can remove the agent
    if agent.owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    // Mark the agent as inactive
    let mut agent = agent;
    agent.is_active = false;
    AGENTS.save(deps.storage, agent_id, &agent)?;

    Ok(Response::new()
        .add_attribute("method", "remove_agent")
        .add_attribute("agent_id", agent_id.to_string()))
}

pub fn execute_purchase_agent(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    agent_id: u64,
) -> Result<Response, ContractError> {
    let agent = AGENTS.load(deps.storage, agent_id)?;
    let config = CONFIG.load(deps.storage)?;

    // Check if the agent is active
    if !agent.is_active {
        return Err(ContractError::AgentNotActive {});
    }

    // Check if the buyer sent enough funds
    let payment = info
        .funds
        .iter()
        .find(|coin| coin.denom == "inj")
        .ok_or(ContractError::NoFunds {})?;

    if payment.amount < agent.price {
        return Err(ContractError::InsufficientFunds {});
    }

    // Calculate fee and payment to the seller
    let fee_amount = agent.price * config.fee_percentage / Uint128::from(100u128);
    let seller_amount = agent.price - fee_amount;

    // Create transfer messages
    let mut messages: Vec<SubMsg> = vec![];

    // Transfer to the seller
    messages.push(SubMsg::new(CosmosMsg::Bank(
        cosmwasm_std::BankMsg::Send {
            to_address: agent.owner.to_string(),
            amount: vec![cosmwasm_std::Coin {
                denom: "inj".to_string(),
                amount: seller_amount,
            }],
        },
    )));

    // Transfer fee to the contract owner
    messages.push(SubMsg::new(CosmosMsg::Bank(
        cosmwasm_std::BankMsg::Send {
            to_address: config.owner.to_string(),
            amount: vec![cosmwasm_std::Coin {
                denom: "inj".to_string(),
                amount: fee_amount,
            }],
        },
    )));

    Ok(Response::new()
        .add_submessages(messages)
        .add_attribute("method", "purchase_agent")
        .add_attribute("agent_id", agent_id.to_string())
        .add_attribute("buyer", info.sender)
        .add_attribute("seller", agent.owner)
        .add_attribute("price", agent.price)
        .add_attribute("fee", fee_amount))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetAgent { agent_id } => to_binary(&query_agent(deps, agent_id)?),
        QueryMsg::ListAgents { start_after, limit } => to_binary(&list_agents(deps, start_after, limit)?),
    }
}

fn query_agent(deps: Deps, agent_id: u64) -> StdResult<AgentResponse> {
    let agent = AGENTS.load(deps.storage, agent_id)?;
    Ok(AgentResponse { agent })
}

fn list_agents(deps: Deps, start_after: Option<u64>, limit: Option<u32>) -> StdResult<AgentsResponse> {
    let start = start_after.map(|s| s + 1).unwrap_or(1);
    let limit = limit.unwrap_or(10) as usize;
    let count = AGENT_COUNT.load(deps.storage)?;

    let mut agents = vec![];
    for id in start..=count {
        if agents.len() >= limit {
            break;
        }
        let agent = AGENTS.load(deps.storage, id)?;
        if agent.is_active {
            agents.push(agent);
        }
    }

    Ok(AgentsResponse { agents })
}

pub mod msg {
    use super::*;
    use schemars::JsonSchema;
    use serde::{Deserialize, Serialize};

    #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    pub struct InstantiateMsg {
        pub fee_percentage: Uint128,
    }

    #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum ExecuteMsg {
        ListAgent {
            name: String,
            description: String,
            price: Uint128,
            category: String,
        },
        UpdateAgent {
            agent_id: u64,
            name: Option<String>,
            description: Option<String>,
            price: Option<Uint128>,
            category: Option<String>,
        },
        RemoveAgent {
            agent_id: u64,
        },
        PurchaseAgent {
            agent_id: u64,
        },
    }

    #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum QueryMsg {
        GetAgent {
            agent_id: u64,
        },
        ListAgents {
            start_after: Option<u64>,
            limit: Option<u32>,
        },
    }

    #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    pub struct AgentInfo {
        pub id: u64,
        pub owner: Addr,
        pub name: String,
        pub description: String,
        pub price: Uint128,
        pub category: String,
        pub is_active: bool,
    }

    #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    pub struct AgentResponse {
        pub agent: AgentInfo,
    }

    #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    pub struct AgentsResponse {
        pub agents: Vec<AgentInfo>,
    }
}

pub mod state {
    use cosmwasm_std::{Addr, Uint128};
    use cw_storage_plus::{Item, Map};
    use serde::{Serialize, Deserialize};
    use schemars::JsonSchema;

    #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    pub struct Config {
        pub owner: Addr,
        pub fee_percentage: Uint128,
    }

    pub const CONFIG: Item<Config> = Item::new("config");
    pub const AGENT_COUNT: Item<u64> = Item::new("agent_count");
    pub const AGENTS: Map<u64, AgentInfo> = Map::new("agents");
}

pub mod error {
    use cosmwasm_std::StdError;
    use thiserror::Error;

    #[derive(Error, Debug)]
    pub enum ContractError {
        #[error("{0}")]
        Std(#[from] StdError),

        #[error("Unauthorized")]
        Unauthorized {},

        #[error("Agent not active")]
        AgentNotActive {},

        #[error("No funds sent")]
        NoFunds {},

        #[error("Insufficient funds")]
        InsufficientFunds {},
    }
} 