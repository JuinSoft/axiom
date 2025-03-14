#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, AgentInfo, AgentResponse, AgentsResponse};
use crate::state::{AGENTS, AGENT_COUNT, Config, CONFIG, OWNER_AGENTS};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:axiom-agent-registry";
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
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    CONFIG.save(deps.storage, &config)?;
    AGENT_COUNT.save(deps.storage, &0u64)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::RegisterAgent { name, description, configuration } => {
            execute_register_agent(deps, env, info, name, description, configuration)
        },
        ExecuteMsg::UpdateAgent { agent_id, name, description, configuration } => {
            execute_update_agent(deps, env, info, agent_id, name, description, configuration)
        },
        ExecuteMsg::DeactivateAgent { agent_id } => {
            execute_deactivate_agent(deps, env, info, agent_id)
        },
        ExecuteMsg::ActivateAgent { agent_id } => {
            execute_activate_agent(deps, env, info, agent_id)
        },
    }
}

pub fn execute_register_agent(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    name: String,
    description: String,
    configuration: String,
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
        configuration,
        is_active: true,
        created_at: _env.block.time.seconds(),
        updated_at: _env.block.time.seconds(),
    };

    AGENTS.save(deps.storage, agent_id, &agent)?;
    
    // Add to owner's agents
    let mut owner_agents = OWNER_AGENTS
        .may_load(deps.storage, info.sender.clone())?
        .unwrap_or_default();
    owner_agents.push(agent_id);
    OWNER_AGENTS.save(deps.storage, info.sender.clone(), &owner_agents)?;

    Ok(Response::new()
        .add_attribute("method", "register_agent")
        .add_attribute("agent_id", agent_id.to_string())
        .add_attribute("owner", info.sender))
}

pub fn execute_update_agent(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    agent_id: u64,
    name: Option<String>,
    description: Option<String>,
    configuration: Option<String>,
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
    if let Some(configuration) = configuration {
        agent.configuration = configuration;
    }
    
    agent.updated_at = env.block.time.seconds();

    AGENTS.save(deps.storage, agent_id, &agent)?;

    Ok(Response::new()
        .add_attribute("method", "update_agent")
        .add_attribute("agent_id", agent_id.to_string()))
}

pub fn execute_deactivate_agent(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    agent_id: u64,
) -> Result<Response, ContractError> {
    let mut agent = AGENTS.load(deps.storage, agent_id)?;

    // Only the owner can deactivate the agent
    if agent.owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    agent.is_active = false;
    agent.updated_at = env.block.time.seconds();
    
    AGENTS.save(deps.storage, agent_id, &agent)?;

    Ok(Response::new()
        .add_attribute("method", "deactivate_agent")
        .add_attribute("agent_id", agent_id.to_string()))
}

pub fn execute_activate_agent(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    agent_id: u64,
) -> Result<Response, ContractError> {
    let mut agent = AGENTS.load(deps.storage, agent_id)?;

    // Only the owner can activate the agent
    if agent.owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    agent.is_active = true;
    agent.updated_at = env.block.time.seconds();
    
    AGENTS.save(deps.storage, agent_id, &agent)?;

    Ok(Response::new()
        .add_attribute("method", "activate_agent")
        .add_attribute("agent_id", agent_id.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetAgent { agent_id } => to_binary(&query_agent(deps, agent_id)?),
        QueryMsg::ListAgents { start_after, limit } => to_binary(&list_agents(deps, start_after, limit)?),
        QueryMsg::ListOwnerAgents { owner, start_after, limit } => to_binary(&list_owner_agents(deps, owner, start_after, limit)?),
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
        agents.push(agent);
    }

    Ok(AgentsResponse { agents })
}

fn list_owner_agents(deps: Deps, owner: Addr, start_after: Option<u64>, limit: Option<u32>) -> StdResult<AgentsResponse> {
    let owner_agents = OWNER_AGENTS.may_load(deps.storage, owner)?.unwrap_or_default();
    let limit = limit.unwrap_or(10) as usize;
    
    let start_pos = if let Some(start_after) = start_after {
        owner_agents.iter().position(|id| *id == start_after).map(|pos| pos + 1).unwrap_or(0)
    } else {
        0
    };
    
    let agent_ids: Vec<u64> = owner_agents.into_iter().skip(start_pos).take(limit).collect();
    
    let mut agents = vec![];
    for id in agent_ids {
        let agent = AGENTS.load(deps.storage, id)?;
        agents.push(agent);
    }
    
    Ok(AgentsResponse { agents })
}

pub mod msg {
    use super::*;
    use schemars::JsonSchema;
    use serde::{Deserialize, Serialize};

    #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    pub struct InstantiateMsg {}

    #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum ExecuteMsg {
        RegisterAgent {
            name: String,
            description: String,
            configuration: String,
        },
        UpdateAgent {
            agent_id: u64,
            name: Option<String>,
            description: Option<String>,
            configuration: Option<String>,
        },
        DeactivateAgent {
            agent_id: u64,
        },
        ActivateAgent {
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
        ListOwnerAgents {
            owner: Addr,
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
        pub configuration: String,
        pub is_active: bool,
        pub created_at: u64,
        pub updated_at: u64,
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
    use cosmwasm_std::Addr;
    use cw_storage_plus::{Item, Map};
    use serde::{Serialize, Deserialize};
    use schemars::JsonSchema;

    #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    pub struct Config {
        pub owner: Addr,
    }

    pub const CONFIG: Item<Config> = Item::new("config");
    pub const AGENT_COUNT: Item<u64> = Item::new("agent_count");
    pub const AGENTS: Map<u64, AgentInfo> = Map::new("agents");
    pub const OWNER_AGENTS: Map<Addr, Vec<u64>> = Map::new("owner_agents");
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
    }
} 