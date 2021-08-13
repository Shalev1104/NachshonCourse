const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.75;
canvas.height = window.innerHeight * 0.75;
let countDown = 5;
let ai = true;
let paused = false;
let aiCounter = 0;
let gameAnimation;
let preGameInterval;
let switcher = false;
const gun1 = new Gun(5, canvas.height / 2.5, 250, 156, 5, 25, "#00ff00");
const gun2 = new Gun(canvas.width * 0.9, canvas.height / 2.5, 250, 156, 5, 25, "#ff0000");
const defaultHearts = new Array();
const FPS = 60;
const keyMap = [];
const gun1Sprite = new Image();
gun1Sprite.src = "Images/LeftGun.png";
const gun2Sprite = new Image();
gun2Sprite.src = "Images/RightGun.png";
const preGameSound = new Sound("soundeffects/PreGame.mp3");
const shotSound = new Sound("soundeffects/GunShot.mp3");
const deathSound = new Sound("soundeffects/Death.mp3");

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
        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        startAnimating(FPS);
        clearInterval(preGameInterval);
    }
    countDown--;
}

function isValid()
{
  gun1.hearts = document.getElementById("your-guns").value;
  gun2.hearts = document.getElementById("ai-guns").value;
  defaultHearts[0] = gun1.hearts;
  defaultHearts[1] = gun2.hearts;
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

function down(e)
{
  keyMap[e.keyCode] = true;
  if(e.keyCode == 32 && !paused)             {   gun1.shooting = true;   }
  else if(e.keyCode == 13 && !paused && !ai) {   gun2.shooting = true;   }
  else if(e.keyCode == 27)                   {   togglePause();          }
}
function up(e)
{
  delete keyMap[e.keyCode];

  if(paused)
  {
    const buttons = document.querySelectorAll('.pause button');
    let index;
    buttons.forEach((element, i) => 
    {
      if(element.classList.contains('active'))
      {
        index = i;
      }
    });
    if(e.keyCode == 87 || e.keyCode == 38)
    {
      buttons[index].classList.remove('active');
      if(index == 0)
        index = buttons.length - 1;
      else
        index--;
      buttons[index].classList.add('active');
    }
    else if(e.keyCode == 83 || e.keyCode == 40)
    {
      buttons[index].classList.remove('active');
      if(index == buttons.length - 1)
        index = 0;
      else
        index++;
      buttons[index].classList.add('active');
    }
    else if(e.keyCode == 13 || e.keyCode == 32)
    {
      if(index == 1)
      {
        gun1.hearts = defaultHearts[0];
        gun2.hearts = defaultHearts[1];
        resetValues();
      }
      else if(index == 2)
      {
        resetValues();
        gameReset();
        backToMenu();
      }
      togglePause(); 
    }
  }
  else if(e.keyCode == 32)      {   gun1.shooting = false;  }
  else if(e.keyCode == 13)      {   gun2.shooting = false;  }
}

function resetValues()
{
  cancelAnimationFrame(gun1.circleAnimation);
  cancelAnimationFrame(gun2.circleAnimation);
  gun1.outOfAmmo = false;
  gun2.outOfAmmo = false;
  gun1.shooting = false;
  gun2.shooting = false;
  gun1.frameX = 0;
  gun2.frameX = 0;
  gun1.degrees = 0;
  gun2.degrees = 0;
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

function backToMenu()
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
}
function gameReset()
{
  switcher = false;
  cancelAnimationFrame(gameAnimation);
  gameAnimation = undefined;
  window.removeEventListener('keydown',down);
  window.removeEventListener('keyup',up);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.display = "none";
  countDown = 5;
}
function gameOver()
{
  resetValues();
  gameReset();

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
    backToMenu();
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
  gameAnimation = requestAnimationFrame(animate);
  now = Date.now();
  elapsed = now - then;
  if(elapsed > fpsInterval)
  {
    then = now - (elapsed % fpsInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(isSwitchSides())
      switcher = !switcher;
    if(!switcher)
    {
      drawGunSprite(gun1Sprite, gun1);
      drawGunSprite(gun2Sprite, gun2);
    }
    else
    {
      drawGunSprite(gun2Sprite, gun1);
      drawGunSprite(gun1Sprite, gun2);
    }
    gun1.functuality([32, 65, 87, 68, 83], true, switcher);
    drawReload(gun1);
    drawReload(gun2);
    if(ai)
    {
      aiMovement();
      gun2.outOfAmmo = false;
    }
    else
      gun2.functuality([13, 37, 38, 39, 40], false, switcher);
    gun1.handlePlayerFrame();
    gun2.handlePlayerFrame();
    gun1.bullets.forEach( (bullet)=> {
      bullet.x += bullet.speed;
      bullet.update();
    });
    gun2.bullets.forEach( (bullet)=> {
      bullet.x += bullet.speed;
      bullet.update();
    });
    bulletsShots();
  }
}

function drawGunSprite(gunSprite, gun)
{
    ctx.drawImage(gunSprite, gun.width * gun.frameX, 0, gun.width, gun.height, gun.x, gun.y, gun.gunWidth, gun.gunHeight);
}

function drawReload(gun)
{
  if(gun.outOfAmmo)
  {
    gun.degrees += 1;

    ctx.beginPath();
    ctx.arc(gun.x + (gun.gunSpacing.widthToGun * 3), gun.y + gun.gunSpacing.heightToGun * 2, gun.radius, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
    ctx.strokeStyle = '#b1b1b1';
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = gun.color;
    ctx.arc(gun.x + (gun.gunSpacing.widthToGun * 3), gun.y + gun.gunSpacing.heightToGun * 2, 50, (Math.PI/180) * 270, (Math.PI/180) * (270 + gun.degrees) );
    ctx.stroke();

    if(gun.degrees == 360)
    {
        gun.degrees = 0;
        gun.outOfAmmo = false;
    }
  }
}

function bulletsShots()
{
  for(let b1 of gun1.bullets)
  {
    if(gun2.isHit(b1, switcher))
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
    if(gun1.isHit(b2, !switcher))
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

function isSwitchSides()
{
    return (switcher ? gun1.x < gun2.x : gun1.x > gun2.x);
}

function aiMovement()
{
    if(gun2.frameX == 0)
      gun2.shooting = false;
    const countSteps = 25;
    if (countSteps <= aiCounter && aiCounter < countSteps * 2)
      gun2.leftMove();

    else if (countSteps * 2 + 1 <= aiCounter && aiCounter < countSteps * 3 + 1)
      gun2.rightMove();

    else if (countSteps * 3 + 2 <= aiCounter && aiCounter < countSteps * 4 + 2)
      gun2.upMove();

    else if (countSteps * 4 + 3 <= aiCounter && aiCounter < countSteps * 5 + 3)
      gun2.downMove();
    else
    {
      gun2.setUp(false, switcher);
      gun2.shooting = true;
      switch(Math.floor(Math.random() * 4))
      {
        case 0:
          aiCounter = countSteps - 1;
          break;
        case 1:
          aiCounter = countSteps * 2 ;
          break;
        case 2:
          aiCounter = countSteps * 3 + 1;
          break;
        case 3:
          aiCounter = countSteps * 4 + 2;
      }
    }
    aiCounter ++;
}

function togglePause()
{
  paused = !paused;
  const pauseDiv = document.querySelector('.pause');
  const overlay = document.querySelector('#overlay');
  if(paused)
  {
    cancelAnimationFrame(gameAnimation);
    pauseDiv.classList.add('active');
    overlay.classList.add('active');
    document.querySelector('.pause button:first-child').classList.add('active');
  }
  else
  {
    startAnimating(FPS);
    pauseDiv.classList.remove('active');
    overlay.classList.remove('active');
    document.querySelector('.pause button.active').classList.remove('active');
  }
}