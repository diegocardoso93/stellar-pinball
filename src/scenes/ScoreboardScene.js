import Phaser from 'phaser';

export default class ScoreboardScene extends Phaser.Scene {
  constructor() {
    super('ScoreboardScene');
  }

  create() {
    const back_style = {
      fontSize: '60px',
      color: 'black',
      fontStyle: 'bold',
    };
    this.add.rectangle(120, 120, 100, 100, 0xffffff);
    const buttonBack = new Phaser.Geom.Rectangle(80, 60, 100, 100);
    this.add.graphics().fillStyle(0xfdda24, 1).fillRect(80, 60, 100, 100);
    this.add.text(100, 90, '🠈', back_style);

    this.input.on('pointerdown', (pointer) => {
      if (Phaser.Geom.Rectangle.Contains(buttonBack, pointer.x, pointer.y)) {
        this.scene.start('WelcomeScene');
      }
    });

    const title_style = {
      fontSize: '60px',
      color: 'white',
      fontStyle: 'bold',
    };
    this.add.text(230, 90, 'SCOREBOARD', title_style);
    this.add.rectangle(400, 700, 650, 900, 0xffffff);

    const text_style = {
      fontSize: '40px',
      color: 'black',
      fontStyle: 'bold',
    };
    this.add.text(170, 270, 'ACCOUNT   |   SCORE', text_style);

    const [bx, by] = [120, 330];
    const [account, score] = ['ABCD...VXYZ', 100];
    for (let y = 0; y < 50 * 16; y += 50) {
      this.add.text(
        bx,
        by + y,
        `${account}   ${('' + score).padStart(7, ' ')}`,
        text_style
      );
    }
  }
}
