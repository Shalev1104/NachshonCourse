function Gun(x, y, width, height, speed, color, isP1)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
    this.p1 = isP1;
    this.cardridge = 20;
    this.frameX = 0;
    this.deegres = 0;
    this.shooting = false;
    this.outOfAmmo = false;
    this.bullets;
    this.hearts;
    const radius = 50;

    const widthToGun = 15;
    const heightToGun = 25;
    const gunBarrelWidth = 45;
    const gunBarrelHeight = 13;
    const gunCartridgeWidth = 14;
    const gunCartridgeHeight = 37;

    this.drawSprite = function(sX, sY, sW, sH, dirX, dirY, dirW, dirH)
    {
        if (this.p1) ctx.drawImage(gun1Sprite, sX, sY, sW, sH, dirX, dirY, dirW, dirH);
        else         ctx.drawImage(gun2Sprite, sX, sY, sW, sH, dirX, dirY, dirW, dirH);
    }

    this.drawBullet = function(addX)
    {
        this.bullets.push(new Bullet(this.x + addX, this.y + 30, 11, 5, this.color));
        if(this.bullets.length % this.cardridge == 0)
        {
            this.outOfAmmo = true;
            ctx.clearRect(this.x + (widthToGun * 3)/2 + 7 - radius - 1, this.y + heightToGun * 2 - radius - 1, radius * 2 + 2, radius * 2 + 2);  
            this.reload();
        }
    }

    this.functuality = function(movement)
    {
        if (keyMap[movement[0]])
        {
            this.shooting = true;
            this.shoot();
        }
        if (keyMap[movement[1]] && this.x > 0)
        {
            this.x -= this.speed;
        }
        if (keyMap[movement[2]] && this.y > 0)
        {
            this.y -= this.speed;
        }
        if (keyMap[movement[3]] && this.x  < canvas.width - gunWidth)
        {
            this.x += this.speed;
        }
        if (keyMap[movement[4]] && this.y < canvas.height - gunHeight)
        {
            this.y += this.speed;
        }
    }
  
    this.handlePlayerFrame = function()
    {
        (this.frameX < 6 && this.shooting && !this.outOfAmmo) ? this.frameX++ : this.frameX = 0;
    }

    this.shoot = function()
    {
        const addXtoleft = 65;
        const addXtoRight = 5;
        if(!this.outOfAmmo)
        {
            if      (this.p1 && !switcher )   { if(shotSound.isPlaying()) { shotSound.stop(); }
            shotSound.play(); this.drawBullet(addXtoleft);   }
            else if (this.p1 && switcher  )   { this.drawBullet(addXtoleft);   }
            else if (!this.p1 && !switcher)   { this.drawBullet(addXtoRight);  }
            else if (!this.p1 && switcher )   { if(shotSound.isPlaying()) { shotSound.stop(); }
            shotSound.play(); this.drawBullet(addXtoRight);  }
        }
    }

    this.isHit = function(bullet)
    {
        return (this.cartridgeHit(bullet) || this.barrelHit(bullet));
    }

    this.cartridgeHit = function (bullet) 
    {
        if(this.p1)
            return (bullet.x >= this.x + widthToGun && bullet.x <= this.x + widthToGun + gunCartridgeWidth && bullet.y >= this.y + heightToGun + gunBarrelHeight && bullet.y <= this.y + heightToGun + gunBarrelHeight + gunCartridgeHeight);
        return (bullet.x >= this.x + gunWidth - widthToGun - gunCartridgeWidth && bullet.x <= this.x + gunWidth - widthToGun && bullet.y >= this.y + heightToGun + gunBarrelHeight && bullet.y <= this.y + heightToGun + gunBarrelHeight + gunCartridgeHeight);
    }

    this.barrelHit = function(bullet)
    {
        if(this.p1)
            return (bullet.x >= this.x + widthToGun && bullet.x <= this.x + widthToGun + gunBarrelWidth && bullet.y >= this.y + heightToGun && bullet.y <= this.y + heightToGun + gunBarrelHeight);
        return (bullet.x >= this.x + gunWidth - widthToGun - gunBarrelWidth && bullet.x <= this.x + gunWidth - widthToGun && bullet.y >= this.y + heightToGun && bullet.y <= this.y + heightToGun + gunBarrelHeight);
    }

    this.reload = function()
    {
        this.deegres += 1;

        ctx.beginPath();
        ctx.arc(this.x + (widthToGun * 3)/2 + 7, this.y + heightToGun * 2, radius, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
        ctx.strokeStyle = '#b1b1b1';
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x + (widthToGun * 3)/2 + 7, this.y + heightToGun * 2, 50, (Math.PI/180) * 270, (Math.PI/180) * (270 + this.deegres) );
        ctx.stroke();


        if(this.deegres >= 360)
        {
            cancelAnimationFrame(this.reload.bind(this));
            this.deegres = 0;
            this.outOfAmmo = false;
        }
        else
        {
          requestAnimationFrame(this.reload.bind(this));
        }
    }
}