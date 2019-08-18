const getRandom = (max, min) =>{
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const gamePlay = {
  key: 'gamePlay',
  preload: function(){
      this.load.image('bg_poor', 'images/bg/bg_poor.jpg')
      this.load.image('bg_rich', 'images/bg/bg_rich.jpg')
      this.load.image('1450', 'images/1450.svg')
      this.load.image('han_life_1', 'images/han_head.svg')
      this.load.image('han_life_2', 'images/han_head.svg')
      this.load.image('han_life_3', 'images/han_head.svg')
      this.load.image('coin_icon', 'images/coin_icon.svg')
      this.load.image('coin', 'images/coin.svg')
      this.load.image('coin_shining', 'images/coin_shining.svg')
      this.load.image('fa_da_tsai', 'images/fa_da_tsai.svg')
      this.load.image('finish_line', 'images/finish_line.svg')
      this.load.image('warning', 'images/warning.svg')
      this.load.image('restart', 'images/restart.png')
      this.load.image('tsai', 'images/tsai.svg')
      this.load.image('guo', 'images/guo.svg')
      this.load.image('mystery', 'images/mystery.svg')
      this.load.image('water', 'images/water.svg')
      this.load.image('hanten_mushroom', 'images/hanten_mushroom.svg')
      this.load.image('hanten_mushroom_shining', 'images/hanten_mushroom_shining.svg')
      this.load.spritesheet('han', 'images/han_frame.png', {frameWidth: 259, frameHeight: 305})
      
      this.coinNum = 0         // 金幣數量
      this.lifeNum = 3         // 生命數量
      this.timeStep = 90       // 時間

      this.baseSpeed = 4        // 基本速度
      this.netArmsSpeed = 6        // 基本速度
      this.tsaiSpeed = 12       // 老蔡速度
      this.guoSpeed = 20       // 老郭速度
      this.mysterySpeed = 20       // 神秘小幫手速度
      this.speedLv = 1         // 速率

      this.invincible = false   // 無敵

      this.coinArr = []       // 存放金幣

      this.gameWin = false
      this.gameOver = false
  },
  create: function(){
      // 加入物理效果
      const addPhysics = GameObject =>{
        this.physics.add.existing(GameObject);
        GameObject.body.immovable = true;
        GameObject.body.moves = false;
      }

      // 載入背景
      this.bg = this.add.tileSprite(w / 2, h / 2, w, h, 'bg_poor')

      // 載入生命
      this.hanLife1 = this.add.image(100, 70, 'han_life_1')
      this.hanLife2 = this.add.image(180, 70, 'han_life_2')
      this.hanLife3 = this.add.image(260, 70, 'han_life_3')

      // 設定金幣
      this.coinIcon = this.add.image(w - 250, 70, 'coin_icon')
      this.coinX = this.add.text(w - 200, 50, `X`, { color: '#000', fontSize: '40px', fontFamily: 'Roboto' })
      this.coinCount = this.add.text(w - 160, 32, `${this.coinNum}`, { color: '#000', fontSize: '70px', fontFamily: 'Roboto' })

      //設定人物位置
      this.player = this.add.sprite(350, 750, 'han')
      addPhysics(this.player)

      //設定角色顯示大小
      this.player.setScale(0.9)
      this.player.depth = 10

      // 加入動畫
      keyFrame(this)

      //播放動畫
      this.player.anims.play('run', true)

      // 1450的座標資訊
      const netArmyPos = [
        {name: '1450', x: w + 200, y: 630, w: 200, h: 318},
        {name: '1450', x: w + 200, y: 750, w: 200, h: 318},
        {name: '1450', x: w + 200, y: 870, w: 200, h: 318}
      ]

      // 敵人碰撞
      const enemyHit = (player, enemy) => {
        if (enemy.y - player.y <= 10 && enemy.y - player.y >= -10) {
          enemy.x = -150

          if (this.lifeNum > 0) {
            if (!this.invincible) {
              player.alpha = 0.5
              this.invincible = true
              this[`hanLife${this.lifeNum}`].alpha = 0
              this.lifeNum --

              // 撞到有無敵 0.5 秒
              setTimeout(() => {
                player.alpha = 1
                this.invincible = false
              }, 500)
            } else {
              this.invincible = false
              player.setScale(1)
            }
          } else {
            this.gameOver = true
            this.scene.start('gameOver')
          }
        }
      }

      // 產生1450
      for (let i = 0; i <= 2; i++) {
        this[`1450-${i}`] = this.add.sprite(netArmyPos[i].x, netArmyPos[i].y, netArmyPos[i].name)
        addPhysics(this[`1450-${i}`])
        this.physics.add.collider(this.player, this[`1450-${i}`], enemyHit)
      }

      // 老蔡的座標資訊
      this.tsaiPos = {name: 'tsai', x: w + 200, y: 630}
      
      // 產生老蔡
      this.tsai = this.add.sprite(this.tsaiPos.x, this.tsaiPos.y + (getRandom(0, 3) * 120), this.tsaiPos.name)
      this.tsai.depth = 5
      addPhysics(this.tsai)
      this.physics.add.collider(this.player, this.tsai, enemyHit)


      // 老郭的座標資訊
      this.guoPos = {name: 'guo', x: w + 200, y: 630}
      
      // 產生老郭
      this.guo = this.add.sprite(this.guoPos.x, this.guoPos.y + (getRandom(0, 3) * 120), this.guoPos.name)
      this.guo.depth = 5
      addPhysics(this.guo)
      this.physics.add.collider(this.player, this.guo, enemyHit)

      // 淹水的座標資訊
      this.waterPos = { name: 'water', x: w + 900, y: 850 }

      // 淹水碰撞
      const waterHit = (player, water) => {
        if (water.y - player.y <= 50 && water.y - player.y >= -50) {
          water.x = -900

          if (this.lifeNum > 0) {
            if (!this.invincible) {
              player.alpha = 0.5
              this.invincible = true
              this[`hanLife${this.lifeNum}`].alpha = 0
              this.lifeNum --

              // 撞到有無敵 0.5 秒
              setTimeout(() => {
                player.alpha = 1
                this.invincible = false
              }, 500)
            } else {
              this.invincible = false
              player.setScale(1)
            }
          } else {
            this.gameOver = true
            this.scene.start('gameOver')
          }
        }
      }

      // 產生淹水
      this.water = this.add.sprite(this.waterPos.x, this.waterPos.y + (getRandom(0, 3) * 120), this.waterPos.name)
      this.water.depth = 7
      addPhysics(this.water)
      this.physics.add.collider(this.player, this.water, enemyHit)

      // 神祕小幫手的座標資訊
      this.mysteryPos = {name: 'mystery', x: 100, y: -400}

      // 神祕小幫手之力
      const mysteryPower = (enemy, mystery) => {
        enemy.x = -150
      }

      // 產生神祕小幫手
      this.mystery = this.add.sprite(this.mysteryPos.x, this.mysteryPos.y + (getRandom(0, 3) * 120), this.mysteryPos.name)
      this.mystery.depth = 5
      addPhysics(this.mystery)
      for (let i = 0; i <= 2; i++) {
        this.physics.add.collider(this[`1450-${i}`], this.mystery, mysteryPower)
      }
      this.physics.add.collider(this.guo, this.mystery, mysteryPower)
      this.physics.add.collider(this.tsai, this.mystery, mysteryPower)
      this.physics.add.collider(this.water, this.mystery, mysteryPower)

      // 政治獻金的座標資訊
      const coinPos = { name: 'coin', x: w, y: 730, w: 86, h: 86 }

      // 吃到政治獻金
      const eatCoin = (player, coin) => {
        if (coin.y - player.y <= 150 && coin.y - player.y >= - 50) {
          coin.setTexture('coin_shining')
          if (!coin.ate) {
            this.coinNum ++
            this.coinCount.setText(`${this.coinNum}`)
          }
          coin.ate = true
          setTimeout(() => {
            coin.x = -100
          }, 100)
        }
      }

      // 產生政治獻金
      for (let i = 0; i < 10; i++) {
        const randomX = getRandom(-1, 10) * 200
        const randomY = getRandom(-1, 3) * 120

        this[`coin-${i}`] = this.add.sprite(coinPos.x + randomX, coinPos.y + randomY, coinPos.name)
        this.coinArr.push(this[`coin-${i}`])

        addPhysics(this[`coin-${i}`])
        this.physics.add.collider(this.player, this[`coin-${i}`], eatCoin)
      }

      // 中天菇的座標資訊
      this.hantenPos = { name: 'hanten_mushroom', x: w + 200, y: 730 }

      // 吃到中天菇
      const eatHanten = (player, hanten) => {
        if (hanten.y - player.y <= 150 && hanten.y - player.y >= - 50) {
          hanten.setTexture('hanten_mushroom_shining')
          if (!hanten.ate) {
            player.setScale(1.5)
            this.invincible = true
          }
          hanten.ate = true
          setTimeout(() => {
            hanten.x = -100
          }, 100)
        }
      }

      // 產生中天菇
      this.hanten = this.add.sprite(this.hantenPos.x, this.hantenPos.y + (getRandom(0, 3) * 120), this.hantenPos.name)
      addPhysics(this.hanten)
      this.physics.add.collider(this.player, this.hanten, eatHanten)

    
      // 時間倒數
      this.timeText = this.add.text(w / 2 - 139, 30, `TIME: ${this.timeStep}s`, { color: '#000', fontSize: '70px', fontFamily: 'Roboto' })
      const timer = setInterval(() => {
        if (this.timeStep <= 0 || this.gameOver) {
          clearInterval(timer)
        } else {
          this.timeStep--
          this.timeText.setText(`TIME: ${this.timeStep}s`)
        }
      }, 1000)

      // 碰到終點線
      const touchLine = (player, line) => {
        line.alpha = 0
      }

      // 設定終點      
      this.faDaTsai = this.add.sprite(w + 1200, 750, 'fa_da_tsai')
      this.finishLine = this.add.sprite(w + 300, 850, 'finish_line')
      addPhysics(this.finishLine)
      this.physics.add.collider(this.player, this.finishLine, touchLine)
  },
  update: function(){
    if (this.timeStep > 0) {
      this.bg.tilePositionX += this.baseSpeed * this.speedLv
    } else {
      if (!this.gameWin) {
        this.bg.setTexture('bg_rich')
        this.warning = this.add.image(w / 2, h / 2 - 210, 'warning')
        this.btnRestart = this.add.image(w / 2, h / 2 - 50, 'restart')
  
        this.btnRestart.setInteractive()
        this.btnRestart.on('pointerdown', () => {
          this.scene.start('gameStart')
        })

        this.gameWin = true
      }
    }

    if (this.timeStep >= 5) {
      // 政治獻金出場
      this.coinArr.forEach((money, i) => {
        money.x -= this.baseSpeed
      })

      // 1450出場
      this['1450-1'].x -= this.netArmsSpeed
      if (this.timeStep < 85) {
        this['1450-0'].x -= this.netArmsSpeed
      }
      if (this.timeStep < 80) {
        this['1450-2'].x -= this.netArmsSpeed
      }
      
      // 老蔡出場
      if (this.timeStep < 60) {
        this.tsai.x -= this.tsaiSpeed
      }

      // 老郭出場
      if (this.timeStep < 50) {
        this.guo.x -= this.guoSpeed
      }

      // 神秘小幫手出場
      if (this.timeStep < 40) {
        this.mystery.x += 2
        this.mystery.y += this.baseSpeed
      }

      // 中天菇出場
      if (this.timeStep < 55) {
        this.hanten.x -= this.baseSpeed
      }

      // 淹水出場
      if (this.timeStep < 30) {
        this.water.x -= this.baseSpeed
      }
    } else {
      this['1450-0'].x = -500
      this['1450-1'].x = -500
      this['1450-2'].x = -500
      this.tsai.x = -500
      this.guo.x = -500
      this.hanten.x = -500
      this.water.x = -500
    }
    // 終點出場
    if (this.timeStep < 9 && this.timeStep > 0) {
      this.faDaTsai.x -= this.baseSpeed
      this.finishLine.x -= this.baseSpeed
    }

    // 檢測1450是否超出邊界然後返回
    for (let i = 0; i <= 2; i++) {
      if(this[`1450-${i}`].x <= -100){
        this[`1450-${i}`].x = w + getRandom(1, 10) * 200;
      }
    }

    // 檢測老蔡是否超出邊界然後返回
    if(this.tsai.x <= -100){
      this.tsai.x = w + getRandom(1, 2) * 100
      this.tsai.y = this.tsaiPos.y + (getRandom(-1, 3) * 120)
    }

    // 檢測老郭是否超出邊界然後返回
    if(this.guo.x <= -100){
      this.guo.x = w + getRandom(1, 5) * 200
      this.guo.y = this.guoPos.y + (getRandom(-1, 3) * 120)
    }

    // 檢測中天菇是否超出邊界然後返回
    if(this.hanten.x <= -100){
      this.hanten.x = w + 100
      this.hanten.y = this.hantenPos.y + (getRandom(-1, 3) * 120)
      this.hanten.setTexture('hanten_mushroom')
      if (this.hanten.ate) {
        this.hanten.ate = false
      }
    }

    // 檢測金幣是否超出邊界然後返回
    for (let i = 0; i < this.coinArr.length; i++) {
      if(this.coinArr[i].x <= -100){
        this.coinArr[i].x = w + getRandom(1, 5) * 200;
        this.coinArr[i].setTexture('coin')
        if (this.coinArr[i].ate) {
          this.coinArr[i].ate = false
        }
      }
    }

    // 檢測淹水是否超出邊界然後返回
    if(this.water.x <= -100){
      this.water.x = w + getRandom(1, 2) * 900
      this.water.y = this.waterPos.y + (getRandom(-1, 1) * 120)
    }

    const keyboard = this.input.keyboard.createCursorKeys()

    if(keyboard.up.isDown){
        if (this.player.y > 630) {
            this.player.y -= 15
            this.player.anims.play('speed', true)
        }
    } else if (keyboard.down.isDown) {
        if (this.player.y < 870) {
            this.player.y += 15
            this.player.anims.play('speed', true)
        }
    } else {
        if (this.gameWin) {
          this.player.anims.play('win', true)
        } else if (this.timeStep <= 10 && this.timeStep > 0) {
          this.player.anims.play('speed', true)
        } else {
          this.player.anims.play('run', true)
        }
        
    }
  }
}