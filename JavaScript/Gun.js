/*
class Gun{
  constructor(width,height,source,x,y)
  {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    img = new Image();
    img.src = source;
  }
  
  update() {
      myGameArea.context.drawImage(img,this.x,this.y,this.width,this.height);
  }

  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  shoot() {
      let bullet = new Component(11, 5, "red", this.x + 55, this.y + 30);
      bullet.newPos();
      bullet.speedX = 10;
      bullets.push( bullet );
  }
}
*/