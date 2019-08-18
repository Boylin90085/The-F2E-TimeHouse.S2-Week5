const w = 1680
const h = 1080

const keyFrame = (self) => {
  //設定動畫播放
  self.anims.create({
    key: 'run',
    frames: self.anims.generateFrameNumbers('han', { start: 0, end: 1 }),
    frameRate: 4,
    repeat: -1
  })
  self.anims.create({
    key: 'speed',
    frames: self.anims.generateFrameNumbers('han', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  })
  self.anims.create({
    key: 'win',
    frames: self.anims.generateFrameNumbers('han', { start: 2, end: 2 }),
    frameRate: 1,
    repeat: -1
  })
}