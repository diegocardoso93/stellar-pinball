import Phaser from 'phaser';
import config from '../main';
import { ObjectFactory, Flipper, Launcher, Ball } from '../objects';
import { CollidedObject } from '../types';

export default class GameScene extends Phaser.Scene {
  gameWidth: number = config.scale.width;
  gameHeight: number = config.scale.height;
  gameBalls: number = 0;
  score: number = 0;
  currentBall: number = 0;
  gameStarted: boolean = false;
  dubbleScore: boolean = true;
  soundTriggers!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  soundStartGame!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  bumperHit!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  leftSpringLaunch!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  soundSmallBumper!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  back!: Phaser.GameObjects.Image;
  twoTimes!: Phaser.GameObjects.Image;
  spacePushed!: Phaser.Input.Keyboard.Key;
  leftSpring!: Phaser.Physics.Matter.Image;
  leftSpringLock!: Phaser.Physics.Matter.Sprite;
  launcher!: Launcher;
  ball!: Ball;
  scoreText!: Phaser.GameObjects.Text;
  ballsLeftText!: Phaser.GameObjects.Text;
  greenDotsGroup!: Phaser.GameObjects.Group;
  leftFlipper!: Flipper;
  rightFlipper!: Flipper;

  constructor() {
    super('GameScene');
  }

  create() {
    this.matter.world.setBounds(0, 0, this.gameWidth, this.gameHeight);
    this.back = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.back.scale = 1.15;
    this.twoTimes = this.add.image(3, this.gameHeight - 150, 'sheet', '2x.png').setOrigin(0);

    this.createSoundObjects();
    this.createGameObjects();
    this.configureGameKeys();

    this.addTextOnScene();
    this.collisionListeners();

    this.startGame();
  }

  createGameObjects() {
    const shapes = this.cache.json.get('shapes') as any;

    new ObjectFactory(this, this.gameWidth - this.gameWidth * 0.17, this.gameHeight * 0.40, 'sheet', 'rightSmallBumper.png', { shape: shapes.rightSmallBumper });
    new ObjectFactory(this, this.gameWidth * 0.17, this.gameHeight * 0.40, 'sheet', 'leftSmallBumper.png', { shape: shapes.leftSmallBumper });
    new ObjectFactory(this, this.gameWidth - 70, this.gameHeight - 70, 'sheet', 'blackDivider.png', { shape: shapes.blackDivider });
    new ObjectFactory(this, 70, this.gameHeight - 70, 'sheet', 'blackDivider.png', { shape: shapes.blackDivider });
    new ObjectFactory(this, this.gameWidth - ((800 * 0.5) + 2), 67, 'sheet', 'topHalfMoon.png', { shape: shapes.topHalfMoon, restitution: 0 });
    new ObjectFactory(this, this.gameWidth * 0.35, 200, 'sheet', 'topBumper.png', { shape: shapes.topBumper });
    new ObjectFactory(this, this.gameWidth * 0.5, 350, 'sheet', 'topBumper.png', { shape: shapes.topBumper });
    new ObjectFactory(this, this.gameWidth * 0.65, 200, 'sheet', 'topBumper.png', { shape: shapes.topBumper });
    new ObjectFactory(this, this.gameWidth * 0.25, this.gameHeight * 0.7, 'sheet', 'leftBumper.png', { shape: shapes.leftBumper });
    new ObjectFactory(this, this.gameWidth - this.gameWidth * 0.25, this.gameHeight * 0.7, 'sheet', 'rightBumper.png', { shape: shapes.rightBumper });
    new ObjectFactory(this, this.gameWidth * 0.14, this.gameHeight * 0.744, 'sheet', 'leftRamp.png', { shape: shapes.leftRamp, restitution: 0 });
    new ObjectFactory(this, this.gameWidth - this.gameWidth * 0.14, this.gameHeight * 0.744, 'sheet', 'rightRamp.png', { shape: shapes.rightRamp, restitution: 0 });
    this.matter.add.image(this.gameWidth / 2, 100, 'topDivider', undefined, { isStatic: true, label: 'topDivider' });
    this.leftFlipper = new Flipper(this, this.gameWidth * 0.31, this.gameHeight * 0.87, 'left', shapes.leftTrigger, this.soundTriggers);
    this.rightFlipper = new Flipper(this, this.gameWidth * 0.68, this.gameHeight * 0.87, 'right', shapes.rightTrigger, this.soundTriggers);

    let leftSpringSensor = this.add.rectangle(25, this.gameHeight - 130, 60, 10);
    this.matter.add.gameObject(leftSpringSensor, { isSensor: true, isStatic: true, label: 'leftSpringSensor'});
    this.leftSpring = this.matter.add.image(this.gameWidth - this.gameWidth + 25, this.gameHeight - 30, 'spring', undefined, { isStatic: true, friction: 0, label: 'leftSpring' });
    this.leftSpringLock = this.matter.add.sprite(this.leftSpring.x + 8, this.leftSpring.y - 136,'sheet','closingPinLeft.png', { shape: shapes.closingPinLeft });
    this.launcher = new Launcher(this, this.gameWidth - 25, this.gameHeight - 40, 50, this.ball, 'spring', 'sheet', 'closingPinRight.png', shapes.closingPinRight, this.leftSpringLaunch);
  }

  configureGameKeys() {
    if (this.input.keyboard) {
      this.spacePushed = this.input.keyboard.addKey('space');
      this.spacePushed.enabled = false;
      const aPushed = this.input.keyboard.addKey('A');
      const dPushed = this.input.keyboard.addKey('D');
      const muteSound = this.input.keyboard.addKey('P');

      muteSound.on('down', () => { this.sound.mute = !this.sound.mute }, this);
      aPushed.on('down', () => { this.leftFlipper.flip(this.soundTriggers); }, this);
      aPushed.on('up', () => { this.leftFlipper.release(); }, this);
      dPushed.on('down', () => { this.rightFlipper.flip(this.soundTriggers);}, this);
      dPushed.on('up', () => { this.rightFlipper.release(); }, this);
    }
  }

  createSoundObjects() {
    this.soundTriggers = this.sound.add('triggerHit');
    this.soundStartGame = this.sound.add('startGame');
    this.bumperHit = this.sound.add('bumperHit');
    this.leftSpringLaunch = this.sound.add('leftSpringLaunch');
    this.soundSmallBumper = this.sound.add('smallBumper');
    this.sound.mute = false;
  }

  startGame() {
    setTimeout(() => {
      this.soundStartGame.play({ rate: 3 });
      this.newGame(); 
      this.gameStarted = true;
      this.spacePushed.enabled = true;
    }, 1000);
  }

  addTextOnScene() {
    this.scoreText = this.add.text(this.gameWidth * 0.03, 25, 'Score: ' + this.score, { fontSize: 26 })
      .setOrigin(0)
      .setDepth(1);
    this.ballsLeftText = this.add.text(this.gameWidth  * 0.73 , 25, 'Balls left: ' + this.gameBalls, { fontSize: 26 })
      .setOrigin(0)
      .setDepth(1);
  }

  newGame() {
    this.currentBall = 0 
    this.gameBalls = 3;
    this.score = 0;
    this.dubbleScore = true;
    this.getNewBall();
    this.updateBallsLeftText();
    this.updateScoreText();

    this.leftSpringLock.setPosition(this.leftSpring.x + 8 - this.leftSpringLock.width, this.leftSpring.y - 136);
  }

  getNewBall() {
    this.ball = new Ball(
      this,
      30,
      this.gameHeight - 200,
      'ball',
      this.launcher, 
    );
    this.currentBall++;    
  }

  resetBall() {
    if (this.gameBalls >= 1 && this.ball.y > this.gameHeight - 20) {
      this.gameBalls--;
      this.getNewBall();
      this.updateBallsLeftText();
      this.launcher.resetValves();
    }

    if (this.ball.getData('dead')) {
      this.ball.destroy(); 
      this.gameBalls--;
      this.getNewBall();
      this.updateBallsLeftText();
    } 
  } 

  endGame() {
    this.spacePushed.enabled = false;
    this.gameStarted = false;
    this.ball.destroy();
    this.scene.start('EndGameScene', { score: this.score });
  }

  collisionListeners() {
    this.matter.world.on('collisionstart', (_event: any, bodyA: CollidedObject, _bodyB: CollidedObject) => {

      switch (bodyA.label) {

        case 'sideSmallBumper':
        case 'sideBumper':
          bodyA.gameObject.setTint(0xffd700); 
          this.soundSmallBumper.play();
        break;

        case 'launcher':
          if (!this.ball.getData('onStart')) {
            this.ball.setData('onStart', true);
            this.ball.setData('dead', true);
          }
        break;

        case 'leftSpring':
          if (!this.ball.onLeftSpring) {
            this.ball.onLeftSpring = true;
          }
        break;

        case 'leftSpringSensor':
          let launchLeftTimer = setInterval(() => {
            if (this.leftSpring.y <= 1230) {
              if(this.ball.onLeftSpring) { 
                this.ball.x = this.leftSpring.x;
                this.ball.y = this.leftSpring.y - this.leftSpring.height / 2 - this.ball.height / 2;
                this.ball.updateVelocity(0, 0);
              } 
              this.leftSpring.setPosition(
                this.leftSpring.x,
                this.leftSpring.y + 2
              );
            }
            if (this.leftSpring.y >= 1230) {
              let velocity = this.launcher.setBallVelocity(14);
              this.ball.updateVelocity(velocity.vx, velocity.vy);
              this.leftSpringLaunch.play();
              this.ball.onLeftSpring = false;
              setTimeout(() => {
                this.leftSpringLock.setPosition(
                  this.leftSpringLock.x - (this.leftSpringLock.x - (this.leftSpringLock.width / 2)),
                  this.leftSpringLock.y
                );
              }, 300);
              clearInterval(launchLeftTimer);
            }
          }, 50);
  
          setTimeout(() => {
            this.leftSpring.setPosition(
              this.leftSpring.x,
              this.leftSpring.y = this.gameHeight - 30
            );
          }, 50);
        break;

        case 'topBumper':
          bodyA.gameObject.setTint(0xffd700); 
          this.bumperHit.play();
        break;
      }
    });

    this.matter.world.on('collisionend', (_event: any, bodyA: CollidedObject, _bodyB: CollidedObject) => {
      if (bodyA.label === 'leftSpring') {
        if (this.dubbleScore) {
          this.score = this.score * 2;
          this.updateScoreText();
          this.dubbleScore = false; 
        }
      }
      if (bodyA.label === 'sideSmallBumper' || bodyA.label === 'sideBumper') {
        bodyA.label === 'sideSmallBumper' ? this.score = this.score + 700 : this.score = this.score + 500;
        this.updateScoreText();
        setTimeout(() => {
          bodyA.gameObject.clearTint(); 
        }, 100);
      } 
      if (bodyA.label === 'topBumper') {
        this.score = this.score + 1000;
        this.updateScoreText();
        setTimeout(() => {
          bodyA.gameObject.clearTint(); 
        }, 100);
      }  
    });
  }

  updateScoreText() {
    this.scoreText.text = 'Score: ' + this.score;
  }

  updateBallsLeftText() {
    this.ballsLeftText.text = 'Balls left: ' + this.gameBalls;
  }

  update() {
    if(this.gameStarted) {
      this.resetBall();

      if (this.ball.y <= 15) {
        this.ball.updateVelocity(0, 10);
        this.ball.setPosition(this.gameWidth * 0.2, this.gameHeight * 0.2);
      }
      if (this.gameBalls === 0) {
        this.endGame();
        this.newGame(); 
      }
    }
  }
}
