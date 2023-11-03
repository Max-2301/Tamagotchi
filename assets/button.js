
class Button {
  constructor(name, x, y, funct) {
    this.name = name;
    this.x = x;
    this.y = y; 
    this.funct = funct;
    this.setup();
    this.button;
    this.show = true;
  }
  setup() {
    let w = 80;
    let h = 50;
    this.button = createButton(this.name);
    this.button.position(this.x -w/2, this.y - h/2);
    this.button.size(w,h)
    this.button.mouseClicked(this.funct);
  }
  hiddenOrShown(){
    if (this.show){
      this.button.hide();
    } else {
      this.button.show();
    }
    this.show =! this.show;
  }
}
