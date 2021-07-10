let leftBullets;
let rightBullets;
let gun1;
let gun2;
let preGameSound;
let shotSound;
let deathSound;
const canvasWidth = window.innerWidth * 0.75;
const canvasHeight = window.innerHeight * 0.75;
const widthToGun = 15;
const heightToGun = 25;
const gunBarrelWidth = 45;
const gunBarrelHeight = 13;
const gunCartridgeWidth = 14;
const gunCartridgeHeight = 37;
const FPS = 60;
const milliseconds = 5;
const radius = 50;
const velocity = 5;
let pc = true;
let countDown;
let leftHearts;
let rightHearts;
let restartButton;
let gameInterval;
let aiInterval;
let outOfAmmo1 = false;
let outOfAmmo2 = false;
let circleAnimation1;
let circleAnimation2;
let switcher = false;
const leftGif = GIF();
leftGif.load("https://i.imgur.com/jQVFyC1.gif");
const rightGIF = GIF();
rightGIF.load("https://i.imgur.com/eY9Q0Vw.gif");

function changeGameMode(clickedId) 
      {
        const text = "life amount";
        leftBullets = [];
        rightBullets = [];
        if(document.getElementById(clickedId).id == "ai-mode")
        {
          document.getElementById("visibillity").style.visibility = "hidden";
          pc = true;
          document.getElementById("left-id").innerHTML = "Choose " + text;
          document.getElementById("right-id").innerHTML = "Choose AI " + text;
        }
        else if(document.getElementById(clickedId).id == "2-players")
        {
          document.getElementById("visibillity").style.visibility = "visible";
          pc = false;
          document.getElementById("left-id").innerHTML = "Player 1 " + text;
          document.getElementById("right-id").innerHTML = "Player 2 " + text;
        }
      }

      function resetCoordinates() 
      {
        gun1.x = canvasWidth * 0.1;
        gun1.y = canvasHeight / 2;
        gun2.x = canvasWidth * 0.9;
        gun2.y = canvasHeight / 2;
      }
      function isValid()
      {
        leftHearts = document.getElementById("your-guns").value;
        rightHearts = document.getElementById("ai-guns").value;
        if(!isNaN(leftHearts) && !isNaN(rightHearts) && leftHearts != '' && rightHearts != '' && leftHearts > 0 && rightHearts > 0)
        {
          document.getElementById("startGame").style.visibility = "collapse";
          document.getElementById("left-id").style.visibility = "collapse";
          document.getElementById("right-id").style.visibility = "collapse";
          document.getElementById("your-guns").style.visibility = "collapse";
          document.getElementById("ai-guns").style.visibility = "collapse";
          document.getElementById("game-mode").style.visibility = "collapse";
          document.getElementById("left-hearts").style.visibility = "visible";
          document.getElementById("right-hearts").style.visibility = "visible";
          document.getElementById("leftAmount").innerHTML = leftHearts;
          document.getElementById("rightAmount").innerHTML = rightHearts;
          Initialize();
        }
        else
        {
          alert("Select valid amount")
        }
      }

      function Initialize()
      {
        preGameSound = new Sound("soundeffects/PreGame.mp3");
        shotSound = new Sound("soundeffects/GunShot.mp3");
        deathSound = new Sound("soundeffects/Death.mp3");
        myGameArea.start();
        gun1 = new Gun(80,80,true,canvasWidth * 0.1,canvasHeight / 2,"#00FF00");
        gun2 = new Gun(80,80,false,canvasWidth * 0.9,canvasHeight / 2,"#FF0000");
        leftBullets = [];
        rightBullets = [];
      }
      let myGameArea = {
        canvas : document.createElement("canvas"),

        start : function() {
          this.canvas.width  = canvasWidth;
          this.canvas.height = canvasHeight;
          this.canvas.className = "game-block";
          this.canvas.id = "canvas-id";
          this.context = this.canvas.getContext('2d');
          this.pause = false;
          document.body.insertBefore(this.canvas, document.body.childNodes[4]);
          preGameSound.play();
          countDown = 5;
          this.keyMap = [];
          this.interval = setInterval(preGame, 1000);
          
          window.addEventListener('keydown', (e)=>{
            if(!this.keyMap.includes(e.keyCode)){
                this.keyMap.push(e.keyCode);
            }
          })
        
          window.addEventListener('keyup', (e)=>{
              if(this.keyMap.includes(e.keyCode)){
                  this.keyMap.splice(this.keyMap.indexOf(e.keyCode), 1);
              }
          })
        },
        clear: function() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop: function() {
          clearInterval(gameInterval)
          clearInterval(aiInterval);
          this.pause = true;
        }
      }

      function key(x){
        return (myGameArea.keyMap.includes(x));
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
          gameInterval = setInterval(updateGameArea, 20);
          aiInterval = setInterval(aiMovement,650); 
        }
        countDown--;
      }

      function restartRound() 
      {
        resetValues();
        resetCoordinates();
      }

      function resetValues()
      {
        clearInterval(circleAnimation1);
        clearInterval(circleAnimation2);
        outOfAmmo1 = false;
        outOfAmmo2 = false;
        document.getElementById("leftAmount").innerHTML = leftHearts;
        document.getElementById("rightAmount").innerHTML = rightHearts;
        leftBullets = [];
        rightBullets = [];
        myGameArea.keyMap = [];
      }

      function gameOver()
      {
        const checker = document.getElementById("canvas-id");
        if (typeof(checker) != 'undefined' && checker != null)
        {
          resetValues();
          switcher = false;
          myGameArea.stop();
          myGameArea.clear();
          document.getElementById("canvas-id").remove();

          if(pc)
          {
            if(rightHearts == 0)
            {
              document.getElementById("startGame").innerHTML = "Winner";
            }
            else if(leftHearts == 0)
            {
              document.getElementById("startGame").innerHTML = "Loser";
            }
          }
          else
          {
            if(rightHearts == 0)
            {
              document.getElementById("startGame").innerHTML = "Player 1 Win";
            }
            else if(leftHearts == 0)
            {
              document.getElementById("startGame").innerHTML = "Player 2 Win";
            }
          }
          document.getElementById("startGame").disabled = true;
          document.getElementById("startGame").style.visibility = "visible";
          restartButton = document.createElement("button");
          restartButton.innerHTML = "RESTART";
          document.body.insertBefore(restartButton, document.body.childNodes[4]);
          restartButton.style.display = "block";
          restartButton.style.margin = "0 auto";
          restartButton.style.fontSize = "25px";
          restartButton.onclick = () =>
          {
            document.getElementById("startGame").innerHTML = "Start Game";
            document.getElementById("startGame").disabled = false;
            document.getElementById("startGame").style.visibility = "visible";
            document.getElementById("left-id").style.visibility = "visible";
            document.getElementById("right-id").style.visibility = "visible";
            document.getElementById("your-guns").style.visibility = "visible";
            document.getElementById("ai-guns").style.visibility = "visible";
            document.getElementById("game-mode").style.visibility = "visible";
            document.getElementById("left-hearts").style.visibility = "collapse";
            document.getElementById("right-hearts").style.visibility = "collapse";
            restartButton.remove();
          }
        }
      }

      function bulletsShots()
      {
        for(let left of leftBullets)
        {
          if(isHit(left,gun2))
          {
            deathSound.play();
            rightHearts--;
            if(rightHearts > 0)
            {
              if(pc)
              {
                alert("Round Win. " + rightHearts + " Hearts left");
              }
              else
              {
                alert("Player 1 Round Win. " + rightHearts + " Hearts left");
              }
              restartRound();
            }
            else
            {
              gameOver();
            }
            break;
          }
        }

        for(let right of rightBullets)
        {
          if(isHit(right,gun1))
          {
            deathSound.play();
            leftHearts--;
            if(leftHearts > 0)
            {
              if(pc)
              {
                alert("Round Lose. " + leftHearts + " Hearts left");
              }
              else
              {
                alert("Player 2 Round Win. " + leftHearts + " Hearts left");
              }
              restartRound();
            }
            else
            {
              gameOver();
            }
            break;
          }
        }
      }

      function isHit(bullet,gun) 
      {
        return (cartridgeHit(bullet,gun) || barrelHit(bullet,gun));
      }

      function cartridgeHit(bullet,gun)
      {
        if(gun.isLeft)
          return (bullet.x >= gun.x + widthToGun && bullet.x <= gun.x + widthToGun + gunCartridgeWidth && bullet.y >= gun.y + heightToGun + gunBarrelHeight && bullet.y <= gun.y + heightToGun + gunBarrelHeight + gunCartridgeHeight);
        return (bullet.x >= gun.x + gun.width - widthToGun - gunCartridgeWidth && bullet.x <= gun.x + gun.width - widthToGun && bullet.y >= gun.y + heightToGun + gunBarrelHeight && bullet.y <= gun.y + heightToGun + gunBarrelHeight + gunCartridgeHeight);
      }

      function barrelHit(bullet,gun)
      {
        if(gun.isLeft)
          return (bullet.x >= gun.x + widthToGun && bullet.x <= gun.x + widthToGun + gunBarrelWidth && bullet.y >= gun.y + heightToGun && bullet.y <= gun.y + heightToGun + gunBarrelHeight);
        return (bullet.x >= gun.x + gun.width - widthToGun - gunBarrelWidth && bullet.x <= gun.x + gun.width - widthToGun && bullet.y >= gun.y + heightToGun && bullet.y <= gun.y + heightToGun + gunBarrelHeight);
      }

      function isSwitchSides(switcher)
      {
        return (switcher ? gun1.x < gun2.x : gun1.x > gun2.x);
      }

      function updateGameArea() 
      {
        myGameArea.clear();
        gun1.speedX = 0;
        gun1.speedY = 0;

        if(isSwitchSides(switcher))
        {
          switcher = !switcher;
          gun1.isLeft = !gun1.isLeft;
          gun2.isLeft = !gun2.isLeft;
          gun1.update();
          gun2.update();
        }

        if(isMoveable(gun1.width,gun1.height,gun1.x,gun1.y,velocity))
        {
          if(key(32)) { gun1.shoot();             }
          if(key(65)) { gun1.speedX = -velocity;  }
          if(key(87)) { gun1.speedY = -velocity;  }
          if(key(68)) { gun1.speedX = velocity;   }
          if(key(83)) { gun1.speedY = velocity;   }
        }
        else if(pc)
        {
          leftHearts--;
          if(leftHearts > 0)
          {
            alert("Round Lose-Out of bounds. " + leftHearts + " Hearts left");
            restartRound();
          }
          else
          {
            gameOver();
          }
        }
        else
        {
          leftHearts--;
          if(leftHearts > 0)
          {
            alert("Player 1 Round Lose-Out of bounds. " + leftHearts + " Hearts left");
            restartRound();
          }
          else
          {
            gameOver();
          }
        }
        
        if(!pc) 
        {
          gun2.speedX = 0;
          gun2.speedY = 0;
          if(isMoveable(gun2.width,gun2.height,gun2.x,gun2.y,velocity))
          {
            if(key(13)) { gun2.shoot();             }
            if(key(37)) { gun2.speedX = -velocity;  }
            if(key(38)) { gun2.speedY = -velocity;  }
            if(key(39)) { gun2.speedX = velocity;   }
            if(key(40)) { gun2.speedY = velocity;   }
          }
          else
          {
            rightHearts--;
            if(rightHearts > 0)
            {
              alert("Player 2 Round Lose-Out of bounds. " + rightHearts + " Hearts left");
              restartRound();
            }
            else
            {
              gameOver();
            }
          }
        }

        
        gun1.newPos();
        gun1.update();
        gun2.newPos();
        gun2.update();
        leftBullets.forEach( (bullet)=> {
          bullet.newPos(); 
          bullet.update();
        });
        rightBullets.forEach( (bullet)=> {
          bullet.newPos();
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
            aiVelocity = Math.floor(Math.random() * 2) + 3;
          }
          else
          {
            aiVelocity = Math.floor(Math.random() * 2) + -3;
          }

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
          
          gun2.shoot(); 
        }
      }

      function isMoveable(width,height,x,y,velocity) 
      {
        return (x - velocity >= -widthToGun && y - velocity >= -heightToGun && x + velocity <= canvasWidth - width + 25 && y + velocity <= canvasHeight - height + 10);
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

      function Gun(width,height,isLeft,x,y,color)
        {
          this.width = width;
          this.height = height;
          this.speedX = 0;
          this.speedY = 0;
          this.x = x;
          this.y = y;
          this.isLeft = isLeft;
          this.color = color;


        this.update = function() {
          if(this.isLeft)
          {
            myGameArea.context.drawImage(leftGif.frames[0].image,this.x,this.y,this.width,this.height);
          }
          else
          {
            myGameArea.context.drawImage(rightGIF.frames[0].image,this.x,this.y,this.width,this.height);
          }
        }
      
        this.newPos = function() {
          this.x += this.speedX;
          this.y += this.speedY;
        }
      
        this.shoot = function() {
          if(this.isLeft)
          {
            if(!switcher && !outOfAmmo1)
            {
              myGameArea.context.drawImage(leftGif.image,this.x,this.y,this.width,this.height);
              leftBullets.push(drawLeftBullet(this.color,this.x,this.y));
              if(shotSound.isPlaying()) { shotSound.stop(); }
              shotSound.play();
              if(leftBullets.length % 20 == 0) 
              {
                outOfAmmo1 = true;
                leftReload(2, 7, this.color);
              } 
            }
            else if(switcher && !outOfAmmo2)
            {
              myGameArea.context.drawImage(leftGif.image,this.x,this.y,this.width,this.height);
              rightBullets.push(drawLeftBullet(this.color,this.x,this.y));
              if(!pc && rightBullets.length % 20 == 0) 
              {
                outOfAmmo2 = true;
                rightReload(2, 7, this.color);
              } 
            }
          }
          else
          {
            if(switcher && !outOfAmmo1)
            {
              myGameArea.context.drawImage(rightGIF.image,this.x,this.y,this.width,this.height);
              leftBullets.push(drawrightBullet(this.color,this.x,this.y));
              if(shotSound.isPlaying()) { shotSound.stop(); }
              shotSound.play();
              if(leftBullets.length % 20 == 0) 
              {
                outOfAmmo1 = true;
                leftReload(1, 0, this.color);
              }
            }
            else if(!switcher && !outOfAmmo2)
            {
              myGameArea.context.drawImage(rightGIF.image,this.x,this.y,this.width,this.height);
              rightBullets.push(drawrightBullet(this.color,this.x,this.y));
              if(!pc && rightBullets.length % 20 == 0)
              {
                outOfAmmo2 = true;
                rightReload(1, 0, this.color);
              }
            }
          }
        }
      }

      function drawLeftBullet(color,x,y)
      {
        const bullet = new Component(11, 5, color, x + 55, y + 30);
        bullet.newPos();
        bullet.speedX = 10;
        return bullet;
      }

      function drawrightBullet(color,x,y)
      {
        const bullet = new Component(11, 5, color, x + 15, y + 30);
        bullet.newPos();
        bullet.speedX = -10;
        return bullet;
      }

      function leftReload(a, b, color)
      {
        let deegres = 0;
        myGameArea.context.clearRect(gun1.x + (widthToGun * 3)/a + b - radius - 1, gun1.y + heightToGun * 2 - radius - 1, radius * 2 + 2, radius * 2 + 2);
        circleAnimation1 = setInterval(() =>
        {
          deegres += 1;

          myGameArea.context.beginPath();
          myGameArea.context.arc(gun1.x + (widthToGun * 3)/a + b, gun1.y + heightToGun * 2, radius, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
          myGameArea.context.strokeStyle = '#b1b1b1';
          myGameArea.context.stroke();

          myGameArea.context.beginPath();
          myGameArea.context.strokeStyle = color;
          myGameArea.context.arc(gun1.x + (widthToGun * 3)/a + b, gun1.y + heightToGun * 2, 50, (Math.PI/180) * 270, (Math.PI/180) * (270 + deegres) );
          myGameArea.context.stroke();


          if(deegres >= 360)
          {
            clearInterval(circleAnimation1);
            outOfAmmo1 = false;
          } 
        },milliseconds);
      }

      function rightReload(a, b, color)
      {
        let deegres = 0;
        myGameArea.context.clearRect(gun2.x + (widthToGun * 3)/a + b - radius - 1, gun2.y + heightToGun * 2 - radius - 1, radius * 2 + 2, radius * 2 + 2);
        circleAnimation2 = setInterval(() =>
        {
          deegres += 1;

          myGameArea.context.beginPath();
          myGameArea.context.arc(gun2.x + (widthToGun * 3)/a + b, gun2.y + heightToGun * 2, radius, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
          myGameArea.context.strokeStyle = '#b1b1b1';
          myGameArea.context.stroke();

          myGameArea.context.beginPath();
          myGameArea.context.strokeStyle = color;
          myGameArea.context.arc(gun2.x + (widthToGun * 3)/a + b, gun2.y + heightToGun * 2, 50, (Math.PI/180) * 270, (Math.PI/180) * (270 + deegres) );
          myGameArea.context.stroke();


          if(deegres >= 360)
          {
            clearInterval(circleAnimation2);
            outOfAmmo2 = false;
          } 
        },milliseconds);
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
