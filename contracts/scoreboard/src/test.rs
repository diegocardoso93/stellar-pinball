#![cfg(test)]

use super::*;
use soroban_sdk::{vec, map, Env, testutils::Address as _, Address};

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ScoreboardContract);
    let client: ScoreboardContractClient = ScoreboardContractClient::new(&env, &contract_id);

    let player = &Address::generate(&env);
    let score: u32 = 10000;
    client.save_score(player, &score);

    let scoreboard = client.show();
    assert_eq!(
        scoreboard,
        map![&env, (player.clone(), vec![&env, score])]
    );
}
