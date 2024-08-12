import Phaser from 'phaser';
import config from '../main';
import Launcher from './launcher';

export default class Ball extends Phaser.Physics.Matter.Image {
  gameWidth = config.scale.width;
  gameHeight = config.scale.height;
  onLeftSpring: boolean;
  launcher: Launcher;

  constructor(scene: any, x: number, y: number, texture: string, launcher: Launcher) {
    super(scene.matter.world, x, y, texture);

    scene.add.existing(this);
    this.setTexture(texture);
    this.scale = 1.5;
    this.setBody({
      type: 'circle',
      radius: 18,
    });

    this.setAngularVelocity(0.01);
    this.setBounce(0.5);
    this.setFrictionAir(0.0001);
    this.setDensity(0.001);
    this.setFriction(0);
    this.setData('onStart', true);
    this.onLeftSpring = false;
    this.preUpdate();
    this.launcher = launcher;
    this.launcher.attachBallOnLaunch(this);
  }

  updateVelocity(vx: number = 0, vy: number = 0) {
    this.setVelocityX(vx);
    this.setVelocityY(vy);
  }

  preUpdate() {
    if (this.y > this.gameHeight - 20) {
      this.destroy();
    }
  }
}