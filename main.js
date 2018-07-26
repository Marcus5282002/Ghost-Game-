
var mainState = {
    preload: function(){
        game.load.image('floor',"assets/floor.png");
		game.load.image('walls',"assets/walls.png");
        game.load.spritesheet('player',"assets/player.png", 68, 68);
        game.load.spritesheet('enemy',"assets/enemy.png", 40, 40);
        game.load.audio('music', "assets/Desolation.mp3");
        game.load.image('MainRoom',"assets/MainRoom.png");
        game.load.image('TopHall',"assets/TopHall.png");
        game.load.image('MainHall',"assets/MainHall.png");
        game.load.image('RightHall',"assets/RightHall.png");
        game.load.image('Room1',"assets/Room1.png");
        game.load.image('BottomHall',"assets/BottomHall.png");
        game.load.image('Room2',"assets/Room2.png");
        game.load.image('Bathroom',"assets/Bathroom.png");
        game.load.image('paper', "assets/paper.png");
    },
    
    
    
    create: function(){             
	    game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;
	    this.lightAngle = Math.PI/4;
	    this.numberOfRays = 20;
	    this.rayLength = 70;
        this.floor = game.add.sprite(0,0,"floor");
		this.wallsBitmap = game.make.bitmapData(1420,800);
		this.wallsBitmap.draw("walls");
		this.wallsBitmap.update();
		game.add.sprite(0,0,this.wallsBitmap);
        this.player = game.add.sprite(80 ,80 ,'player');
		this.player.anchor.setTo(0.5,0.5);
		this.cursors = game.input.keyboard.createCursorKeys();
		this.maskGraphics = this.game.add.graphics(0, 0);
		this.floor.mask=this.maskGraphics
		this.walls = game.add.sprite(0, 0,'walls');
        this.walls.enableBody = true;
        this.walls.body.immovable = true;
        this.player.frame = 0;
        this.player.animations.add('down', [0, 1, 2, 3], 10, true);
        this.player.animations.add('up', [4, 5, 6, 7], 10, true);       
        this.player.animations.add('right', [8, 9, 10, 11], 10, true);
        this.player.animations.add('left', [12, 13, 14, 15], 10, true);
        this.game.physics.arcade.enable(this.walls);
        this.enemies = game.add.group();
        this.walls = game.add.group();
        this.paper = game.add.group();
     
        var rand;
        var spawnPointCount = 3;
        //this is an array of objects representing spawn points in the map
        var spawnPoints = [
        {x: 1200, y:700},
        {x: 1300, y:480},
        {x: 1300, y: 80},
        {x: 80, y: 480}, 
        ]
        
        for(var i = 0; i < spawnPointCount; i++){
            rand = Math.floor(Math.random() * spawnPoints.length); //returns number between 0-spawnpoints.length - 1
            var enemy = game.add.sprite(spawnPoints[rand].x, spawnPoints[rand].y,'enemy');
            enemy.animations.add('down', [0, 1, 2], 10, true);
            enemy.animations.add('up', [3, 4, 5], 10, true);       
            enemy.animations.add('right', [6, 7, 8], 10, true);
            enemy.animations.add('left', [9, 10, 11], 10, true);
            this.enemies.add(enemy);
            this.enemyspeed = 10;
            this.enemies.mask = this.maskGraphics;
        }
        
         
         for(var o = 0; o < spawnPointCount; o++){
            rand = Math.floor(Math.random() * spawnPoints.length); //returns number between 0-spawnpoints.length - 1
            this.paper = game.add.sprite(spawnPoints[rand].x, spawnPoints[rand].y, 'paper');
            this.paper.mask = this.maskGraphics;
            }
        
        
        this.w = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.s = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.d = game.input.keyboard.addKey(Phaser.Keyboard.D);
        
      },
    
    
    update: function(){
            
        game.physics.arcade.overlap(this.player, this.enemies, this.restart, null, this);
        game.physics.arcade.collide(this.walls, this.enemies);
        game.physics.arcade.overlap(this.player, this.paper, this.countScore, null, this);
        
        for(var j= 0; j < this.enemies.children.length; j++ ){
            if(Math.abs(this.player.body.x - this.enemies.children[j].body.x) < 70 || Math.abs(this.player.body.y - this.enemies.children[j].body.y) < 70){
                game.physics.arcade.moveToObject(this.enemies.children[j], this.player, 30);
            }else{
                this.enemies.children[j].body.velocity.x = 0;
                this.enemies.children[j].body.velocity.y = 0;
            }

                     if(this.enemies.children[j].body.x > this.player.body.x && this.enemies.children[j].body.y > this.player.body.y || this.enemies.children[j].body.x == this.player.body.x && this.enemies.children[j].body.y > this.player.body.y){
               this.enemies.children[j].animations.play('up');
            }else if(this.enemies.children[j].body.x < this.player.body.x && this.enemies.children[j].body.y < this.player.body.y || this.enemies.children[j].body.x == this.player.body.x && this.enemies.children[j].body.y < this.player.body.y){
                this.enemies.children[j].animations.play('down');
            }else if(this.enemies.children[j].body.x > this.player.body.x && this.enemies.children[j].body.y < this.player.body.y || this.enemies.children[j].body.y == this.player.body.y && this.enemies.children[j].body.x > this.player.body.x){
                this.enemies.children[j].animations.play('left');
            }else if(this.enemies.children[j].body.x < this.player.body.x && this.enemies.children[j].body.y > this.player.body.y || this.enemies.children[j].body.y == this.player.body.y && this.enemies.children[j].body.x < this.player.body.x){
                this.enemies.children[j].animations.play('right');
                }
        }
        //first requirment is top left corner coordinates, second requirment is bottom right corner coordinates
        if(this.player.body.x > 41 && this.player.body.y > 41 && this.player.body.x < 260 && this.player.body.y < 180){
        //MainRoom    
        this.MainR = game.add.sprite(1360, 4, 'MainRoom');
        }else if(this.player.body.x > 261 && this.player.body.y > 41 && this.player.body.x < 1320 && this.player.body.y < 120){
        //TopHall    
        this.TopH = game.add.sprite(1360, 4, 'TopHall');
        }else if(this.player.body.x > 501 && this.player.body.y > 121 && this.player.body.x < 640 && this.player.body.y < 680){
        //MainHall    
        this.MainH = game.add.sprite(1360, 4, 'MainHall');
        }else if(this.player.body.x > 1321 && this.player.body.y > 121 && this.player.body.x < 1380 && this.player.body.y < 540){
        //RightHall    
        this.RightH = game.add.sprite(1360, 4, 'RightHall');
        }else if(this.player.body.x > 781 && this.player.body.y > 121 && this.player.body.x < 1320 && this.player.body.y < 540){
        //Room1    
        this.ROne = game.add.sprite(1360, 4, 'Room1');
        }else if(this.player.body.x > 161 && this.player.body.y > 681 && this.player.body.x < 1040 && this.player.body.y < 760){
        //BottomHall   
        this.BottomH = game.add.sprite(1360, 4, 'BottomHall');
        }else if(this.player.body.x > 41 && this.player.body.y > 221 && this.player.body.x < 460 && this.player.body.y < 680){
        //Room2   
        this.RTwo = game.add.sprite(1360, 4, 'Room2');
        }else if(this.player.body.x > 1041 && this.player.body.y > 581 && this.player.body.x < 1380 && this.player.body.y < 760){
        //Bathroom
        this.BathR = game.add.sprite(1360, 4, 'Bathroom');
        }
        
        var xSpeed = 0;
		var ySpeed = 0;
		if(this.w.isDown){
			ySpeed -=1;
            this.player.animations.play('up');
		}
		else if(this.s.isDown){
			ySpeed +=1;
            this.player.animations.play('down');
		}
		else if(this.a.isDown){
			xSpeed -=1;
            this.player.animations.play('left');
		}
		else if(this.d.isDown){
			xSpeed +=1;
            this.player.animations.play('right');
        }else{
            this.player.animations.stop();
            this.player.frame = 0;
        }
        
        
		if(Math.abs(xSpeed)+Math.abs(ySpeed)<2 && Math.abs(xSpeed)+Math.abs(ySpeed)>0){
			var color = this.wallsBitmap.getPixel32(this.player.x+xSpeed+this.player.width/2,this.player.y+ySpeed+this.player.height/2);
			color+= this.wallsBitmap.getPixel32(this.player.x+xSpeed-this.player.width/2,this.player.y+ySpeed+this.player.height/2);
			color+=this.wallsBitmap.getPixel32(this.player.x+xSpeed-this.player.width/2,this.player.y+ySpeed-this.player.height/2)
			color+=this.wallsBitmap.getPixel32(this.player.x+xSpeed+this.player.width/2,this.player.y+ySpeed-this.player.height/2)
			if(color==0){
				this.player.x+=xSpeed;
				this.player.y+=ySpeed;
			}		
		}
        
        for(var i =0; i < this.enemies.children.length; i++){
            if(Math.abs(xSpeed)+Math.abs(ySpeed)<2 && Math.abs(xSpeed)+Math.abs(ySpeed)>0){
			color = this.wallsBitmap.getPixel32(this.enemies.children[i].x+xSpeed+this.enemies.children[i].width/2,this.enemies.children[i].y+ySpeed+this.enemies.children[i].height/2);
			color+= this.wallsBitmap.getPixel32(this.enemies.children[i].x+xSpeed-this.enemies.children[i].width/2,this.enemies.children[i].y+ySpeed+this.enemies.children[i].height/2);
			color+=this.wallsBitmap.getPixel32(this.enemies.children[i].x+xSpeed-this.enemies.children[i].width/2,this.enemies.children[i].y+ySpeed-this.enemies.children[i].height/2)
			color+=this.wallsBitmap.getPixel32(this.enemies.children[i].x+xSpeed+this.enemies.children[i].width/2,this.player.y+ySpeed-this.enemies.children[i].height/2)
			if(color==0){
				this.enemies.children[i].x+=xSpeed;
				this.enemies.children[i].y+=ySpeed;
			}		
		}
        }
        
		var mouseAngle = Math.atan2(this.player.y-game.input.y,this.player.x-game.input.x);
		this.maskGraphics.clear();
		this.maskGraphics.lineStyle(2, 0xffffff, 1);
		this.maskGraphics.beginFill(0xffff00);
		this.maskGraphics.moveTo(this.player.x,this.player.y);	
		for(var i = 0; i<this.numberOfRays; i++){	
			var rayAngle = mouseAngle-(this.lightAngle/2)+(this.lightAngle/this.numberOfRays)*i
			var lastX = this.player.x;
			var lastY = this.player.y;
			for(var j= 1; j<=this.rayLength;j+=1){
          		var landingX = Math.round(this.player.x-(2*j)*Math.cos(rayAngle));
          		var landingY = Math.round(this.player.y-(2*j)*Math.sin(rayAngle));
          		if(this.wallsBitmap.getPixel32(landingX,landingY)==0){
					lastX = landingX;
					lastY = landingY;	
				}
				else{
					this.maskGraphics.lineTo(lastX,lastY);
					break;
				}
			}
			this.maskGraphics.lineTo(lastX,lastY);
		}
		this.maskGraphics.lineTo(this.player.x,this.player.y); 
     	this.maskGraphics.endFill();
    },
    
    restart: function(){
    game.state.start('main');    
    },
    
    
}
var game = new Phaser.Game(1420,800);   
game.state.add('main', mainState); 
game.state.start('main');
