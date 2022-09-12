export type Attributes<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}

export default class Line {
  public x1!: bigint
  public y1!: bigint
  public x2!: bigint
  public y2!: bigint
  public ctx!: CanvasRenderingContext2D
  public obstacleColor!: string
  public velocity!: bigint
  public UPDATES_PER_SECOND = 60

  public constructor(line: Attributes<Line> & { UPDATE_PER_SECOND?: number }) {
    Object.assign(this, line)

    this.draw(this.x1, this.x2, this.y1, this.y2)
    setInterval(() => {
      this.update()
    }, this.UPDATES_PER_SECOND / 1000)
  }

  public update(): void {
    //Based on the velocity, move the line in the direction of the line

    //Check if the points are in are in the canvas
    const { width, height } = this.ctx.canvas
    if (
      this.x1 > 0 &&
      this.x1 < width &&
      this.x2 > 0 &&
      this.x2 < width &&
      this.y1 > 0 &&
      this.y1 < height &&
      this.y2 > 0 &&
      this.y2 < height
    ) {
      //Use the slope to change the end point of the line
      this.x2 += (this.x2 - this.x1) * this.velocity
      this.y2 += (this.y2 - this.y1) * this.velocity

      this.draw(this.x1, this.x2, this.y1, this.y2)

      this.x1 = this.x2 - 1n
      this.y1 = this.y2 - 1n

      console.log(this.x1, this.x2, this.y1, this.y2)
    } else {
      throw new Error('Line is out of bounds')
    }
  }

  public draw(x1: bigint, x2: bigint, y1: bigint, y2: bigint): void {
    //Implement Bresenham's Line Algorithm
    //https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm

    //Round every point to the nearest integer

    const dx = Math.abs(x2 - x1)
    const dy = Math.abs(y2 - y1)
    const sx = x1 < x2 ? 1 : -1
    const sy = y1 < y2 ? 1 : -1
    let err = dx - dy

    while (true) {
      this.plot(x1, y1, 1)

      if (x1 === x2 && y1 === y2) {
        break
      }

      const e2 = 2 * err
      if (e2 > -dy) {
        err -= dy
        x1 += sx
      }
      if (e2 < dx) {
        err += dx
        y1 += sy
      }
    }
  }

  public plot(x: bigint, y: bigint, opacity: number): void {
    this.ctx.fillStyle = 'rgba(255, 0, 0, ' + opacity + ')'
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
