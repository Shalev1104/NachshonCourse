let leftBullets;
let rightBullets;
let gun1;
let gun2;
let shotSound;
let deathSound;
let preGameSound;
let canvasWidth = window.innerWidth * 0.7;
let canvasHeight = window.innerHeight * 0.7;
let borderGunWidth = 15;
let borderGunHeight = 34;
let FPS = 60;
let pc = true;
let velocity = 5;
let countDown = 5;
    
function changeGameMode(clickedId) 
      {
        const text = "Gun Amount";
        leftBullets = [];
        rightBullets = [];
        if(document.getElementById(clickedId).id == "ai-mode")
        {
          document.getElementById("visibillity").style.visibility = "hidden";
          pc = true;
          resetCoordinates();
          document.getElementById("left-id").innerHTML = "Choose " + text;
          document.getElementById("right-id").innerHTML = "Choose AI " + text;
        }
        else if(document.getElementById(clickedId).id == "2-players")
        {
          document.getElementById("visibillity").style.visibility = "visible";
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
      function isValid()
      {
        if(!isNaN(document.getElementById("your-guns").value) != "" && !isNaN(document.getElementById("ai-guns").value))
        {
          document.getElementById("startGame").style.visibility = "collapse";
          Initialize();
        }
        else
        {
          alert("Select the number of weapons")
        }
      }

      function Initialize(){
        preGameSound = new Sound("soundeffects/PreGame.mp3");
        shotSound = new Sound("soundeffects/GunShot.mp3");
        deathSound = new Sound("soundeffects/Death.mp3");
        myGameArea.start();
        gun1 = new Gun(80,80,"images/YourGun.gif",10,250);
        gun2 = new Gun(80,80,"images/AiGun.gif",canvasWidth-100,250);
        leftBullets = [];
        rightBullets = [];
      }

      let myGameArea = {
        canvas : document.createElement("canvas"),

        start : function() {
          this.canvas.width  = canvasWidth;
          this.canvas.height = canvasHeight;
          this.canvas.className = "game-block";
          this.context = this.canvas.getContext('2d');
          document.body.insertBefore(this.canvas, document.body.childNodes[4]);
          preGameSound.play();
          this.interval = setInterval(preGame, 1000);
          window.addEventListener('keydown', function(e) {
              myGameArea.key = e.keyCode;
          })
          window.addEventListener('keyup', function(e) {
            myGameArea.key = false;
          })
        },
        clear: function() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop: function() {
          clearInterval(this.interval);
        }
      }

      function preGame()
      {
        if(countDown > 0)
        {
          document.getElementById("countDown").innerHTML = countDown;
          document.getElementById("countDown").style.visibility = "visible";
        }
        else if(countDown == 0)
        {
          document.getElementById("countDown").innerHTML = "GO!";
        }
        else
        {
          document.getElementById("countDown").style.visibility = "collapse";
          clearInterval(myGameArea.interval);
          myGameArea.interval = setInterval(updateGameArea, 20);
          myGameArea.interval += setInterval(aiMovement,750);
        }
        countDown--;
      }

      function restartGame() 
      {
        resetCoordinates();
        leftBullets = [];
        rightBullets = [];
        myGameArea.key = null;
      }

      function bulletsShots()
      {
        leftBullets.forEach(left => {
          if(isHit(left,gun2))
          {
            deathSound.play();
              if(pc)
              {
                alert("Winner Winner Chicken Dinner");
              }
              else
              {
                alert("Player 1 Win");
              }
              restartGame(); 
          }
        });
        rightBullets.forEach(right => {
          if(isHit(right,gun1))
          {
            deathSound.play();
              if(pc)
              {
                alert("Loser");
              }
              else
              {
                alert("Player 2 Win");
              }
              restartGame();
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
            case 32 : gun1.shoot(true); break;
            case 65 : gun1.speedX = -velocity; break;
            case 87 : gun1.speedY = -velocity; break;
            case 68 : gun1.speedX = velocity; break;
            case 83 : gun1.speedY = velocity;
          }
        }
        else if(pc)
        {
          alert("Loser");
          restartGame();
        }
        else
        {
          alert("Player 2 Win");
          restartGame();
        }
        
        if(!pc) 
        {
          gun2.speedX = 0;
          gun2.speedY = 0;
          if(isMoveable(gun2.width,gun2.height,gun2.x,gun2.y,velocity))
          {
            switch(myGameArea.key)
            {
              case 96 : gun2.shoot(false); break;
              case 37 : gun2.speedX = -velocity; break;
              case 38 : gun2.speedY = -velocity; break;
              case 39 : gun2.speedX = velocity; break;
              case 40 : gun2.speedY = velocity;
            }
          }
          else
          {
            alert("Player 1 Win");
            restartGame();
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
        bulletsShots();
      }

      function aiMovement()
      {
        if(pc) 
        {
          gun2.speedX = 0;
          gun2.speedY = 0;
          let rndMovementGen = Math.floor(Math.random() * 2);
          let aiVelocity;
          if(Math.floor(Math.random() * 2) == 0)
          {
            aiVelocity = velocity;
          }
          else
          {
            aiVelocity = -velocity;
          }

          if(isMoveable(gun2.width,gun2.height,gun2.x,gun2.y,velocity)) 
          {
            if(rndMovementGen == 0)
            {
              if(isMoveable(gun2.width,gun2.height,gun2.x + FPS * aiVelocity ,gun2.y,0)) {
                gun2.speedX = aiVelocity;
              }
              else if(isMoveable(gun2.width,gun2.height,gun2.x + FPS * -aiVelocity ,gun2.y,0)) {
                gun2.speedX = -aiVelocity;
              }
      
              else if(isMoveable(gun2.width,gun2.height,gun2.x,gun2.y + FPS * aiVelocity ,0)) {
                gun2.speedY = aiVelocity;
              }
              else if(isMoveable(gun2.width,gun2.height,gun2.x,gun2.y + FPS * -aiVelocity ,0)) {
                gun2.speedY = -aiVelocity;
              }
            }
            else
            {
              if(isMoveable(gun2.width,gun2.height,gun2.x,gun2.y + FPS * aiVelocity ,0)) {
                gun2.speedY = aiVelocity;
              }
              else if(isMoveable(gun2.width,gun2.height,gun2.x,gun2.y + FPS * -aiVelocity ,0)) {
                gun2.speedY = -aiVelocity;
              }
              else if(isMoveable(gun2.width,gun2.height,gun2.x + FPS * aiVelocity ,gun2.y,0)) {
                gun2.speedX = aiVelocity;
              }
              else if(isMoveable(gun2.width,gun2.height,gun2.x + FPS * -aiVelocity ,gun2.y,0)) {
                gun2.speedX = -aiVelocity;
              }
            }
          }
          else
          {
            alert("You Win");
            restartGame();
          }
          
          gun2.shoot(false); 
        }
      }

      function isMoveable(width,height,x,y,velocity) 
      {
        return (x - velocity >= -borderGunWidth && y - velocity >= -borderGunHeight && x + velocity <= canvasWidth - width + 25 && y + velocity <= canvasHeight - height + 10);
      }
      
      function Sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
          this.sound.play();
        }
        this.stop = function(){
          this.sound.pause();
          this.sound.currentTime = 0;
        }
        this.isPlaying = function(){
          return (this.sound.currentTime > 0 && !this.sound.paused);
        }
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
            let bullet = new Component(11, 5, "green", this.x + 55, this.y + 30);
            bullet.newPos();
            bullet.speedX = 10;
            leftBullets.push( bullet );
            if(shotSound.isPlaying())
            {
              shotSound.stop();
            }
            shotSound.play();
          }
          else
          {
              let bullet = new Component(11, 5, "red", this.x + 15, this.y + 30);
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
        myGameArea.context.fillStyle = this.color;
        myGameArea.context.fillRect(this.x, this.y, this.width, this.height);
      }
      this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
      }
    }
