import Phaser from 'phaser';
import { networks, Client } from 'scoreboard';
import { isAllowed, setAllowed, getUserInfo } from '@stellar/freighter-api';
import { ContractScores, PlayerScore } from '../types';

export default class ScoreboardScene extends Phaser.Scene {
  constructor() {
    super('ScoreboardScene');
  }

  async create() {
    this.add.rectangle(120, 120, 100, 100, 0xffffff);
    const buttonBack = new Phaser.Geom.Rectangle(80, 60, 100, 100);
    this.add.graphics().fillStyle(0xfdda24, 1).fillRect(80, 60, 100, 100);
    this.add.text(100, 90, '🠈', {
      fontSize: '60px',
      color: 'black',
      fontStyle: 'bold',
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (Phaser.Geom.Rectangle.Contains(buttonBack, pointer.x, pointer.y)) {
        this.scene.start('WelcomeScene');
      }
    });

    this.add.text(230, 90, 'SCOREBOARD', {fontSize: '60px', color: 'white', fontStyle: 'bold' });
    this.add.rectangle(400, 700, 650, 900, 0xffffff);

    this.add.text(104, 270, '# |  ACCOUNT  |   SCORE', {fontSize: '40px', color: 'black', fontStyle: 'bold'});

    const [scoreboards, publicKey] = await this.readScoreboard();
    const accountsTopScore = scoreboards.map(([acc, scores]: ContractScores) => ({acc, score: Math.max(...scores)}));
    accountsTopScore.sort((a: PlayerScore, b: PlayerScore) => b.score - a.score);

    const [bx, by] = [80, 330];
    for (let y = 0; y < 50 * 15; y += 50) {
      const idx = y/50;
      if (!accountsTopScore[idx]) break;
      const playerScore = accountsTopScore[idx];
      const account = this.shortAddress(playerScore.acc);
      const score = playerScore.score;
      this.add.text(
        bx,
        by + y,
        `${(''+ (idx+1)).padStart(2, ' ')}  ${account}   ${('' + score).padStart(8, ' ')}`,
          {fontSize: '40px', color: 'black', fontStyle: 'bold', backgroundColor: playerScore.acc === publicKey ? 'yellow' : 'white'}
      );
    }
  }

  shortAddress(address: string) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  async readScoreboard() {
    if (!await isAllowed()) {
      await setAllowed();
    }

    if (await isAllowed()) {
      const { publicKey } = await getUserInfo();
      let scoreboard = new Client({
        rpcUrl: 'https://soroban-testnet.stellar.org:443',
        ...networks.testnet
      });

      if (publicKey) scoreboard.options.publicKey = publicKey;

      const tx = await scoreboard.show();
      return [tx.result, publicKey];
    }

    return [];
  }
}
