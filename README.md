# Stellar Pinball 🪐

`#devchallenge #stellarchallenge #web3 #blockchain`   
  
A serverless pinball game built to the [Build Better on Stellar: Smart Contract Challenge](https://dev.to/challenges/stellar): Build a dApp.  
The Scoreboard is stored inside an smart contract on Stellar Network. 🌌   
  
 ![startscreen](https://github.com/diegocardoso93/stellar-pinball/blob/main/prints/0startscreen.png?raw=true) ![gamescreen](https://github.com/diegocardoso93/stellar-pinball/blob/main/prints/1gamescreen.png?raw=true) ![writescorescreen](https://github.com/diegocardoso93/stellar-pinball/blob/main/prints/2writescorescreen.png?raw=true) ![scoreboardscreen](https://github.com/diegocardoso93/stellar-pinball/blob/main/prints/3scoreboardscreen.png?raw=true)


⚠ `this project is running on TestNet, is not audited and should not be used in a production environment.`

## How to play
Use the keys `[spacebar]` `[A]` `[D]`  
To save your progress at the end of the game, use the Stellar Freighter Wallet on the Testnet.  
Visit this link to play [https://stellar-pinball.pages.dev/](https://stellar-pinball.pages.dev/)

### [dev] Installation

1. Clone repository

```
git clone https://github.com/diegocardoso93/stellar-pinball.git
```

```
cd stellar-pinball
```

2. Install dependencies

```
npm i
```

3. Start server

```
npm run dev
```

4. Open [https://localhost:5173](http://localhost:5173) in your browser

### [dev] Contract

1. Follow this tutorial to prepare smart contract dev environment  
[https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup)

2. Go to Rust project
```
cd contracts/scoreboard
```

3. Test
```
cargo test
```

4. Build
```
stellar contract build
```

5. Deploy
```
stellar contract deploy `
   --wasm .\target\wasm32-unknown-unknown\release\scoreboard.wasm `
   --source alice `
   --network testnet
```

6. Generate typescript bindings
```
stellar contract bindings typescript `
    --rpc-url https://soroban-testnet.stellar.org:443 `
    --network-passphrase "Test SDF Network ; September 2015" `
    --network testnet `
    --output-dir packages/scoreboard `
    --contract-id {previous-generated-contract-hash-here}
```

<sub>Inspired by: [https://github.com/amandafager/pinball.git](https://github.com/amandafager/pinball.git)</sub>   


