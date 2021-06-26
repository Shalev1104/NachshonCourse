let leftBullets;
let rightBullets;
let gun1;
let gun2;
const preGameSound;
const shotSound;
const deathSound;
const canvasWidth = window.innerWidth * 0.7;
const canvasHeight = window.innerHeight * 0.7;
const borderGunWidth = 15;
const borderGunHeight = 34;
const FPS = 60;
let pc = true;
let velocity = 5;
let countDown;
let leftHearts;
let rightHearts;
let restartButton;
let gameInterval;
let aiInterval;
    
function changeGameMode(clickedId) 
      {
        const text = "Gun Amount";
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
        gun1 = new Gun(80,80,"images/YourGun.gif",canvasWidth * 0.1,canvasHeight / 2);
        gun2 = new Gun(80,80,"images/AiGun.gif",canvasWidth * 0.9,canvasHeight / 2);
        leftBullets = [];
        rightBullets = [];
      }
      let myGameArea = {
        canvas : document.createElement("canvas"),

        start : function() {
          this.canvas.width  = canvasWidth;
          this.canvas.height = canvasHeight;
          this.canvas.className = "game-block";
          this.canvas.id = "canvas-id"
          this.context = this.canvas.getContext('2d');
          this.pause = false;
          this.frameNo = 0;
          document.body.insertBefore(this.canvas, document.body.childNodes[4]);
          preGameSound.play();
          countDown = 5;
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
          clearInterval(gameInterval)
          clearInterval(aiInterval);
          this.pause = true;
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
          gameInterval = setInterval(updateGameArea, 20);
          aiInterval = setInterval(aiMovement,650); 
        }
        countDown--;
      }

      function restartRound() 
      {
        document.getElementById("leftAmount").innerHTML = leftHearts;
        document.getElementById("rightAmount").innerHTML = rightHearts;
        resetCoordinates();
        leftBullets = [];
        rightBullets = [];
        myGameArea.key = null;
      }

      function gameOver()
      {
        document.getElementById("leftAmount").innerHTML = leftHearts;
        document.getElementById("rightAmount").innerHTML = rightHearts;
        leftBullets = [];
        rightBullets = [];
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
        restartButton.innerHTML = "Restart";
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

      function bulletsShots()
      {
        leftBullets.forEach(left => {
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
          }
        });
        rightBullets.forEach(right => {
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
            switch(myGameArea.key)
            {
              case 13 : gun2.shoot(false); break;
              case 37 : gun2.speedX = -velocity; break;
              case 38 : gun2.speedY = -velocity; break;
              case 39 : gun2.speedX = velocity; break;
              case 40 : gun2.speedY = velocity;
            }
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
