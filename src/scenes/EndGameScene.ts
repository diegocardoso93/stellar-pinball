import Phaser from 'phaser';
import { networks, Client } from 'scoreboard';
import { isAllowed, setAllowed, getUserInfo, signTransaction } from '@stellar/freighter-api';

export default class EndGameScene extends Phaser.Scene {
  private score!: string;

  constructor() {
    super('EndGameScene');
  }

  init(data: any) {
    this.score = data.score;
  }

  create() {
    this.add.text(260, 220, 'END GAME', {fontSize: '60px', color: 'white', fontStyle: 'bold' });
    this.add.rectangle(400, 500, 500, 200, 0xffffff);

    this.add.text(270, 440, `YOUR SCORE:`, {fontSize: '40px', color: 'black', fontStyle: 'bold'});
    this.add.text(330, 500, this.score || '12300', {fontSize: '40px', color: 'black', fontStyle: 'bold'});

    this.add.rectangle(380, 840, 350, 140, 0xffffff);
    const buttonScoreboard = new Phaser.Geom.Rectangle(230, 750, 350, 140);
    this.add.graphics().fillStyle(0xfdda24, 1).fillRect(230, 750, 350, 140);
    this.add.text(260, 770, 'WRITE TO', {fontSize: '50px', color: 'black', fontStyle: 'bold'});
    this.add.text(260, 820, 'SCOREBOARD', {fontSize: '50px', color: 'black', fontStyle: 'bold'});

    this.input.on('pointerdown', async (pointer: Phaser.Input.Pointer) => {
      if (
        Phaser.Geom.Rectangle.Contains(buttonScoreboard, pointer.x, pointer.y)
      ) {
        this.writeScore();
      }
    });
  }

  async writeScore() {
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

      const tx = await scoreboard.save_score({player: publicKey, score: this.score});
      const { result } = await tx.signAndSend({signTransaction});
      if (result) {
        console.log("success");
      }
    }
  }
}
