class Gun {
    constructor(x, y, width, height, speed, color, isP1)
    {
        this.x = x;
        this.y = y;
        this.width = width; //represent sprite sheet width
        this.height = height; //represent sprite sheet height
        this.speed = speed;
        this.color = color;
        this.p1 = isP1;
        this.frameX = 0;
        this.shooting = false;
        this.outOfAmmo = false;
        this.bullets;
        this.hearts;
        this.circleAnimation;
        
        this.cardridge = 25;
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
    
    drawSprite(gunSprite)
    {
        ctx.drawImage(gunSprite, this.width * this.frameX, 0, this.width, this.height, this.x, this.y, this.gunWidth, this.gunHeight);
    }

    drawBullet(addX)
    {
        const bullet = new Bullet(this.x + addX, this.y + 30, this.bulletWidth, this.bulletHeight, this.color);
        let designCircle;
        if (this.p1 && !switcher || !this.p1 && switcher)
        {
            bullet.speed = this.bulletSpeed;
            designCircle = [2, 7];
        }
        else
        {
            bullet.speed = -this.bulletSpeed;
            designCircle = [1, 0];
        }
        this.bullets.push(bullet);
        if(this.bullets.length % this.cardridge == 0 && !(ai && !this.p1))
        {
            this.outOfAmmo = true;
            ctx.clearRect(this.x + (this.gunSpacing.widthToGun * 3)/designCircle[0] + designCircle[1] - this.radius - 1, this.y + this.gunSpacing.heightToGun * 2 - this.radius - 1, this.radius * 2 + 2, this.radius * 2 + 2);  
            this.reload(0, designCircle);
        }
    }

    functuality(movement)
    {
        if (keyMap[movement[0]])
        {
            this.shooting = true;
            this.shoot();
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

    shoot()
    {
        const addXtoleft = 65;
        const addXtoRight = 5;
        if(!this.outOfAmmo)
        {
            if(this.p1)
            {
                if(shotSound.isPlaying()) { shotSound.stop(); }
                shotSound.play();
                switcher ? this.drawBullet(addXtoRight) : this.drawBullet(addXtoleft);
            }
            else
            {
                switcher ? this.drawBullet(addXtoleft) : this.drawBullet(addXtoRight);
            }
        }
    }

    isHit(bullet)
    {
        return (this.cartridgeHit(bullet) || this.barrelHit(bullet));
    }

    cartridgeHit(bullet) 
    {
        if(this.p1 && !switcher || !this.p1 && switcher)
            return (bullet.x >= this.x + this.gunSpacing.widthToGun && bullet.x <= this.x + this.gunSpacing.widthToGun + this.gunSpacing.gunCardridgeWidth && bullet.y >= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight && bullet.y <= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight + this.gunSpacing.gunCardridgeHeight);
        return (bullet.x >= this.x + this.gunWidth - this.gunSpacing.widthToGun - this.gunSpacing.gunCardridgeWidth && bullet.x <= this.x + this.gunWidth - this.gunSpacing.widthToGun && bullet.y >= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight && bullet.y <= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight + this.gunSpacing.gunCardridgeHeight);
    }

    barrelHit(bullet)
    {
        if(this.p1 && !switcher || !this.p1 && switcher)
            return (bullet.x >= this.x + this.gunSpacing.widthToGun && bullet.x <= this.x + this.gunSpacing.widthToGun + this.gunSpacing.gunBarrelWidth && bullet.y >= this.y + this.gunSpacing.heightToGun && bullet.y <= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight);
        return (bullet.x >= this.x + this.gunWidth - this.gunSpacing.widthToGun - this.gunSpacing.gunBarrelWidth && bullet.x <= this.x + this.gunWidth - this.gunSpacing.widthToGun && bullet.y >= this.y + this.gunSpacing.heightToGun && bullet.y <= this.y + this.gunSpacing.heightToGun + this.gunSpacing.gunBarrelHeight);
    }

    reload(deegres, circleFit)
    {
        if(!paused)
        {
            deegres += 1;

            ctx.beginPath();
            ctx.arc(this.x + (this.gunSpacing.widthToGun * 3)/circleFit[0] + circleFit[1], this.y + this.gunSpacing.heightToGun * 2, this.radius, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
            ctx.strokeStyle = '#b1b1b1';
            ctx.stroke();
    
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.arc(this.x + (this.gunSpacing.widthToGun * 3)/circleFit[0] + circleFit[1], this.y + this.gunSpacing.heightToGun * 2, 50, (Math.PI/180) * 270, (Math.PI/180) * (270 + deegres) );
            ctx.stroke();
    
    
            if(deegres == 360)
            {
                cancelAnimationFrame(this.circleAnimation);
                deegres = 0;
                this.outOfAmmo = false;
            }   
        }
        if(deegres != 0)
        {
            this.circleAnimation = requestAnimationFrame(this.reload.bind(this,deegres, circleFit));
        }
    }
}