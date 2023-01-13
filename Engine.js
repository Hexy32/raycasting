import Line from './Line.js';
export default class Engine {
    ctx;
    obstacleColor = 'lightblue';
    constructor(ctx) {
        this.ctx = ctx;
        for (let x = 0; x < 10; x++) {
            new Line({
                x1: Math.round(Math.random() * 1000),
                y1: Math.round(Math.random() * 500),
                x2: Math.round(Math.random() * 1000),
                y2: Math.round(Math.random() * 500),
                ctx: this.ctx,
                obstacleColor: this.obstacleColor,
                increment: 1,
                color: {
                    R: Math.random() * 255,
                    G: Math.random() * 255,
                    B: Math.random() * 255,
                },
            });
        }
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
