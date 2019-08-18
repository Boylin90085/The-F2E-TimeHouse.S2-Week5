const gameOver = {
  key: 'gameOver',
  preload: function(){
    this.load.image('game_over', 'images/game_over.svg')
  },
  create: function(){
    this.gameOver = this.add.sprite(w / 2, h / 2, 'game_over')
    setTimeout(() => {
      this.scene.start('gameStart')
    }, 2000)
  },
  update: function(){
  }
}