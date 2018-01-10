const canvas = document.getElementById('panel');
const context = canvas.getContext('2d');

function GameObject(src, width, height)
{
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.image.src = src;
    this.width = width;
    this.height = height;
    this.direction = 0;

    this.isObstacle = false;//장애물인지 확인
    this.long = false;
}

const player = new GameObject('image.png', 50, 50);
const obstacle = new GameObject('image.png', 60, 60);
const objectArray = [];
var isPaused = false;
var main = true;
var help = false;
var play = false;

//화면 아래에서 리스폰
player.x = canvas.width/2 - 30;
player.y = canvas.height - 60;

objectArray.push(player);
let score = 0;
let time = 120;

// 1초마다 한번씩 실행
setInterval(function() {
    if(isPaused) {
      play = false;
    }
    const newObstacle = new GameObject('image.png', 60, 60);
    objectArray.push(newObstacle);
    newObstacle.isObstacle = true;

    newObstacle.direction = parseInt(Math.random()*3);
    newObstacle.x = Math.random() * 440;//0에서 440사이의 소수 반환
    newObstacle.y = -newObstacle.height;
}, 1000);

const downKeys = {};

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

function onKeyDown(event)
{
    downKeys[event.code] = true;
}

function onKeyUp(event)
{
    downKeys[event.code] = false;
}

if(main) window.requestAnimationFrame(main_func);
if(help) window.requestAnimationFrame(help_func);
if(play) window.requestAnimationFrame(run); 

let gameover = false;

function main_func()
{
    context.fillStyle = "#e7c67e";
    context.fillRect(0, 0, canvas.width, canvas.height); 

    context.font = "65px malgun gothic"; //폰트의 크기, 글꼴체 지정
    context.fillStyle = "purple"; //색상지정
    context.fillText("Mouse Avoid Game",canvas.width/2-300,canvas.height/2 - 100);

    context.font = "45px malgun gothic";
    context.fillText("START!", canvas.width/2-80, canvas.height/2+70)
    context.fillText("HELP!", canvas.width/2-65, canvas.height/2+140)
    context.fill();

    //TODO: 마우스가 올라가 있을 때 bluh
    //테두리
    //if(Start 위에 onMouseOver == true){
    //    context.strokeStyle = "pink";
    //    context.strokeText("START!", canvas.width/2-80, canvas.height/2+70)
    //}
    //
    //else{
        context.fillStyle = "#e7c67e"
        context.fillRect(canvas.width/2-80, canvas.height/2+30, 150, 50);

        context.fillStyle = "purple"
        context.fillText("START!", canvas.width/2-80, canvas.height/2+70)
    //}

    //if(Help 위에 onMouseOver == true){
    //    context.strokeStyle = "pink";
    //    context.strokeText("HELP!", canvas.width/2-65, canvas.height/2+140)
    //}
    //
    //else{
        context.fillStyle = "#e7c67e"
        context.fillRect(canvas.width/2-65, canvas.height/2+100, 120, 50);

        context.fillStyle = "purple"
        context.fillText("HELP!", canvas.width/2-65, canvas.height/2+140);
    //}

    window.requestAnimationFrame(main_func);
}

function help_func()
{
    context.fillStyle = "#e7c67e";
    context.fillRect(0, 0, canvas.width, canvas.height); 

    context.font = "40px malgun gothic";
    context.fillStyle = "purple";
    context.fillText("-How To Play-", canvas.width/2-140, 100);

    context.font = "20px malgun gothic";
    context.fillText(": 충돌하면 제한 시간 5초 감소", canvas.width/2-80, 200);
    context.fillText(": 먹으면 제한 시간 5초 증가", canvas.width/2-80, 300);
    context.fillText(": 먹으면 5초 동안 속도 증가", canvas.width/2-80, 400);
    context.fillText("오랫동안 살아 남으세요!", canvas.width/2-120, 500);

    context.fillText("BACK", 30, 570);
    context.fillText("START!", 500, 570)

    //TODO: 마우스가 올라가 있을 때 bluh


    context.fill();
}

function run()
{
    if (gameover) {
        //배경색 변경
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height); //가운데 정렬로 바꾸기

        context.font = "20px malgun gothic"; //폰트의 크기, 글꼴체 지정
        context.fillStyle = "red"; //색상지정
        context.fillText("game over",canvas.width/2-55,canvas.height/2);
        context.fillText("score : "+score, canvas.width/2-55, canvas.height/2+20)
        context.fill();
        return;
    }

    context.fillStyle = 'mistyrose';
    context.fillRect(0, 0, canvas.width, canvas.height); //가운데 정렬로 바꾸기(브라우저 크기 받아와서)
    //fillRect 대신에 이미지로 바꾸기

    for (let obj of objectArray) {
        // 투명도
        context.globalAlpha = obj.alpha;

        context.drawImage(obj.image,
            obj.x, obj.y,
            obj.width, obj.height);

        if (obj === player) {
            //사용자 사라짐 방지
            if(obj.x < 0){
                obj.x = canvas.width;
            }
            else if(obj.x > canvas.width){
                obj.x = 0;
            }
            if(obj.y < 0){
                obj.y = canvas.height;
            }
            else if(obj.y > canvas.height){
                obj.y = 0;
            }
            continue;
        }

        if (obj.isObstacle) {
            //장애물 여러방향에서 내려오기
            if(obj.direction == 0){
                obj.x += 5;
                obj.y += 5;
            }
            else if(obj.direction == 1){
                obj.x -= 5;
                obj.y += 5;
            }
            else if(obj.direction == 2){
                obj.y += 5;
            }
            if(obj.long) longer(player, obj);
            else if(obj.long == false) shorter(player, obj);
        }

        if(obj.y == canvas.height){ //canvas.height로 게임화면 세로사이즈 가져옴
            ++score;
        }

        context.font = "20px malgun gothic"; //폰트의 크기, 글꼴체 지정
        context.fillStyle = "black"; //색상지정
        context.fillText("score : "+score,canvas.width-100,30); //점수를 지정한 위치에 찍어준다.
        context.fill();

    }

    window.addEventListener('blur', function(e) {
      console.log(a);
      e.preventDefault();
      isPaused = true;
    });

    window.addEventListener('focus', function(e) {
      e.preventDefault();
      isPaused = false;
    });

    if (downKeys['ArrowLeft'])
        player.x -= 10;
    if (downKeys['ArrowRight'])
        player.x += 10;
    if (downKeys['ArrowUp'])
        player.y -= 10;
    if (downKeys['ArrowDown'])
        player.y += 10;

    window.requestAnimationFrame(run);
}

function checkCollision(a, b) {
    return !(a.x > b.x + b.width ||
        a.x + a.width < b.x ||
        a.y > b.y + b.height ||
        a.y + a.height < b.y
    );
}

function longer(player, obj){
    if(checkCollision(player, obj)){
        time += 5;
        if(time >= 120)time = 120;
    }
}

function shorter(player, obj){
    if(checkCollision(player, obj)){
        time -= 5;
        if(time <= 0)gameover = true;
    }
}

//time -= 1;
