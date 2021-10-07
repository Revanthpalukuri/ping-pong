const canvas=document.getElementById('pong');
const cxt=canvas.getContext("2d");

//functions
//draw rectangle
function drawRect(x,y,a,b,c)
{
    cxt.fillStyle=c;
    cxt.fillRect(x,y,a,b);
}
//draw circle
function drawCircle(x,y,a,b)
{
    cxt.fillStyle=b;
    cxt.beginPath();
    cxt.arc(x,y,a,0,Math.PI*2,false);
    cxt.closePath();
    cxt.fill();    
}
//draw text
function drawText(text,x,y,c)
{
    cxt.fillStyle=c;
    cxt.font="45px fantasy";
    cxt.fillText(text,x,y);
}
//draw net
function drawNet()
{
    for(let i=0;i<canvas.height;i+=15)
    {
        drawRect(canvas.width/2-1,i,2,10,"white");
    }
}
//ball reset
function ballReset()
{
    ball.x=canvas.width/2;
    ball.y=canvas.height/2;
    ball.vx=-ball.vx;
    ball.speed=5;
}
//detection for collision
function collision(b,p)
{   
    b.top=b.y-b.radius;
    b.bottom=b.y+b.radius;
    b.left=b.x-b.radius;
    b.right=b.x+b.radius;

    p.top=p.y;
    p.bottom=p.y+100;
    p.left=p.x;
    p.right=p.x+p.width;

    return b.right>p.left && b.bottom>p.top && b.left<p.right && b.top<p.bottom;
}
//paddle move
function movepaddle(eve)
{
    let rect=canvas.getBoundingClientRect();
    player1.y=eve.clientY-rect.top-100/2;
}
//event listeners
canvas.addEventListener("mousemove",movepaddle);
//objects
const player1={
    x:0,
    y:canvas.height/2-50,
    color:"WHITE",
    width:10,
    score:0
};

const player2={
    x:canvas.width-10,
    y:canvas.height/2-50,
    color:"WHITE",
    width:10,
    score:0
};

const net={
    x:canvas.width/2-1,
    y:0,
    width:2,
    height:10,
    color:"WHITE"
};

const ball={
    x:canvas.width/2,
    y:canvas.height/2,
    radius:10,
    vx:5,
    vy:5,
    speed:5,
    color:"WHITE"
};

function render(){
    drawRect(0,0,canvas.width,canvas.height,"black");
    //draw net
    drawNet();
    //draw score
    drawText(player1.score,canvas.width/4,canvas.width/5,"WHITE");
    drawText(player2.score,3*canvas.width/4,canvas.width/5,"WHITE");
    //draw player bats
    drawRect(player1.x,player1.y,player1.width,100,"WHITE");
    drawRect(player2.x,player2.y,player2.width,100,"WHITE");
    //draw ball
    drawCircle(ball.x,ball.y,ball.radius,"RED");
}
function update()
{
    ball.x+=ball.vx;
    ball.y+=ball.vy;
    //control the paddle
    let player2level=0.1;
    player2.y+=(ball.y-(player2.y+50))*player2level;
    if(ball.radius+ball.y>canvas.height || ball.y-ball.radius<0)
    {
        ball.vy=-ball.vy;
    }
    let player=(ball.x<canvas.width/2)? player1:player2;
    if(collision(ball,player))
    {
        //where the ball hit
        let collidepoint=ball.y-(player.y+50);
        //normalisation
        collidepoint=collidepoint/(50);
        //calculate the angle
        let anglerad=collidepoint*Math.PI/4;
        //direction of ball when hit
        let direction=(ball.x<canvas.width/2)?1:-1;
        //change the velocity now 
        ball.vx=direction*ball.speed*Math.cos(anglerad);
        ball.vy=direction*ball.speed*Math.sin(anglerad);
        //every time increase speed
        ball.speed+=0.8;
    }
    //update score
    if(ball.x-ball.radius<0) 
    {
        player2.score++;
        ballReset();
    }
    else if(ball.x+ball.radius>canvas.width)
    {
        player1.score++;
        ballReset();
    }

}
function loop()
{
    render();
    update();

    requestAnimationFrame(loop);
}
loop();