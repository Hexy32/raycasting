import Engine from './Engine.js'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
/*

ctx.lineWidth = 5
ctx.strokeStyle = 'wheat'

ctx.beginPath()
ctx.moveTo(100, 100)
ctx.lineTo(300, 100)
ctx.stroke()

ctx.lineWidth = 3

ctx.beginPath()
ctx.moveTo(300, 40)
ctx.lineTo(200, 500)
ctx.stroke()
 */

const engine = new Engine(ctx)
