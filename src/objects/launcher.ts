import { KeyboardKey, Sound } from '../types';
import Ball from './ball';

export default class Launcher {
  scene: Phaser.Scene;
  width: number;
  height: number;
  x: number;
  y: number;
  ball: Ball;
  spring: string;
  colliding: boolean;
  sheet: string;
  texture: string;
  shapes: string;
  launchSound: Sound;
  spacePushed?: KeyboardKey;
  launchPaddlePosition: any;
  startLaunchPaddle: any;
  launchPaddleLock: any;
  pushLevel: number = 0;
  startTimer?: NodeJS.Timeout;

  constructor(
    scene: Phaser.Scene, x: number, y: number, width: number, ball: Ball,
    spring: string, sheet: string, texture: string, shapes: string, launchSound: Sound
  ) {
    this.scene = scene;
    this.width = width;
    this.height = 350;
    this.x = x;
    this.y = y;
    this.ball = ball;
    this.spring = spring;
    this.colliding = false;
    this.sheet = sheet;
    this.texture = texture;
    this.shapes = shapes;
    this.launchSound = launchSound;

    this.drawShape();
    this.releaseBall(this.ball);  
    this.spacePushed = this.scene.input?.keyboard?.addKey('space');
    this.collisionTest();
  }

  drawShape() {
    let startLaunchPaddle = this.scene.matter.add.image(this.x, this.y, this.spring, undefined, { 
      isStatic: true,
      friction: 0,
      label: 'launcher',
    });

    this.scene.matter.add.rectangle(
      this.x + 10,
      this.y * 0.6,
      60,
      10,
      {
        isSensor: true,
        isStatic: true,
        label: 'launchPaddleLockSensor',
      }
    );

    this.launchPaddlePosition = startLaunchPaddle.y;
    this.startLaunchPaddle = startLaunchPaddle;

    this.launchPaddleLock = this.scene.matter.add.sprite(
      this.x + 0,
      this.y * 0.54,
      this.sheet,
      this.texture,
      { shape: this.shapes }
    );

    this.launchPaddleLock.setPosition(
      this.launchPaddleLock.x + 95,
      this.launchPaddleLock.y
    );
  }

  resetValves() {
    this.launchPaddleLock.x += 100;
  }

  collisionTest() {
    const launchPaddleLock = this.launchPaddleLock;
    const gameWidth = this.x;
    this.scene.matter.world.on('collisionend', (event: Phaser.Physics.Matter.Events.CollisionEndEvent) => {
      event.pairs.forEach((pair) => {
        const { bodyA } = pair;

        if (bodyA.label == 'launchPaddleLockSensor') {
          if (launchPaddleLock.x >= gameWidth + 1) {
            setTimeout(() => {
              launchPaddleLock.setPosition(
                launchPaddleLock.x - 100,
                launchPaddleLock.y
              );
            }, 100);
          }
        }
      });
    });
  }

  attachBallOnLaunch(ball: Ball) {
    this.ball = ball;
    this.ball.x = this.x;
    this.ball.y = this.y - this.height / 2 - this.ball.height / 2;
    this.ball.setVelocity(0, 0);
    this.ball.setData('onStart', true);
  }

  setBallVelocity(pushLevel: number) {
    let vx;
    let vy;

    if (pushLevel <= 6) (vx = 0), (vy = -10);
    if (pushLevel >= 7 && pushLevel <= 10) (vx = 0), (vy = -20);
    if (pushLevel >= 11 && pushLevel <= 15) (vx = 0), (vy = -30);
    if (pushLevel >= 16) (vx = 10), (vy = -40);

    return { vx, vy };
  }

  releaseBall(ball: Ball) {
    const spacePushed = this.scene.input?.keyboard?.addKey('space');
    this.ball = ball;

    spacePushed?.on(
      'down',
      () => {
        this.pushLevel = 0;
        this.startTimer = setInterval(() => {
          if (this.startLaunchPaddle.y <= 1240) {
            this.pushLevel = this.pushLevel + 1;

            if (this.ball.getData('onStart')) {
              this.startLaunchPaddle.setPosition(
                this.startLaunchPaddle.x,
                this.startLaunchPaddle.y + 2,
                null
              );
            }
          }
        }, 10);
      },
      this
    );

    spacePushed?.on(
      'up',
      () => {
        clearInterval(this.startTimer);
        let velocity = this.setBallVelocity(this.pushLevel);
        if (this.ball.getData('onStart')) {
          this.launchSound.play();
          this.ball.updateVelocity(velocity.vx, velocity.vy);
          this.ball.setData('onStart', false);
        }

        setTimeout(() => {
          this.startLaunchPaddle.setPosition(
            this.startLaunchPaddle.x,
            this.launchPaddlePosition,
            null
          );
        }, 50);
      },
      this
    );
  }
}
