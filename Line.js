export default class Line {
    x1;
    y1;
    x2;
    y2;
    ctx;
    obstacleColor;
    velocity;
    UPDATES_PER_SECOND = 60;
    constructor(line) {
        Object.assign(this, line);
        this.draw(this.x1, this.x2, this.y1, this.y2);
        setInterval(() => {
            this.update();
        }, this.UPDATES_PER_SECOND / 1000);
    }
    update() {
        const { width, height } = this.ctx.canvas;
        if (this.x1 > 0 &&
            this.x1 < width &&
            this.x2 > 0 &&
            this.x2 < width &&
            this.y1 > 0 &&
            this.y1 < height &&
            this.y2 > 0 &&
            this.y2 < height) {
            this.x2 += (this.x2 - this.x1) * this.velocity;
            this.y2 += (this.y2 - this.y1) * this.velocity;
            this.draw(this.x1, this.x2, this.y1, this.y2);
            this.x1 = this.x2 - 1n;
            this.y1 = this.y2 - 1n;
            console.log(this.x1, this.x2, this.y1, this.y2);
        }
        else {
            throw new Error('Line is out of bounds');
        }
    }
    draw(x1, x2, y1, y2) {
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
        while (true) {
            this.plot(x1, y1, 1);
            if (x1 === x2 && y1 === y2) {
                break;
            }
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
    }
    plot(x, y, opacity) {
        this.ctx.fillStyle = 'rgba(255, 0, 0, ' + opacity + ')';
        this.ctx;
        this.ctx.fillRect(x, y, 1, 1);
    }
    removeLine() {
        const { width, height } = this.ctx.canvas;
        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] !== 173 && data[i + 1] !== 216 && data[i + 2] !== 230) {
                data[i] = 39;
                data[i + 1] = 39;
                data[i + 2] = 39;
                data[i + 3] = 255;
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    }
}
