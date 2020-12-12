var PLAY, END, gameState, trex;
var invisibleGround, ground;
var ObstaclesGroup, CloudsGroup;
var gameOver, restart, count;
var cloudimg,gameOverimg,ground1img,ground2img,obstacle1img,obstacle2img,obstacle3img,obstacle4img,obstacle5img,obstacle6img,restartimg,trexCollidedimg,treximg;

function preload(){
  cloudimg=loadImage("cloud.gif");
  gameOverimg=loadImage("gameOver.gif");
  ground1img=loadImage("ground1.gif");
  ground2img=loadImage("ground2.gif")
  obstacle1img=loadImage("obstacle1.gif");
  obstacle2img=loadImage("obstacle2.gif");
  obstacle3img=loadImage("obstacle3.gif");
  obstacle4img=loadImage("obstacle4.gif");
  obstacle5img=loadImage("obstacle5.gif");
  obstacle6img=loadImage("obstacle6.gif");
  restartimg=loadImage("restart.gif");
  trex_collidedimg=loadImage("trex_collided.gif");
  treximg=loadAnimation("trex.gif");
}

function setup(){
//initiate Game STATES
PLAY = 1;
END = 0;
gameState = PLAY;

//create a trex sprite
trex = createSprite(200,380,20,50);
trex.addImage("treximg",treximg);

//set collision radius for the trex
trex.setCollider("circle",0,0,30);

//scale and position the trex
trex.scale = 0.5;
trex.x = 50;

//create a ground sprite
ground = createSprite(200,380,400,20);
ground.addImage("ground2img",ground2img);
ground.x = ground.width/2;

//invisible Ground to support Trex
invisibleGround = createSprite(200,385,400,5);
invisibleGround.visible = false;

//create Obstacle and Cloud Groups
 ObstaclesGroup = createGroup();
 CloudsGroup = createGroup();

//place gameOver and restart icon on the screen
gameOver = createSprite(200,300);
restart = createSprite(200,340);
gameOver.addImage("gameOverimg",gameOverimg);
gameOver.scale = 0.5;
restart.addImage("restartimg",restartimg);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

//set text
textSize(18);
textFont("Georgia");
textStyle(BOLD);

//score
count = 0;
}

function draw() {
  //set background to white
  background("white");
  //display score
  text("Score: "+ count, 250, 100);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count = count + Math.round(World.frameRate/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown(32) && trex.y >= 359){
      trex.velocityY = -12 ;
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.addImage("trex_collidedimg",trex_collidedimg);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }

  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}
function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.addImage("treximg",treximg);
  
  count = 0;
  
}

function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(400,365,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var random = rand(1,6);
    //obstacle.addImage("obstacle" + random + ".gif");
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 70;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(400,320,40,10);
    cloud.position.y = rand(280,320);
    cloud.addImage("cloudimg",cloudimg);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
}