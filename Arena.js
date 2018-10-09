 
 var canvas = document.getElementById("canvas"),  
 ctx = canvas.getContext("2d"),
 WIDTH = canvas.width,
 HEIGHT = canvas.height,  
 frameRate = 1/80, // Seconds
 frameDelay = frameRate * 1000, // ms       
 loopTimer = false,
 CENTER_WIDTH = WIDTH*0.5,
 CENTER_HEIGHT = HEIGHT * 0.5,
 keysDown = {};
 canvas.onmousedown = myDown;
 canvas.onmouseup = myUp;

ctx.translate(CENTER_WIDTH, CENTER_HEIGHT); //translate the coordinates to 0,0

 addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
    if(game.updateKeys){
        let i ;
        for(i =0; i < game.players.length; i++){
            //game.players[i].velocity.x = game.players[i].kx;
        }
    }
  }, false);                                    //add key handling
  addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  }, false);

  requestInterval = function (fn, delay) { // render engine
    var requestAnimFrame = (function () {
      return window.requestAnimationFrame || function (callback, element) {
        window.setTimeout(callback,  frameDelay);
      };
    })(),
        start = new Date().getTime(),
        handle = {};
    function loop() {
      handle.value = requestAnimFrame(loop);
      var current = new Date().getTime(),
          delta = current - start;
      if (delta >= delay) {
        fn.call();
        start = new Date().getTime();
      }
    }
    handle.value = requestAnimFrame(loop);
    return handle;
  }

 function myUp(){
    canvas.onmousemove = null;
  }            
                          //mouse event handling
function myDown(e){
    mouseX = (e.pageX - canvas.offsetLeft);
    mouseY = (e.pageY - canvas.offsetTop);
    //game code 
  }


function drawAll(items){  // draw all to screen and give keys to players
    let i;
    for( i = 0; i < items.length; i++){
      items[i].draw();
      if(items[i].type === "player"){
          items[i].keys();
          
      }

    }
  }

function random(num){
    return Math.floor(Math.random()*num);
  }


  //END OF UTILITY

 

class Constant{   
    constructor(){
        this.drag = 0.47; //0.47
        this.density = 1.22;
        this.gravity = 9.8;       
    }
}

class Vector { 
	constructor(x, y, z, direction) { 
		this.y = y;
		this.x = x;
		this.z = z;
		this.magnitude = Math.abs(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
		this.direction = direction;  
		this.values = [];
		this.frequency = 1;
  }


	dotProductAngle(vector, theta) {
		return this.magnitude * vector.magnitude * Math.cos(theta);
	}  

	dotProduct(vector) {
		return (this.x * vector.x + this.y * vector.y + this.z * vector.z);
	}

	twoDrotate(theta, i, j) {
		let iRot = this.values[i] * Math.cos(theta) - this.values[j] * Math.sin(theta),
		jRot = this.values[i] * Math.sin(theta) + this.values[j] * Math.cos(theta);
		return [iRot, jRot];
	}


	threeD_Rotoate_X(theta, i, j, k) {
		let jRot = this.values[j] * Math.cos(theta) - this.values[k] * Math.sin(theta),
		kRot = this.values[j] * Math.sin(theta) + this.values[k] * Math.cos(theta);
		return [i, jRot, kRot];
	}

	threeD_Rotate_Y(theta, i, j, k) {
		let iRot = this.values[i] * Math.cos(theta) - this.values[k] * Math.sin(theta),
		kRot = -this.value[i] * Math.cos(theta) + this.values[k] * Math.cos(theta);
		return [iRot, j, kRot];
	}

	threeD_Rotoate_Z(theta, i, j, k) {
		let iRot = this.values[i] * Math.cos(theta) - this.values[j] * Math.sin(theta),
		jRot = this.values[i] * Math.sin(theta) + this.values[j] * Math.cos(theta);
		return [iRot, jRot, k];
	}

	isOrthogonal(vector, theta) {
		if (this.dotProduct(vector, theta) == 0) {  
			return true; 
		} else {
			return false;
		}
	}
  
  flip(){
    if (this.direction == 1){
      this.direction = 3; 
    } else if (this.direction == 3){
      this.direction = 1;
    }else if (this.direction == 2){
      this.direction = 4;
    }else if (this.direction == 4){
      this.direction = 2;
    }
     
  }
    
}

class Sprite{
    constructor(x,y,mass,radius,kx, type){           
        this.x = x; 
        this.y = y;  
        this.mass = mass; 
        this.radius = radius;
        this.height = radius;
        this.width = radius;
        this.type = type;  
        this.kx = kx;
        this.velocity = {x:1, y:0}
        this.vector = new Vector(this.x, this.y, 0, 2) ;       
        this.area =  Math.PI * this.radius * this.radius / (10000); 
        this.color = 2; 
        this.jumpsLeft = 1;
        this.onGround = false; 
    }
  
  draw(){       
    ctx.save();     
    ctx.beginPath();
    if (this.color == 1)   
    ctx.fillStyle = "red";  
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.fill();
    ctx.translate(this.x, this.y);  
    ctx.restore();         
  }
  
  autoMove(){
    
     this.x += physics.acceleration(this)[0]*frameRate*100;
     this.y += physics.acceleration(this)[1]*frameRate*100;
    
  }

  keys(){
      if ((39 in keysDown) || (32 in keysDown && 39 in keysDown)){ //right arrow or right-space
        this.x += this.velocity.x*physics.accelerationX(this)*frameRate*200;
        this.vector.direction = 1;
      }else if((37 in keysDown) || (32 in keysDown && 37 in keysDown )){ //left arrow or left-space
        this.x -= this.velocity.x*physics.accelerationX(this)*frameRate*200;
        this.vector.direction = 3;
      }else if(32 in keysDown){// space 
           this.jump();    
      } 
  }


  jump(){
    if(this.onGround){
        this.velocity.y = -(this.mass*this.velocity.x+constant.gravity*this.mass*this.velocity.x+constant.gravity)*2;
        this.velocity.y += physics.accelerationY(this);
        this.y -= this.velocity.y;
        this.vector.direction = 4;
    }else{
       this.velocity.y = -this.jumpsLeft*physics.accelerationY(this)*this.kx;   
    }
  }

}// end of Sprite




class Assets{
    constructor(x,y, width, height, type){
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.type = type;
        this.id = "";
        this.image = document.getElementById(this.id);
        this.vector = new Vector(1.0,1.0,0,4);
        this.radius = height;
    }

    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Game{
    constructor(state){
        this.state = state;
        this.platforms = [];
        this.players = [];
        this.items = [];
        this.sprites = [];
        this.updateKeys = true;
        

    }

    setup(){
       this.platforms.push(new Assets(-200,0, 100, 50, "plaform"));
       this.platforms.push(new Assets(100,0,100,50, "plaform"));
       this.platforms.push(new Assets(-50,50,100,50, "plaform"));
       this.players.push(new Sprite(0,-100,1,10,-0.5, "player"));
    }


    render(){
        drawAll(this.players);
        drawAll(this.platforms);
    }

    stateMachine(){
        switch(this.state){
            case -1://menu state
                break;
            case 0: //setup state
            this.setup();
            this.switchState(1);
                break;
            
            case 1: //game state
                this.render();
                physics.all(this.players[0]);

                break;

            case 2: //end state
                break;
            
            case 3: //restart state
                break;

        }
    }

    switchState(newState){
        this.state = newState;
        
    }









}





var constant = new Constant(),
game = new Game(0);

function update(){
    ctx.clearRect(-WIDTH,-HEIGHT,WIDTH*2,HEIGHT*2);
    game.stateMachine();
}




requestInterval(update, frameRate);