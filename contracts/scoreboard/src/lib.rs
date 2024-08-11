#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, log, vec, Vec, Address, Map, map};

#[contract]
pub struct ScoreboardContract;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Plays,
    Scores
}

#[contractimpl]
impl ScoreboardContract {
    pub fn save_score(env: Env, player: Address, score: u32) -> bool {
        log!(&env, "`save_score` is called: {} {}", player, score);
        add_score(&env, player, score);
        true
    }
    pub fn show(env: Env) -> Map<Address, Vec<u32>> {
        log!(&env, "`show` is called");
        let scores: Map<Address, Vec<u32>> = env.storage().persistent().get(&DataKey::Scores).unwrap_or(map![&env]);
        log!(&env, "{}", scores);
        scores
    }
}

fn add_score(env: &Env, player: Address, score: u32) {
    let mut scores: Map<Address, Vec<u32>> = env.storage().persistent().get(&DataKey::Scores).unwrap_or(map![&env, (player.clone(), vec![&env])]);
    let mut player_scores = scores.get(player.clone()).unwrap_or(vec![&env]);
    player_scores.push_back(score);
    scores.set(player, player_scores);
    env.storage().persistent().set(&DataKey::Scores, &scores);
}

mod test;
