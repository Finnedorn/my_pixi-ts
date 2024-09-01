import * as PIXI from 'pixi.js'

const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
  view: document.getElementById('game-canvas') as HTMLCanvasElement,
})

PIXI.Assets.load(['flowerTop.png'], () => {
  const myTexture = PIXI.Texture.from('flowerTop.png')

  const mySprite = new PIXI.Sprite(myTexture)
  mySprite.anchor.set(0.5)
  mySprite.x = app.screen.width / 2
  mySprite.y = app.screen.height / 2

  app.stage.addChild(mySprite)

  app.ticker.add((_delta) => {
    mySprite.rotation += 0.05
  })
})
