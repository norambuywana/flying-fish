/**
 * Created by Mauyu on 18/05/16.
 */
var stage, q, loadText, startScreen, playButton, livesText, scoreText, levelText;
var level = 1;
var hero;
var heroSheet;
var badSheet, goodSheet;
var score = 0;
var lives = 3;
var jumpPower=8;
var bounceOff=60;
var gameIsRunning= false;
var goodFruits=[];
var goodFruitsRemoved=[];
var badFruits=[];
var badFruitsRemoved=[];
var newLives=[];
var speed=1;
var keys = {
    rkd:false,
    lkd:false,
    ukd:false
};


function preload() {
    stage = new createjs.Stage("gameCanvas");
    loadText = new createjs.Text("Loading: 0%","30px Verdana", "red");
    loadText.textBaseline="middle";
    loadText.textAlign="center";
    loadText.x=stage.canvas.width/2;
    loadText.y=stage.canvas.height/2;
    stage.addChild(loadText);
    q = new createjs.LoadQueue(true);
    q.on("progress", loadProgress);
    q.on("complete", startUp);

    q.loadManifest(
        [
            "spritesheets/hero.json",
            "spritesheets/herofish.png",
            "spritesheets/goodfruit.json",
            "spritesheets/goodfruit-01.png",
            "spritesheets/badfruit.json",
            "spritesheets/badfruit-01.png",
            "img/life.png",
            "img/starttext.png",
            "img/title.png",
            "img/life.png",
            "img/playbutton.png",
            "spritesheets/background01.json",
            "spritesheets/background01.png",
            "spritesheets/background0203.json",
            "spritesheets/background0203.png"


        ]

    );
}


function loadProgress(e) {
    loadText.text = "Loading: " + (Math.round(e.progress*100)) + "%";
    stage.update();
}




function startUp() {
    stage.removeChild(loadText);
    createjs.Ticker.setFPS(50);
    createjs.Ticker.addEventListener('tick', tock);
    goodSheet = new createjs.SpriteSheet(q.getResult("spritesheets/goodfruit.json"));
    badSheet = new createjs.SpriteSheet(q.getResult("spritesheets/badfruit.json"));
    livesText = new createjs.Text("Lives: 3", "22px Verdana", "white");
    livesText.textAlign="right";
    livesText.x= stage.canvas.width-10;
    livesText.y= 10;
    scoreText = new createjs.Text("Score: 0", "22px Verdana", "white");
    scoreText.x=scoreText.y= 10;
    levelText = new createjs.Text("Level: 1", "22px Verdana", "white");
    levelText.textAlign="center";
    levelText.x= stage.canvas.width/2;
    levelText.y= 10;

    var rb1 = Math.floor(Math.random()*6);
    var rb2 = Math.floor(Math.random()*4);
    var rb3 = Math.floor(Math.random()*3);

    var bg1Sheet = new createjs.SpriteSheet(q.getResult("spritesheets/background01.json"));
    var bg1 = new createjs.Sprite(bg1Sheet, "spritesheets/background01.png");
    bg1.gotoAndStop(rb1);
    var bgSheet = new createjs.SpriteSheet(q.getResult("spritesheets/background0203.json"));
    var bg2 = new createjs.Sprite(bgSheet, "spritesheets/background0203.png");
    bg2.gotoAndStop("2-"+rb2);
    var bg3 = new createjs.Sprite(bgSheet, "spritesheets/background0203.png");
    bg3.gotoAndStop("3-"+rb3);


    stage.addChild(bg1, bg2, bg3, livesText, scoreText, levelText);
    addHero();
    startTextBox();
    playButton.addEventListener("click", startGame);


}

function startGame() {
    stage.removeChild(startScreen);
    gameIsRunning = true;
    window.addEventListener('keydown', fingerDown);
    window.addEventListener('keyup', fingerUp);
    addGoodFruits();
    addBadFruits();
}






function startTextBox() {

    startScreen = new createjs.Container();
    var startBack = new createjs.Shape();
    startBack.graphics.beginFill("black").drawRect(0,0, 700, 500);
    startBack.alpha= 0.5;

    var textContainer = new createjs.Container();
    textContainer.regX=200;
    textContainer.regY= 125;
    textContainer.x=stage.canvas.width/2;
    textContainer.y=stage.canvas.height/2;

    var textBack = new createjs.Shape();
    textBack.graphics.beginFill("#1e1d1d").drawRect(0,0, 400, 250);

    var title = new createjs.Bitmap(q.getResult("img/title.png"));
    title.x = 65;
    title.y= 50;

    var startText = new createjs.Bitmap(q.getResult("img/starttext.png"));
    playButton = new createjs.Bitmap(q.getResult("img/playbutton.png"));
    playButton.x= 136;
    playButton.y= 190;
    textContainer.addChild(textBack, startText, playButton);
    startScreen.addChild(startBack, textContainer, title);
    stage.addChild(startScreen);
}



function addHero() {
    heroSheet = new createjs.SpriteSheet(q.getResult("spritesheets/hero.json"));
    hero = new createjs.Sprite(heroSheet, "spritesheets/herofish.png");
    hero.gotoAndStop("up");
    hero.currentAnimation="noAni";
    hero.width= 85;
    hero.height= 120;
    hero.x= (stage.canvas.width/2)-42.5;
    hero.y= 50;
    hero.speed=5;
    hero.jumpPower = 0;
    stage.addChild(hero);

}




function addGoodFruits() {

    var rand = Math.floor(Math.random()*1000);
    var chance = 7 + level;

    if(rand < chance){
        var f = new createjs.Sprite(goodSheet, "spritesheets/goodfruit-01.png");
        f.gotoAndStop("fall");
        f.width=40;
        f.height=42;
        f.y=-100;
        f.x = Math.floor(Math.random()*(stage.canvas.width-f.width));
        stage.addChild(f);
        goodFruits.push(f);
    }

}


function addBadFruits() {

    var rand = Math.floor(Math.random()*1000);
    var chance = 4 + (level);

    if(rand < chance){
        var f = new createjs.Sprite(badSheet, "spritesheets/badfruit-01.png");
        f.gotoAndStop("fall");
        f.width=31;
        f.height=33;
        f.y=-100;
        f.x = Math.floor(Math.random()*(stage.canvas.width-f.width));
        stage.addChild(f);
        badFruits.push(f);
    }

}

function addLife() {
    var rand = Math.floor(Math.random()*5000);
    var chance = 3;

    if(rand < chance) {
        var l = new createjs.Bitmap(q.getResult("img/life.png"));
        l.width=40;
        l.height=28;
        l.y=-100;
        l.x = Math.floor(Math.random()*(stage.canvas.width-l.width));
        stage.addChild(l);
        newLives.push(l);
    }
}





function fingerUp(e){
    if(e.keyCode===37){
        keys.lkd=false;
        hero.gotoAndStop("left");
        hero.currentAnimation="noAni";

    }
    if(e.keyCode===38){
        keys.ukd=false;

    }

    if(e.keyCode===39){
        keys.rkd=false;
        hero.gotoAndStop("right");
        hero.currentAnimation="noAni";
    }
}

function fingerDown(e){
    if(e.keyCode===37){
        keys.lkd=true;
        if(hero.currentAnimation!="left") {
            hero.gotoAndPlay("left");
        }
    }
    if(e.keyCode===38){
        keys.ukd=true;
        if(hero.currentAnimation!="up") {
            hero.gotoAndPlay("up");
        }
    }
    if(e.keyCode===39){
        keys.rkd=true;
        if(hero.currentAnimation!="right") {
            hero.gotoAndPlay("right");
        }
    }
}


function hitTest(rect1,rect2) {
    if ( rect1.x >= rect2.x + rect2.width
        || rect1.x + rect1.width <= rect2.x
        || rect1.y >= rect2.y + rect2.height
        || rect1.y + rect1.height <= rect2.y )
    {
        return false;
    }
    return true;
}



function jump(e){
    hero.jumpPower=jumpPower;
}


function moveHero() {
    if(keys.rkd){
        hero.x+=hero.speed;
    }
    if(keys.lkd){
        hero.x-=hero.speed;
    }
    if(keys.ukd){
        jump();
    }
}

function heroGrav(){
    hero.jumpPower--;
    if(hero.jumpPower < -5){
        hero.jumpPower=-5;
    }
    hero.y-=hero.jumpPower;
    if(hero.y+hero.height > stage.canvas.height){
        lives--;
        hero.y-=bounceOff;
        if(lives <= 0) {
            die();
        }
    }


}

function die() {
    gameIsRunning = false;
    window.removeEventListener('keydown', fingerDown);
    window.removeEventListener('keyup', fingerUp);
    console.log("dead");
    hero.gotoAndPlay("explode");
    hero.on("animationend", function() {
        hero.gotoAndStop("explodeStop");
        var gameOverText = new createjs.Text("Game over!","40px Verdana", "orange");
        gameOverText.textAlign="center";
        gameOverText.textBaseline="middle";
        gameOverText.x= stage.canvas.width/2;
        gameOverText.y= stage.canvas.height/2;
        stage.addChild(gameOverText);
    })
}

function heroWallHit() {

    if(hero.x >stage.canvas.width-hero.width){
        hero.x = 0;
    }
    if(hero.x < 0) {
        hero.x = stage.canvas.width-hero.width;
    }
    if(hero.y < 0) {
        hero.y=0;
    }
}


function removeFruit() {
    var numGoodRemove = goodFruitsRemoved.length - 1;
    for(var i=numGoodRemove; i>=0; i--) {
        goodFruitsRemoved[i].gotoAndPlay("smashfruit");
        var currentPos = i;
        goodFruitsRemoved[i].on("animationend", function () {
            goodFruitsRemoved[currentPos].gotoAndStop("smashstop");
            stage.removeChild(goodFruitsRemoved[currentPos]);
            goodFruitsRemoved.splice(currentPos, 1);
        });

    }



}



function removeBadFruit() {
    var numBadRemove = badFruitsRemoved.length - 1;
    for(var i = numBadRemove; i >= 0; i--) {
        badFruitsRemoved[i].gotoAndPlay("smash");
        var currentPos = i;
        badFruitsRemoved[i].on("animationend", function () {
            badFruitsRemoved[currentPos].gotoAndStop("smashstop");
            stage.removeChild(badFruitsRemoved[currentPos]);
            badFruitsRemoved.splice(currentPos, 1);
        });

    }
}



function moveFruits() {


    var numGoodF = goodFruits.length - 1;
    for(var i=numGoodF; i>=0 ; i--){
        if(goodFruits[i].y < stage.canvas.height-(goodFruits[i].height+5)){
            goodFruits[i].y+=speed;
        } else if (goodFruits[i].y >= stage.canvas.height-(goodFruits[i].height+5)) {
            goodFruitsRemoved.push(goodFruits[i]);
            goodFruits.splice(i, 1);
            removeFruit();

        }
    }

    var numBadF = badFruits.length;
    for(var b= numBadF-1; b>0; b--) {
        if(badFruits[b].y < stage.canvas.height-(badFruits[b].height+5)) {
            badFruits[b].y+=speed;
        } else if (badFruits[b].y >= stage.canvas.height-(badFruits[b].height+5)){
            badFruitsRemoved.push(badFruits[b]);
            badFruits.splice(b, 1);
            removeBadFruit();


        }
    }

    var numNewLives = newLives.length;
    for (var l= numNewLives-1; l > 0; l--) {
        newLives[l].y+=speed;
        if(newLives[l].y >stage.canvas.height+newLives[l].height) {
            stage.removeChild(newLives[l]);
            newLives.splice(l, 1);

        }
    }

}



function checkCollision() {
    var numGoodF = goodFruits.length-1;
    for(var i=numGoodF; i >= 0; i--){
        if(hitTest(hero, goodFruits[i])){
            score++;
            scoreText.text="Score: "+score;


            if ((score%10 === 0)) {
                level++;
                levelText.text="Level: "+level;

            }

            if (score%20 === 0) {
                console.log("speed++")
                speed++;
                hero.speed++;
                jumpPower++;
            }


            stage.removeChild(goodFruits[i]);
            goodFruits.splice(i, 1);

        }
    }

    var numBadF= badFruits.length-1;
    for(var b=numBadF; b>=0; b--){
        if(hitTest(hero, badFruits[b])){
            lives--;
            if (lives <= 0 ) {
                die();
            }
            stage.removeChild(badFruits[b]);
            badFruits.splice(b, 1);
        }

    }

    var numNewLives= newLives.length-1;
    for(var l = numNewLives; l>=0; l--) {
        if(hitTest(hero, newLives[l])) {
            lives++;
            stage.removeChild(newLives[l]);
            newLives.splice(l, 1);

        }

    }

}





function tock(e){

    if (gameIsRunning){
        moveHero();
        addGoodFruits();
        addBadFruits();
        addLife();
        heroGrav();
        heroWallHit();
        checkCollision();
        if (lives === 1) {
            livesText.text = "Life: "+lives;
        } else {
            livesText.text= "Lives: "+lives;
        }

    }
    moveFruits();
    stage.update(e);
}