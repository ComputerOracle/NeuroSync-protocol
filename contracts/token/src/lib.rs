#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
pub enum DataKey {
    Admin,
    Balance(Address),
}

#[contract]
pub struct NSyncToken;

#[contractimpl]
impl NSyncToken {
    /// Initialize the contract with an admin address
    pub fn initialize(env: Env, admin: Address) {
        let admin_key = DataKey::Admin;
        if env.storage().instance().has(&admin_key) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&admin_key, &admin);
        env.storage().instance().extend_ttl(172_800, 518_400);
    }

    /// Return token name
    pub fn name(env: Env) -> String {
        String::from_str(&env, "NeuroSync Protocol Token")
    }

    /// Return token symbol
    pub fn symbol(env: Env) -> String {
        String::from_str(&env, "NSYNC")
    }

    /// Return token decimals
    pub fn decimals(_env: Env) -> u32 {
        7
    }

    /// Admin function to mint $NSYNC tokens to an address
    pub fn mint(env: Env, to: Address, amount: i128) {
        if amount <= 0 {
            panic!("Amount must be positive");
        }
        
        env.storage().instance().extend_ttl(172_800, 518_400);
        let admin_key = DataKey::Admin;
        let admin: Address = env
            .storage()
            .instance()
            .get(&admin_key)
            .unwrap_or_else(|| panic!("Not initialized"));
        admin.require_auth();

        let balance_key = DataKey::Balance(to.clone());
        let balance: i128 = env.storage().persistent().get(&balance_key).unwrap_or(0);
        env.storage().persistent().set(&balance_key, &(balance + amount));
        env.storage().persistent().extend_ttl(&balance_key, 172_800, 518_400);
    }

    /// Get token balance for an address
    pub fn balance(env: Env, id: Address) -> i128 {
        let balance_key = DataKey::Balance(id);
        if env.storage().persistent().has(&balance_key) {
            env.storage().persistent().extend_ttl(&balance_key, 172_800, 518_400);
        }
        env.storage().persistent().get(&balance_key).unwrap_or(0)
    }

    /// Standard token transfer between accounts
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        if amount <= 0 {
            panic!("Amount must be positive");
        }
        from.require_auth();

        let from_key = DataKey::Balance(from.clone());
        let to_key = DataKey::Balance(to.clone());

        let from_balance: i128 = env.storage().persistent().get(&from_key).unwrap_or(0);
        if from_balance < amount {
            panic!("Insufficient balance");
        }

        let to_balance: i128 = env.storage().persistent().get(&to_key).unwrap_or(0);

        env.storage().persistent().set(&from_key, &(from_balance - amount));
        env.storage().persistent().extend_ttl(&from_key, 172_800, 518_400);

        env.storage().persistent().set(&to_key, &(to_balance + amount));
        env.storage().persistent().extend_ttl(&to_key, 172_800, 518_400);
    }
}

