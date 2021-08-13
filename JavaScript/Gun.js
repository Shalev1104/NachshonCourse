class Gun {
    constructor(x, y, width, height, speed, cartridge, color)
    {
        this.x = x;
        this.y = y;
        this.width = width; //represent sprite sheet width
        this.height = height; //represent sprite sheet height
        this.speed = speed;
        this.color = color;
        this.frameX = 0;
        this.shooting = false;
        this.outOfAmmo = false;
        this.bullets;
        this.hearts;
        this.circleAnimation;
        this.degrees = 0;
        
        this.cardridge = cartridge;
        this.bulletSpeed = 10;
        this.bulletWidth = 11;
        this.bulletHeight = 5;
        this.radius = 50;
        this.gunWidth = 80;
        this.gunHeight = 80;
        this.gunSpacing = 
        { 
            widthToGun : 15, 
            heightToGun : 25, 
            gunBarrelWidth : 45, 
            gunBarrelHeight : 13, 
            gunCardridgeWidth : 14, 
            gunCardridgeHeight : 37 
        };
    }


    shoot(addX, speedOfBullet)
    {
        const bullet = new Bullet(this.x + addX, this.y + 30, this.bulletWidth, this.bulletHeight, this.color);
        bullet.speed = speedOfBullet;
        this.bullets.push(bullet);
        if(this.bullets.length % this.cardridge == 0)
            this.outOfAmmo = true;
    }

    functuality(movement, isP1, isSwitchSides)
    {
        if (keyMap[movement[0]])
        {
            this.shooting = true;
            this.setUp(isP1, isSwitchSides);
        }
        if (keyMap[movement[1]])
        {
            this.leftMove();
        }
        if (keyMap[movement[2]])
        {
            this.upMove();
        }
        if (keyMap[movement[3]])
        {
            this.rightMove();
        }
        if (keyMap[movement[4]])
        {
            this.downMove();
        }
    }

    leftMove()
    {
        if (this.x > 0)
        {
            this.x -= this.speed;
        }
    }
    rightMove()
    {
        if (this.x  < canvas.width - this.gunWidth)
        {
            this.x += this.speed;
        }
    }
    upMove()
    {
        if (this.y > - this.gunSpacing.gunBarrelHeight)
        {
            this.y -= this.speed;
        }
    }
    downMove()
    {
        if (this.y < canvas.height - this.gunHeight)
        {
            this.y += this.speed;
        }
    }
  
    handlePlayerFrame()
    {
        (this.frameX < 6 && this.shooting && !this.outOfAmmo) ? this.frameX++ : this.frameX = 0;
    }

    setUp(isP1, isSwitchSides)
    {
        const addXtoleft = 65;
        const addXtoRight = 5;
        if(!this.outOfAmmo)
        {
            if(isP1)
            {
                if(shotSound.isPlaying()) { shotSound.stop(); }
                shotSound.play();
                isSwitchSides ? this.shoot(addXtoRight, -this.bulletSpeed) : this.shoot(addXtoleft, this.bulletSpeed);
            }
            else
            {
                isSwitchSides ? this.shoot(addXtoleft, this.bulletSpeed) : this.shoot(addXtoRight, -this.bulletSpeed);
            }
        }
    }

    isHit(bullet, isLeftSide)
    {
        return (this.cartridgeHit(bullet, isLeftSide) || this.barrelHit(bullet, isLeftSide));
    }

    cartridgeHit(bullet, isLeftSide) 
    {
        if(isLeftSide)
            return (bullet.x >= this.x + this.gunSpacing.widthToGun && bullet.x <= this.x + this.gunSpacing.widthToGun + this.gunSpacing.gunCardridgeWidth && bullet.y >= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight && bullet.y <= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight + this.gunSpacing.gunCardridgeHeight);
        return (bullet.x >= this.x + this.gunWidth - this.gunSpacing.widthToGun - this.gunSpacing.gunCardridgeWidth && bullet.x <= this.x + this.gunWidth - this.gunSpacing.widthToGun && bullet.y >= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight && bullet.y <= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight + this.gunSpacing.gunCardridgeHeight);
    }

    barrelHit(bullet, isLeftSide)
    {
        if(isLeftSide)
            return (bullet.x >= this.x + this.gunSpacing.widthToGun && bullet.x <= this.x + this.gunSpacing.widthToGun + this.gunSpacing.gunBarrelWidth && bullet.y >= this.y + this.gunSpacing.heightToGun && bullet.y <= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight);
        return (bullet.x >= this.x + this.gunWidth - this.gunSpacing.widthToGun - this.gunSpacing.gunBarrelWidth && bullet.x <= this.x + this.gunWidth - this.gunSpacing.widthToGun && bullet.y >= this.y + this.gunSpacing.heightToGun && bullet.y <= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight);
    }
}