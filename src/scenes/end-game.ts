import Phaser from 'phaser';
import { networks, Client } from 'scoreboard';
import { isAllowed, setAllowed, getUserInfo, signTransaction, isConnected } from '@stellar/freighter-api';

export default class EndGameScene extends Phaser.Scene {
  private score!: string;
  private success!: boolean;

  constructor() {
    super('EndGameScene');
  }

  init(data: any) {
    this.score = data.score;
  }

  create() {
    this.drawBackButton();

    this.add.text(260, 220, 'END GAME', {fontSize: '60px', color: 'white', fontStyle: 'bold' });
    this.add.rectangle(400, 500, 500, 200, 0xffffff);

    this.add.text(270, 440, `YOUR SCORE:`, {fontSize: '40px', color: 'black', fontStyle: 'bold'});
    this.add.text(330, 500, this.score || '0', {fontSize: '40px', color: 'black', fontStyle: 'bold'});

    this.drawWriteScoreButton();
  }

  async writeScore() {
    if (!await isConnected()) {
      alert('Please connect with your Freighter Wallet!');
      return;
    }

    if (!await isAllowed()) {
      await setAllowed();
    }

    if (await isAllowed()) {
      const { publicKey } = await getUserInfo();
      if (!publicKey) {
        alert('Please log in to your Freighter Wallet on the Test Net.');
        return;
      }
      let scoreboard = new Client({
        rpcUrl: 'https://soroban-testnet.stellar.org:443',
        ...networks.testnet
      });

      if (publicKey) scoreboard.options.publicKey = publicKey;

      const tx = await scoreboard.save_score({player: publicKey, score: this.score});
      const { result } = await tx.signAndSend({signTransaction});
      if (result) {
        this.success = true;
        this.drawSuccess();
      }
    }
  }

  drawBackButton() {
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
  }

  drawWriteScoreButton() {
    this.add.rectangle(380, 840, 350, 140, 0xffffff);
    const buttonScoreboard = new Phaser.Geom.Rectangle(230, 750, 350, 140);
    this.add.graphics().fillStyle(0xfdda24, 1).fillRect(230, 750, 350, 140);
    this.add.text(260, 770, 'WRITE TO', {fontSize: '50px', color: 'black', fontStyle: 'bold'});
    this.add.text(260, 820, 'SCOREBOARD', {fontSize: '50px', color: 'black', fontStyle: 'bold'});

    this.input.on('pointerdown', async (pointer: Phaser.Input.Pointer) => {
      if (
        Phaser.Geom.Rectangle.Contains(buttonScoreboard, pointer.x, pointer.y) && !this.success
      ) {
        this.writeScore();
      }
    });
  }

  drawSuccess() {
    this.add.rectangle(380, 840, 350, 140, 0x000000);
    this.add.graphics().fillStyle(0xfdda24, 1).fillRect(200, 750, 400, 140);
    this.add.text(260, 800, '✅SUCCESS', {fontSize: '50px', color: 'black', fontStyle: 'bold'});
  }
}
