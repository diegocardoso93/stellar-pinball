export type CollidedObject = {
  label: string,
  gameObject: Phaser.GameObjects.Sprite
}

export type GameObject = Phaser.Physics.Matter.Sprite;
export type Sound = Phaser.Sound.BaseSound;
export type KeyboardKey = Phaser.Input.Keyboard.Key;

export type ContractScores = [string, number[]];

export type PlayerScore = {
  acc: string,
  score: number
};
