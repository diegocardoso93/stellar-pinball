import Phaser from 'phaser';
import logo from '../assets/image/logo.png';

export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super('WelcomeScene');
  }

  preload() {
    this.load.image('logo', logo);
  }

  create() {
    this.add.image(400, 240, 'logo');

    this.add.rectangle(380, 650, 350, 140, 0xffffff);
    const buttonStart = new Phaser.Geom.Rectangle(230, 560, 350, 140);
    this.add.graphics().fillStyle(0xfdda24, 1).fillRect(230, 560, 350, 140);
    this.add.text(330, 610, 'START', {fontSize: '50px', color: 'black', fontStyle: 'bold'});

    this.add.rectangle(380, 920, 350, 140, 0xffffff);
    const buttonScoreboard = new Phaser.Geom.Rectangle(230, 830, 350, 140);
    this.add.graphics().fillStyle(0xfdda24, 1).fillRect(230, 830, 350, 140);
    this.add.text(260, 880, 'SCOREBOARD', {fontSize: '50px', color: 'black', fontStyle: 'bold'});

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
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
