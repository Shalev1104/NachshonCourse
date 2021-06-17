let leftBullets = [];
let rightBullets = [];
let gun1;
let gun2;
let countPX =0;
let canvasWidth = window.innerWidth * 0.7;
let canvasHeight = window.innerHeight * 0.7;
let borderGunWidth = 15;
let borderGunHeight = 34;
let FPS = performance.now();
let pc = true;
let velocity = 5;
      
function changeGameMode(clickedId) 
      {
        const text = "Gun Amount";
        leftBullets = [];
        rightBullets = [];
        if(document.getElementById(clickedId).id == "ai-mode")
        {
          pc = true;
          resetCoordinates();
          document.getElementById("left-id").innerHTML = "Choose " + text;
          document.getElementById("right-id").innerHTML = "Choose AI " + text;
        }
        else if(document.getElementById(clickedId).id == "2-players")
        {
          gun2.speedY = 0;
          gun2.speedX = 0;
          resetCoordinates();
          pc = false;
          document.getElementById("left-id").innerHTML = "Player 1 " + text;
          document.getElementById("right-id").innerHTML = "Player 2 " + text;
        }
      }

      function resetCoordinates() 
      {
        gun1.x = 10;
        gun1.y = 250;
        gun2.x = canvasWidth - 100;
        gun2.y = 250;
      }
      function selected()
      {
        
      }

      function aiSelected()
      {
        
      }

      function Initialize(){
        myGameArea.start();
        gun1 = new Gun(80,80,"images/YourGun.gif",10,250);
        gun2 = new Gun(80,80,"images/AiGun.gif",canvasWidth-100,250);
      }

      let myGameArea = {
        canvas : document.createElement("canvas"),

        start : function() {
          this.canvas.width  = canvasWidth;
          this.canvas.height = canvasHeight;
          this.canvas.className = "game-block";
          this.context = this.canvas.getContext('2d');
          document.body.insertBefore(this.canvas, document.body.childNodes[4]);
          this.interval = setInterval(updateGameArea, 20);
          this.interval += setInterval(aiMovement,750);
          window.addEventListener('keydown', function(e) {
              myGameArea.key = e.keyCode;
          })
          window.addEventListener('keyup', function(e) {
            myGameArea.key = false;
          })
        },
        clear: function() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
      }

      function BulletsShots()
      {
        leftBullets.forEach(left => {
          if(isHit(left,gun2))
          {
            setTimeout(() => {
              if(pc)
              {
                alert("You Win");
              }
              else
              {
                alert("Player 1 Win");
              }
            },250);
          }
        });
        rightBullets.forEach(right => {
          if(isHit(right,gun1))
          {
            setTimeout(() => {
              if(pc)
              {
                alert("You Lose");
              }
              else
              {
                alert("Player 2 Win");
              }
            },250);
          }
        });
      }

      function isHit(bullet,gun) 
      {
        return (bullet.x >= gun.x + borderGunWidth && bullet.x <= gun.x + gun.width && bullet.y >= gun.y + borderGunHeight -10 && bullet.y <= gun.y + gun.height -6);
      }

      function updateGameArea() 
      {
        myGameArea.clear();
        gun1.speedX = 0;
        gun1.speedY = 0;

        if(isMoveable(gun1.width,gun1.height,gun1.x,gun1.y,velocity))
        {
          switch(myGameArea.key)
          {
            case 96 : gun1.shoot(true); break;
            case 37 : gun1.speedX = -velocity; break;
            case 38 : gun1.speedY = -velocity; break;
            case 39 : gun1.speedX = velocity; break;
            case 40 : gun1.speedY = velocity;
          }
        }
        else
        {
          alert("You Lose");
        }
        
        if(!pc) 
        {
          gun2.speedX = 0;
          gun2.speedY = 0;
          if(isMoveable(gun2.width,gun2.height,gun2.x,gun2.y,velocity))
          {
            switch(myGameArea.key)
            {
              case 32 : gun2.shoot(false); break;
              case 65 : gun2.speedX = -velocity; break;
              case 87 : gun2.speedY = -velocity; break;
              case 68 : gun2.speedX = velocity; break;
              case 83 : gun2.speedY = velocity;
            }
          }
          else
          {
            alert("Player 1 Win");
          }
        }

        
        gun1.newPos();
        gun1.update();
        gun2.newPos();
        gun2.update();
        leftBullets.forEach( (bullet)=> {
          bullet.newPos() 
          bullet.update();
        });
        rightBullets.forEach( (bullet)=> {
          bullet.newPos() 
          bullet.update();
        });
        BulletsShots();
      }

      function aiMovement()
      {
        if(pc) 
        {
          gun2.speedX = 0;
          gun2.speedY = 0;
  
          let rndNum = Math.floor(Math.random() * 2);
          let speed = (Math.floor(Math.random() * 11) - 5);

          if(isMoveable(gun2.width,gun2.height,gun2.x,gun2.y,velocity)) 
          {
            if(rndNum == 0 && isMoveable(gun2.width,gun2.height,gun2.x + FPS * speed ,gun2.y,velocity)) {
              gun2.speedX = speed;
            }
    
            else if(rndNum == 1 && isMoveable(gun2.width,gun2.height,gun2.x,gun2.y + FPS * speed ,velocity))           {
              gun2.speedY = speed;
            }
          }
          else
          {
            alert("You Win");
          }
          
          gun2.shoot(false); 
        }
      }

      function isMoveable(width,height,x,y,velocity) 
      {
        return (x - velocity >= -borderGunWidth && y - velocity >= -borderGunHeight && x + velocity <= canvasWidth - width + 25 && y + velocity <= canvasHeight - height + 10);
      }

      function Gun(width,height,source,x,y)
        {
          this.width = width;
          this.height = height;
          this.speedX = 0;
          this.speedY = 0;
          this.x = x;
          this.y = y;
          this.img = new Image();
          this.img.src = source;
        
        this.update = function() {
          myGameArea.context.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
      
        this.newPos = function() {
          this.x += this.speedX;
          this.y += this.speedY;
        }
      
        this.shoot = function(isP1) {
          if(isP1) 
          {
            let bullet = new Component(11, 5, "orange", this.x + 55, this.y + 30);
            bullet.newPos();
            bullet.speedX = 10;
            leftBullets.push( bullet );
          }
          else
          {
              let bullet = new Component(11, 5, "orange", this.x + 15, this.y + 30);
              bullet.newPos();
              bullet.speedX = -10;
              rightBullets.push( bullet );
          }
        }
      }
    
    function Component(width, height, color, x, y) {
      this.width = width;
      this.height = height;
      this.speedX = 0;
      this.speedY = 0;
      this.x = x;
      this.y = y;
      this.color = color;
      this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
      this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
      }
    }