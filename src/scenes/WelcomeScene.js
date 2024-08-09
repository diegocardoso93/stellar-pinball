import Phaser from 'phaser';
import logo from '../images/logo.png';

export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super('WelcomeScene');
  }

  preload() {
    this.load.image('logo', logo);
  }

  create() {
    const text_style = {
      fontSize: '50px',
      color: 'black',
      fontStyle: 'bold',
    };

    this.add.image(400, 240, 'logo');

    this.add.rectangle(380, 650, 350, 140, 0xffffff);
    const buttonStart = new Phaser.Geom.Rectangle(230, 560, 350, 140);
    this.add.graphics().fillStyle(0xfdda24, 1).fillRect(230, 560, 350, 140);
    this.add.text(330, 610, 'START', text_style);

    this.add.rectangle(380, 920, 350, 140, 0xffffff);
    const buttonScoreboard = new Phaser.Geom.Rectangle(230, 830, 350, 140);
    this.add.graphics().fillStyle(0xfdda24, 1).fillRect(230, 830, 350, 140);
    this.add.text(260, 880, 'SCOREBOARD', text_style);

    this.input.on('pointerdown', (pointer) => {
      if (Phaser.Geom.Rectangle.Contains(buttonStart, pointer.x, pointer.y)) {
        this.scene.start('GameScene');
      }
      if (
        Phaser.Geom.Rectangle.Contains(buttonScoreboard, pointer.x, pointer.y)
      ) {
        this.scene.start('ScoreboardScene');
      }
    });
  }
}
