var audio=document.createElement('audio');
        var first=true;
             window.addEventListener('mousemove',onmousedown);
        
           function onmousedown(){
              if(!first) return;
              first=false;
              audio.src="pong.mp3";
              audio.play();
           }

// select canvas

const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

// draw rect function 

function drawRect (x,y,w,h,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

// creer la raquette user

const user = {
    x : 0,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "white",
    score : 0
}

// creer la raquette ordi

const com = {
    x : cvs.width -10,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "white",
    score : 0
}

// créer la balle

const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 8,
    velocityX : 5,
    velocityY : 5,
    color : "white"
}

drawRect (0,0, cvs.clientWidth, cvs.width, cvs.clientHeight, "BLACK");

// draw cercle

function drawCircle(x,y,r,color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

//créer le filet 

const net = {
    x : cvs.width/2-1,
    y :0,
    width :2,
    height : 10,
    color : "white"
}

//dessiner le filet

function drawNet () {
    for(let i =0; i <= cvs.height; i+=15) {
        drawRect(net.x, net.y+i, net.width, net.height, net.color);
    }
}


// dessiner le text

function drawText (text, x,y,color) {
    ctx.fillStyle = color;
    ctx.font = " 45px fantasy";
    ctx.fillText(text,x,y);
}

function render () {
    // supprimer canvas
    drawRect(0,0,cvs.width, cvs.height, "black");

    // dessiner le filet
    drawNet();

    //dessiner le score

    drawText(user.score, cvs.width/4, cvs.width/5, "white");
    drawText(com.score, 3*cvs.width/4, cvs.width/5, "white");

    // dessiner les raquettes

    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // dessiner la balle

    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

//mise a jour 

function update() {

    //mettre a  jour le score

    if( ball.x - ball.radius < 0 ){
        com.score++;
        resetBall();
        
    }else if( ball.x + ball.radius > cvs.width){
        user.score++;
        resetBall();
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // IA facile

    let computerLevel = 0.03;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

    if(ball.y + ball.radius > cvs.height || ball.y -ball.radius <0) {
        ball.velocityY = -ball.velocityY
    }

    let player = (ball.x < cvs.width/2) ? user : com;

    if(collision(ball,player)){

        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);
        let angleRad = (Math.PI/4) * collidePoint;
        let direction = (ball.x + ball.radius < cvs.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.1;
    }
}



// controler la raquette user

cvs.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = cvs.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}


// detection de collision

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// renitialiser la ball

function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 8;
}


//game initialisation

function game () {
    render();
    update();
}

// boucle
const framePerSecond = 50;
setInterval(game,1000/framePerSecond);