class Bar {
  constructor(length, x, y, w, h, color) {
    this.length = length;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }
  showBar(percent) {
    push();
    this.blockW = this.w / this.length;
    for (let i = 0; i < this.length; i++) {
      if (i < percent) {
        fill(this.color);
      } else {
        fill("white");
      }
      noStroke()
      rect(this.x + i * this.blockW, this.y, this.blockW, this.h);
    }
    pop();
  }
}