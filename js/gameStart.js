let bgmPlayed = false

const gameStart = {
  key: 'gameStart',
  preload: function(){
    this.load.audio('bgm', ['./bgm/【音MAD】發Daaaaaaaaaaaa財.mp3'])

    this.load.image('bg_poor', 'images/bg/bg_poor.jpg')
    this.load.image('bg_rich', 'images/bg/bg_rich.jpg')
    this.load.image('logo', 'images/logo.png')
    this.load.image('han_life_1', 'images/han_head.svg')
    this.load.image('han_life_2', 'images/han_head.svg')
    this.load.image('han_life_3', 'images/han_head.svg')
    this.load.image('coin_icon', 'images/coin_icon.svg')
    this.load.image('btn_start', 'images/start.png')
    this.load.image('btn_up', 'images/btn_up.svg')
    this.load.image('btn_down', 'images/btn_down.svg')
    this.load.spritesheet('han', 'images/han_frame.png', {frameWidth: 258, frameHeight: 305})

    this.timeInit = 90
    this.gameStop = false
  },
  create: function(){

    if (!bgmPlayed) {
      this.bgm = this.sound.add('bgm')
      this.bgm.play()
      this.bgm.setLoop(true)
      bgmPlayed = true
    }

    this.bg = this.add.tileSprite(840, 540, 1680, 1080, 'bg_poor')

    // 載入生命
    this.hanLife1 = this.add.image(100, 70, 'han_life_1')
    this.hanLife2 = this.add.image(180, 70, 'han_life_2')
    this.hanLife3 = this.add.image(260, 70, 'han_life_3')

    this.logo = this.add.image(w / 2 + 290, h / 2 - 100, 'logo')
    this.btnStart = this.add.image(w / 2 + 320, h / 2 + 180, 'btn_start')
    this.btnUp = this.add.image(w / 2 + 250, h / 2 + 310, 'btn_up')
    this.btnDown = this.add.image(w / 2 + 400, h / 2 + 310, 'btn_down')

    this.btnStart.setInteractive()
    this.btnStart.on('pointerdown', () => {
      this.scene.start('gamePlay')
    })

    // 設定時間文字
    this.timeText = this.add.text(w / 2 - 139, 30, `TIME: ${this.timeInit}s`, { color: '#000', fontSize: '70px', fontFamily: 'Roboto' })

    // 設定金幣
    this.coinIcon = this.add.image(w - 250, 70, 'coin_icon')
    this.coinX = this.add.text(w - 200, 50, `X`, { color: '#000', fontSize: '40px', fontFamily: 'Roboto' })
    this.coinCount = this.add.text(w - 160, 32, `0`, { color: '#000', fontSize: '70px', fontFamily: 'Roboto' })

    // //設定人物位置
    this.hanInStart = this.add.sprite(350, 750, 'han')

    // //設定角色顯示大小
    this.hanInStart.setScale(0.9)

    // 加入動畫
    keyFrame(this)

    //播放動畫
    this.hanInStart.anims.play('run', true)
  },
  update: function(){
    this.bg.tilePositionX += 4
  }
}