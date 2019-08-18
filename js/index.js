const config = {
  type: Phaser.AUTO,
  parent: 'app',
  scene: [
    gameStart,
    gamePlay,
    gameOver
  ],
  scale: {
    parent: '#app',
    mode: Phaser.Scale.FIT,
    width: 1680,
    height: 1080,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
          y: 1500
      }
    },
  }
}

const game = new Phaser.Game(config);