import Line from './Line.js';
export default class Engine {
    ctx;
    obstacleColor = 'lightblue';
    constructor(ctx) {
        this.ctx = ctx;
        this.setCanvasBounds();
        new Line({
            x1: 50n,
            y1: 50n,
            x2: 60n,
            y2: 51n,
            ctx: this.ctx,
            obstacleColor: this.obstacleColor,
            velocity: 0.01,
        });
    }
    setCanvasBounds() {
        const { width, height } = this.ctx.canvas;
        this.ctx.fillStyle = this.obstacleColor;
        this.ctx.fillRect(0, 0, width, height);
        const offset = 1;
        this.ctx.fillStyle = '#272727';
        this.ctx.fillRect(0 + offset, 0 + offset, width - offset * 2, height - offset * 2);
    }
    getDataFromPixel(x, y) {
        const imageData = this.ctx.getImageData(x, y, 1, 1);
        const data = imageData.data;
        return data;
    }
}
