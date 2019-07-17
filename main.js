// <canvas id="canvas" width="1250" height="650"></canvas>

// GLOBAL VARIABLES
let currentGame;
let currentRoadster;
let frames = 0;

// document.getElementById("game-canvas").style.display = "none";

const myCanvas = document.getElementById('canvas');
const ctx = myCanvas.getContext("2d");

// ---------- GAME CLASS ----------

class Game {
    constructor(){
        this.roadster = {};
        this.obstacles = {};
    }
};

// ----------- ROADSTER CLASS ----------

class Roadster {
    constructor() {
        this.x = 10;
        this.y = 275;
        this.width = 125;
        this.height = 100;
        this.img = "./images/roadster.png"
        this.explosion = "./images/explosion.png"
    }
    drawRoadster() {
        let roadsterImg = new Image();
        roadsterImg.src = this.img;
        ctx.drawImage(roadsterImg, this.x, this.y, this.width, this.height);
    }
    moveRoadster(number) {
        ctx.clearRect(this.x, this.y, this.width, this.height);
        switch(number){
            case 87: // UP
            if(this.y > 1){
                this.y -= 40;
            }
            break;
            case 83: // DOWN
            if(this.y < 550){
                this.y += 40;
            }
            break;
            case 65: // LEFT
            if(this.x > 20){
                this.x -= 40;
            }
            break;
            case 68: // RIGHT
            if(this.x < 1100){
                this.x += 40;
            }
        }
    }
}; // end Roadster class

document.onkeydown = function(e) {
    let movement = e.keyCode;
    currentGame.roadster.moveRoadster(movement);
}

// ---------- OBSTACLES CLASS ----------

class Obstacles {
    constructor() {
        this.x = 1100;
        this.y;
        this.width = 100;
        this.height = 50;
        this.img = "./images/ufo.png";
        this.obstaclesImg = new Image();
        this.obstaclesImg.src = this.img;
    }
    drawObstacle() {
        ctx.drawImage(this.obstaclesImg, this.x, this.y, this.width, this.height);

    }
    moveObstacle() {
        this.x -= 12;
        if(this.x < 0){
            this.x = myCanvas.width;
            this.y = Math.floor((Math.random() * 550) + 1);
        }
    }
}; // end Obstacles class

// ---------- STARS BACKGROUND -----------
var stars=[];
var numStars= 150;
var speed = 5;

function makeStar() {
	return {
		x: Math.random(),
		y: Math.random(),
		distance: Math.sqrt(Math.random()),
		color: 'hsl('+Math.random()*40+',100%,'+(70+Math.random()*30)+'%)'
	};
}

for (i=0;i<numStars;i++) {
	stars[i]=makeStar();
}

function updateStars() {
	// Clear canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);
	// Draw each star
	for (i=0;i<numStars;i++) {
		// Move the star first
		stars[i].x-=Math.pow(stars[i].distance,2)/canvas.width*speed;
		// If it's off-screen, reset it
		if (stars[i].x<=0) {
			stars[i]=makeStar();
			stars[i].x=1;
		}
	}
}

setInterval(function(){
	updateStars();
},30);

// ---------- START --------

function startGame(){
    currentGame = new Game();
    currentRoadster = new Roadster();
    currentObstacle = new Obstacles();

    currentGame.roadster = currentRoadster;
    currentRoadster.drawRoadster();

    currentGame.obstacles = currentObstacle;
    currentObstacle.drawObstacle();

    update();

}

startGame();

// ---------- GAME OVER ----------

function gameOver() {
    
    // ctx.clearRect(0, 0, 1250, 650);
    cancelAnimationFrame()
    setTimeout(300)
}

// ----------- COLLISION -----------

function detectIntersection(obst, roadster) {
    if(obst.x < roadster.x + roadster.width &&
        obst.x + obst.width > roadster.x &&
        obst.y < roadster.y + roadster.height &&
        obst.y + obst.width > roadster.y){
            roadster.img = roadster.explosion;
            // gameOver()
        } 
}

// ---------- UPDATE ---------

function update(){
    ctx.clearRect(0, 0, 1250, 650);

    // ---------- UPDATE STARS ----------
    for (i=0;i<numStars;i++) {
		// Move the star first
		stars[i].x-=Math.pow(stars[i].distance,2)/canvas.width*speed;
		// If it's off-screen, reset it
		if (stars[i].x<=0) {
			stars[i]=makeStar();
			stars[i].x=1;
		}
		// Draw the star
		ctx.beginPath();
		ctx.arc(stars[i].x*canvas.width,stars[i].y*canvas.height,stars[i].distance*2,0,2*Math.PI,false);
		ctx.lineWidth=stars[i].distance*4;
		ctx.strokeStyle='rgba(255,255,255,0.2)';
		ctx.stroke();
		ctx.fillStyle=stars[i].color;
        ctx.fill();	
    }
    
    // ----------- UPDATE ROADSTER ----------
    currentRoadster.drawRoadster();
    frames ++;

    // ---------- UPDATE OBSTACLES ----------
    currentObstacle.moveObstacle();
    currentObstacle.drawObstacle();
    frames ++;

    // ---------- COLLISION ---------
    if(detectIntersection(currentObstacle, currentRoadster)){
        console.log("gameOver")
        gameOver()
    };
    // run collision by frame according to Jack

    requestAnimationFrame(update);
}

console.log(frames)


