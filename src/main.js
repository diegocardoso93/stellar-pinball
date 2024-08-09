import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import EndGameScene from './scenes/EndGameScene';
import WelcomeScene from './scenes/WelcomeScene';
import ScoreboardScene from './scenes/ScoreboardScene';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 1200,
  },
  scene: [WelcomeScene, ScoreboardScene, GameScene, EndGameScene],
  physics: {
    default: 'matter',
    matter: {
      // debug: true,
      gravity: {
        x: 0,
        y: 1.2,
      },
    },
  },
};

export default new Phaser.Game(config);
