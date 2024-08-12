import Phaser from 'phaser';
import WelcomeScene from './scenes/welcome';
import ScoreboardScene from './scenes/scoreboard';
import GameScene from './scenes/game';
import EndGameScene from './scenes/end-game';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 1200,
  },
  scene: [WelcomeScene, GameScene, ScoreboardScene, EndGameScene],
  physics: {
    default: 'matter',
    matter: {
      // debug: true,
      gravity: {
        x: 0,
        y: 0.4,
      },
    },
  },
};

export default new Phaser.Game(config);
