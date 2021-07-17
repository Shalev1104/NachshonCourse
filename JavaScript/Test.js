const canvas = document.getElementById("canvas-id");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.75;
canvas.height = window.innerHeight * 0.75;
let countDown = 5;
let ai = true;
let aiInterval;
let preGameInterval;
let switcher = false;
const gun1 = new Gun(5, canvas.height / 2.5, 250, 156, 5, "#00ff00", true);
const gun2 = new Gun(canvas.width * 0.9, canvas.height / 2.5, 250, 156, 5, "#ff0000", false);
const gunWidth = 80;
const gunHeight = 80;
const FPS = 60;
const keyMap = [];
const gun1Sprite = new Image();
gun1Sprite.src = "Images/LeftGun.png";
const gun2Sprite = new Image();
gun2Sprite.src = "Images/RightGun.png";
const preGameSound = new Sound("soundeffects/PreGame.mp3");
const shotSound = new Sound("soundeffects/GunShot.mp3");
const deathSound = new Sound("soundeffects/Death.mp3");



window.addEventListener('keydown', (e)=>{
  keyMap[e.keyCode] = true;
  if(e.keyCode == 32) {   gun1.shooting = true;   }
  else if(e.keyCode == 13) {   gun2.shooting = true;   }
});
window.addEventListener('keyup', (e)=>{
  delete keyMap[e.keyCode];
  if(e.keyCode == 32) {   gun1.shooting = false;  }
  else if(e.keyCode == 13) {   gun2.shooting = false;  }
});

function changeGameMode(clickedId) 
{
    const text = "life amount";
    if(document.getElementById(clickedId).id == "ai-mode")
    {
        document.getElementById("visibillity").style.visibility = "hidden";
        ai = true;
        document.getElementById("left-id").innerHTML = "Choose " + text;
        document.getElementById("right-id").innerHTML = "Choose AI " + text;
    }
    else if(document.getElementById(clickedId).id == "2-players")
    {
        document.getElementById("visibillity").style.visibility = "visible";
        ai = false;
        document.getElementById("left-id").innerHTML = "Player 1 " + text;
        document.getElementById("right-id").innerHTML = "Player 2 " + text;
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
        canvas.style.display = "block";
        startAnimating(FPS);
        clearInterval(preGameInterval);
    }
    countDown--;
}

function isValid()
{
  gun1.hearts = document.getElementById("your-guns").value;
  gun2.hearts = document.getElementById("ai-guns").value;
  if(!isNaN(gun1.hearts) && !isNaN(gun2.hearts) && gun1.hearts != '' && gun2.hearts != '' && gun1.hearts > 0 && gun2.hearts > 0)
  {
      document.getElementById("startGame").style.visibility = "collapse";
      document.getElementById("left-id").style.visibility = "collapse";
      document.getElementById("right-id").style.visibility = "collapse";
      document.getElementById("your-guns").style.visibility = "collapse";
      document.getElementById("ai-guns").style.visibility = "collapse";
      document.getElementById("game-mode").style.visibility = "collapse";
      document.getElementById("left-hearts").style.visibility = "visible";
      document.getElementById("right-hearts").style.visibility = "visible";
      document.getElementById("leftAmount").innerHTML = gun1.hearts;
      document.getElementById("rightAmount").innerHTML = gun2.hearts;
      initialize();
  }
  else
  {
      alert("Select valid amount")
  }
}

function initialize()
{
    preGameInterval = setInterval(preGame, 1000);
    preGameSound.play();
    gun1.bullets = [];
    gun2.bullets = [];
}

function resetValues()
{
  gun1.outOfAmmo = false;
  gun2.outOfAmmo = false;
  gun1.shooting = false;
  gun2.shooting = false;
  gun1.frameX = 0;
  gun2.frameX = 0;
  gun1.deegres = 0;
  gun2.deegres = 0;
  gun1.x = 5;
  gun1.y = canvas.height / 2.5;
  gun2.x = canvas.width * 0.9;
  gun2.y = canvas.height / 2.5;
  gun1.bullets = [];
  gun2.bullets = [];
  document.getElementById("leftAmount").innerHTML = gun1.hearts;
  document.getElementById("rightAmount").innerHTML = gun2.hearts;
  for(let i = 0 ;i < keyMap.length; i++)
  {
    delete keyMap[i];
  }
}

function gameOver()
{
  resetValues();
  switcher = false;
  cancelAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.display = "none";

  if(ai)
  {
    if(gun2.hearts == 0)
    {
      document.getElementById("startGame").innerHTML = "Winner";
    }
    else if(gun1.hearts == 0)
    {
      document.getElementById("startGame").innerHTML = "Loser";
    }
  }
  else
  {
    if(gun2.hearts == 0)
    {
      document.getElementById("startGame").innerHTML = "Player 1 Win";
    }
    else if(gun1.hearts == 0)
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

let fpsInterval, startTime, now, then, elapsed;
function startAnimating(fps)
{
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate();
}
function animate()
{
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if(elapsed > fpsInterval)
    {
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(isSwitchSides(switcher))
        {
          switcher = !switcher;
          gun1.p1 = !gun1.p1;
          gun2.p1 = !gun2.p1;
        }
        gun1.drawSprite(gun1.width * gun1.frameX, 0,
                  gun1.width, gun1.height, gun1.x, gun1.y, gunWidth, gunHeight);
        gun2.drawSprite(gun2.width * gun2.frameX, 0,
                  gun2.width, gun2.height, gun2.x, gun2.y, gunWidth, gunHeight);
        gun1.functuality([32, 65, 87, 68, 83]);
        if(ai)
            aiMovement();
        else
            gun2.functuality([13, 37, 38, 39, 40]);
        gun1.handlePlayerFrame();
        gun2.handlePlayerFrame();
        gun1.bullets.forEach( (bullet)=> {
            bullet.x += bullet.speed;
            bullet.update();
        });
        gun2.bullets.forEach( (bullet)=> {
            bullet.x -= bullet.speed;
            bullet.update();
        });
        bulletsShots();
    }
}

function bulletsShots()
{
  for(let b1 of gun1.bullets)
  {
    if(gun2.isHit(b1))
    {
      deathSound.play();
      gun2.hearts--;
      if(gun2.hearts > 0)
      {
        if(ai)
        {
          alert("Round Win. " + gun2.hearts + " Hearts left");
        }
        else
        {
          alert("Player 1 Round Win. " + gun2.hearts + " Hearts left");
        }
        resetValues();
      }
      else
      {
        gameOver();
      }
      break;
    }
  }

  for(let b2 of gun2.bullets)
  {
    if(gun1.isHit(b2))
    {
      deathSound.play();
      gun1.hearts--;
      if(gun1.hearts > 0)
      {
        if(ai)
        {
          alert("Round Lose. " + gun1.hearts + " Hearts left");
        }
        else
        {
          alert("Player 2 Round Win. " + gun1.hearts + " Hearts left");
        }
        resetValues();
      }
      else
      {
        gameOver();
      }
      break;
    }
  }
}

function isSwitchSides(switcher)
{
    return (switcher ? gun1.x < gun2.x : gun1.x > gun2.x);
}

function aiMovement()
{
    // aiInterval = setInterval(function () 
    // {
    //     const rndMovementGen = Math.floor(Math.random() * 2);
    //     let aiVelocity;
    //     if(Math.floor(Math.random() * 2) == 0)
    //     {
    //         aiVelocity = 5;
    //     }
    //     else
    //     {
    //         aiVelocity = -5;
    //     }

    //     if(rndMovementGen == 0)
    //     {
    //         if(gun2.x + aiVelocity > 0 && gun2.x + aiVelocity < canvas.width - gunWidth) {
    //             gun2.x += aiVelocity;
    //         }
            
    //         else if(gun2.y + aiVelocity > 0 && gun2.y + aiVelocity < canvas.height - gunHeight) {
    //             gun2.y += aiVelocity;
    //         }
    //     }
    //     else
    //     {
    //         if(gun2.y + aiVelocity > 0 && gun2.y + aiVelocity < canvas.height - gunHeight) {
    //             gun2.x += aiVelocity;
    //         }
    //         else if(gun2.x + aiVelocity > 0 && gun2.x + aiVelocity < canvas.width - gunWidth) {
    //             gun2.y += aiVelocity;
    //         }
    //     }

    //     gun2.shoot(); 
    // },2000);
}
