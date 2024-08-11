import Phaser from 'phaser';
import WelcomeScene from './scenes/WelcomeScene';
import ScoreboardScene from './scenes/ScoreboardScene';
import GameScene from './scenes/GameScene';
import EndGameScene from './scenes/EndGameScene';

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
