import { Color } from './Color.js'

export type Attributes<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}

export default class Line {
  public x1!: number
  public y1!: number
  public x2!: number
  public y2!: number
  public ctx!: CanvasRenderingContext2D
  public obstacleColor!: string
  public increment!: number
  public color!: Color
  public UPDATES_PER_SECOND = 30

  public constructor(
    line: Omit<Attributes<Line>, 'UPDATES_PER_SECOND'> & {
      UPDATES_PER_SECOND?: number
    }
  ) {
    Object.assign(this, line)

    this.draw(this.x1, this.x2, this.y1, this.y2)
    setInterval(() => {
      this.update()
    }, 1000 / this.UPDATES_PER_SECOND)
  }

  public update(): void {
    //Based on the velocity, move the line in the direction of the line

    //Check if the points are in are in the canvas
    const { width, height } = this.ctx.canvas

    if (this.x2 >= width || this.x2 <= 0) {
      const tmpX = this.x2
      const tmpY = this.y2

      this.x2 += (this.x2 - this.x1) * -1
      this.y2 += this.y2 - this.y1

      this.x1 = tmpX
      this.y1 = tmpY
    }

    if (this.y2 >= height || this.y2 <= 0) {
      const tmpX = this.x2
      const tmpY = this.y2

      this.x2 += this.x2 - this.x1
      this.y2 += (this.y2 - this.y1) * -1

      this.x1 = tmpX
      this.y1 = tmpY
    }

    //Use the slope to change the end point of the line
    this.x2 += this.x2 - this.x1
    this.y2 += this.y2 - this.y1

    this.getSlope('x')
    console.log(this.x2 - this.x1, this.y2 - this.y1)

    this.draw(this.x1, this.x2, this.y1, this.y2)

    //Get the center point of the line
    this.x1 = (this.x1 + this.x2) / 2
    this.y1 = (this.y1 + this.y2) / 2
  }

  public getSlope(XorY: string): number {
    let xLimit = this.y2 - this.y1
    let yLimit = 1 / (this.x2 - this.x1)

    let finalX = 1
    let finalY = 1

    //Based on the two limits, choose the one that's less than 1
    if (xLimit > 0 && yLimit > 0) {
      if (xLimit < yLimit) {
        finalY = yLimit
      } else {
        finalX = xLimit
      }
    }

    console.log({ finalX, finalY })

    if (XorY === 'x') return Math.round(finalX * this.increment * 10)

    if (XorY === 'y') return Math.round(finalY * this.increment * 10)

    throw new Error("XorY must be 'x' or 'y'")
  }

  public draw(x1: number, x2: number, y1: number, y2: number): void {
    //Implement Xiaolin Wu's line algorithm
    //https://en.wikipedia.org/wiki/Xiaolin_Wu%27s_line_algorithm

    const steep = Math.abs(y2 - y1) > Math.abs(x2 - x1)
    if (steep) {
      ;[x1, y1] = [y1, x1]
      ;[x2, y2] = [y2, x2]
    }

    if (x1 > x2) {
      ;[x1, x2] = [x2, x1]
      ;[y1, y2] = [y2, y1]
    }

    const dx = x2 - x1
    const dy = y2 - y1
    const gradient = dy / dx

    let xEnd = Math.round(x1)
    let yEnd = y1 + gradient * (xEnd - x1)
    let xGap = 1 - ((x1 + 0.5) % 1)
    let xpxl1 = xEnd
    let ypxl1 = Math.floor(yEnd)

    if (steep) {
      this.plot(ypxl1, xpxl1, 1 - (yEnd % 1) * xGap)
      this.plot(ypxl1 + 1, xpxl1, (yEnd % 1) * xGap)
    } else {
      this.plot(xpxl1, ypxl1, 1 - (yEnd % 1) * xGap)
      this.plot(xpxl1, ypxl1 + 1, (yEnd % 1) * xGap)
    }

    let intery = yEnd + gradient

    xEnd = Math.round(x2)
    yEnd = y2 + gradient * (xEnd - x2)
    xGap = (x2 + 0.5) % 1
    let xpxl2 = xEnd
    let ypxl2 = Math.floor(yEnd)

    if (steep) {
      this.plot(ypxl2, xpxl2, 1 - (yEnd % 1) * xGap)
      this.plot(ypxl2 + 1, xpxl2, (yEnd % 1) * xGap)
    } else {
      this.plot(xpxl2, ypxl2, 1 - (yEnd % 1) * xGap)
      this.plot(xpxl2, ypxl2 + 1, (yEnd % 1) * xGap)
    }

    if (steep) {
      for (let x = xpxl1 + 1; x <= xpxl2 - 1; x++) {
        this.plot(Math.floor(intery), x, 1 - (intery % 1))
        this.plot(Math.floor(intery) + 1, x, intery % 1)
        intery += gradient
      }
    } else {
      for (let x = xpxl1 + 1; x <= xpxl2 - 1; x++) {
        this.plot(x, Math.floor(intery), 1 - (intery % 1))
        this.plot(x, Math.floor(intery) + 1, intery % 1)
        intery += gradient
      }
    }
  }

  public plot(x: number, y: number, opacity: number): void {
    this.ctx.fillStyle = `rgba(${this.color.R}, ${this.color.G}, ${this.color.B}, ${opacity})`
    this.ctx
    this.ctx.fillRect(x, y, 1, 1)
  }

  public removeLine(): void {
    const { width, height } = this.ctx.canvas
    const imageData = this.ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 173 && data[i + 1] !== 216 && data[i + 2] !== 230) {
        data[i] = 39
        data[i + 1] = 39
        data[i + 2] = 39
        data[i + 3] = 255
      }
    }

    this.ctx.putImageData(imageData, 0, 0)
  }
}
