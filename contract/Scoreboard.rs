#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, String, log, vec, Vec, Address, Map, map, Symbol, symbol_short};

#[contract]
pub struct Scoreboard;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Plays,
    Scores
}

#[derive(Clone, Copy, PartialEq, Eq)]
#[repr(u32)]
#[contracttype]
pub enum State {
    Closed = 0,
    Openned = 1
}

const STATE: Symbol = symbol_short!("STATE");

#[contractimpl]
impl Scoreboard {
    pub fn open_machine(env: Env) {
        env.storage().persistent().set(&STATE, &State::Openned)
    }
    pub fn close_machine(env: Env) {
        env.storage().persistent().set(&STATE, &State::Closed)
    }
    pub fn save_score(env: Env, player: Address, score: u64) {
        assert!(is_open(&env), "gamehouse is closed");
        add_score(&env, player, score);
    }
    pub fn show(env: Env) -> Map<Address, Vec<u64>> {
        let scores: Map<Address, Vec<u64>> = env.storage().persistent().get(&DataKey::Scores).unwrap_or(map![&env]);
        log!(&env, "{}", scores);
        scores
    }
}

fn add_score(env: &Env, player: Address, score: u64) {
    let mut scores: Map<Address, Vec<u64>> = env.storage().persistent().get(&DataKey::Scores).unwrap_or(map![&env, (player.clone(), vec![&env])]);
    let mut player_scores = scores.get(player.clone()).unwrap_or(vec![&env]);
    player_scores.push_back(score);
    scores.set(player, player_scores);
    env.storage().persistent().set(&DataKey::Scores, &scores);
}

fn is_open(env: &Env) -> bool {
    env.storage().persistent().get(&STATE).unwrap_or(State::Closed) == State::Openned
}
