import GameScene from '../scenes/game';

export default class ObjectFactory {
  constructor(scene: GameScene, x: number, y: number, sheet: string, texture: string, options?: Phaser.Types.Physics.Matter.MatterBodyConfig) {
    const obj = scene.matter.add.sprite(0, 0, sheet, texture, { restitution: 1, ...options });
    obj.setPosition(x + obj.centerOfMass.x, y + obj.centerOfMass.y);
    return obj;
  }
}
