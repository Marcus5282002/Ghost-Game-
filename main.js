





var mainState = {
    preload: function(){
        game.load.image("floor","floor.png");
		game.load.image("walls","walls.png");
		game.load.image("player","player.png");
    },
    
    create: function(){             
	
	    this.lightAngle = Math.PI/4;
	    this.numberOfRays = 20;
	    this.rayLength = 100;
        this.floor = game.add.sprite(0,0,"floor");
		this.wallsBitmap = game.make.bitmapData(640,480);
		this.wallsBitmap.draw("walls");
		this.wallsBitmap.update();
		game.add.sprite(0,0,this.wallsBitmap);
		this.player = game.add.sprite(80,80,"player");
		this.player.anchor.setTo(0.5,0.5);
		this.cursors = game.input.keyboard.createCursorKeys();
		this.maskGraphics = this.game.add.graphics(0, 0);
		this.floor.mask=this.maskGraphics
    },
    
    
    update: function(){
        
        var xSpeed = 0;
		var ySpeed = 0;
		if(this.cursors.up.isDown){
			ySpeed -=1;
		}
		if(this.cursors.down.isDown){
			ySpeed +=1;
		}
		if(this.cursors.left.isDown){
			xSpeed -=1;
		}
		if(this.cursors.right.isDown){
			xSpeed +=1;
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
		this.floor.alpha = 0.5+Math.random()*0.5;	
    }
    
    
}
var game = new Phaser.Game(640,480);   
game.state.add('main', mainState);  
game.state.start('main');