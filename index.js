const canvas = document.getElementById('panel');
const context = canvas.getContext('2d');

const src = 'resource/images/img_Character.png';
const objectArray = [];
let first = 0;
let isPaused = false;
let play = false;
let main_screen = true;
let score = 0;
let level = 700;
let life = 3;
let move = 10;
let gameover = false;
let tmp = 0;
let ishelp = false;
let temp = 0;

let audio = new Audio('audio/ending.wav');

let player = new GameObject(2, 2, 47, 57);
objectArray.push(player);

player.x = canvas.width/2 - player.width/2;
player.y = canvas.height/2 - player.height/2;
//화면 중간에서 리스폰

function paused(){
  if(!isPaused) return;
  if(!first){
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fill();
    ++first;
  }
  context.drawImage(home.image, home.cx, home.cy, home.width, home.height,
  canvas.width/2-home.width-5, canvas.height/2-home.height/2, home.width, home.height);
  context.drawImage(replay.image, replay.cx, replay.cy, home.width, home.height,
      canvas.width/2+5, canvas.height/2-replay.height/2, replay.width, replay.height);

  window.requestAnimationFrame(paused);
}

function dis(){
  if(!ishelp) return;
  context.drawImage(manual.image, 0, 0, manual.width, manual.height);
  context.drawImage(close.image, 900, 35, close.width, close.height);
  window.requestAnimationFrame(dis);
}

function clickCanvas(event){
  var canvasRect = canvas.getBoundingClientRect();
  var canvasX = event.pageX-canvasRect.left;
  var canvasY = event.pageY-canvasRect.top;

  if(main_screen && !ishelp && !play && canvasX >= canvas.width/2-start.width/2 &&
    canvasX <= canvas.width/2-start.width/2+start.width &&
    canvasY >= canvas.height/2+60 && canvasY <= canvas.height/2+60+start.height){
    play = true;
    main_screen = false;
    first = 0;
    audio.pause();
    run();
  }//main화면에서 start누름

  else if(main_screen && !ishelp && !play && canvasX >= canvas.width/2-help.width/2
    && canvasX <= canvas.width/2-help.width/2+help.width && canvasY >= canvas.height/2+
    start.height+100 && canvasY <= canvas.height/2+start.height+100+help.height){
    main_screen = false;
    ishelp = true;
    dis();
  }//main화면에서 help누름

  else if(ishelp && !main_screen && !play && canvasX >= 900 && canvasX <= 900+close.width
  && canvasY >= 35 && canvasY <= 35+close.height){
    ishelp = false;
    main_screen = true;
    main();
  }//help화면에서 x누름

  else if(play && !main_screen && !ishelp && !isPaused &&
    canvasX >= canvas.width-pause.width-5 && canvasX <= canvas.width-pause.width-5+pause.width
    && canvasY >= 5 && canvasY <= 5+canvas.height){
    tmp = level;
    isPaused = true;
    play = false;
    first = 0;
    //audio.pause();
    paused();
  }//play상황에서 일시중지 누름

  else if(isPaused && !main_screen && !ishelp && !play && canvasX >= canvas.width/2-home.width-5 &&
    canvasX <= canvas.width/2-home.width-5+home.width &&
    canvasY >= canvas.height/2-home.height/2 && canvasY <= canvas.height/2-home.height/2+home.height){
    first = 0;
    isPaused = false;
    play = false;
    gameover = false;
    ishelp = false;
    main_screen = true;
    score = 0;
    level = 700;
    life = 3;
    move = 10;
    tmp = 0;
    temp = 0;
    audio.pause();
    player.x = canvas.width/2 - player.width/2;
    player.y = canvas.height/2 - player.height/2;
    main();
  }//일시중지 상황에서 main으로 다시 감

  else if(isPaused && !play && !ishelp && !main_screen && canvasX >= canvas.width/2+5 && canvasX <= canvas.width/2+5+replay.width
  && canvasY >= canvas.height/2-replay.height/2 && canvasY <= canvas.height/2-replay.height/2+replay.height){
    level = tmp;
    play = true;
    isPaused = false;
    run();
  }//일시중지 상황에서 다시 play함

  else if(gameover && !ishelp && !main_screen && canvasX >= canvas.width/2-replay.width/2 && canvasX <= canvas.width/2-replay.width/2+replay.width
  && canvasY >= canvas.height/2+90 && canvasY <= canvas.height/2+90+replay.height){
    first = 0;
    isPaused = false;
    gameover = false;
    ishelp = false;
    main_screen = false;
    play = true;
    score = 0;
    level = 700;
    life = 3;
    move = 10;
    tmp = 0;
    temp = 0;
    player.x = canvas.width/2 - player.width/2;
    player.y = canvas.height/2 - player.height/2;
    audio.pause();
    run();
  }
}//게임종료상황에서 replay누름

window.addEventListener('blur', function(e) {
  if(play && !temp){
    play = false;
    isPaused = true;
    temp = 1;
    tmp = level;
    first = 0;
  }
});

window.addEventListener('focus', function(e) {
  if(isPaused && temp){
    temp = 0;
    level = tmp;
  }
  if(main_screen) main();
  else if(ishelp) dis();
  else if(gameover) gameover_screen();
  else paused();
});

function GameObject(cx, cy, width, height)
{
    //이미지를 자를떄 기준의 좌표값
    this.cx = cx;
    this.cy = cy;
    //이미지가 화면에 찍힐때의 실질적 좌표
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.image.src = 'resource/images/img_Character.png';
    this.width = width;
    this.height = height;
    this.direction = 0;
    this.side = 0;

    this.isObstacle = false; //장애물인지 확인
    this.scored = false; //점수처리 확인
    this.eaten = false; //먹혔는지 확인
    this.cheese = false; //치즈인지 확인
    this.pepper = false; //고추인지 확인
    this.hurt = false; //다쳤는지 확인
    this.cc = false; //cheese collision
    this.pc = false; //pepper collision
}

function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

const character = {
    MOUSE_UP: new Rect(2, 2, 47, 57),
    MOUSE_DOWN:new Rect(95, 2, 47, 57),
    MOUSE_RIGHT: new Rect(188, 2, 52, 56),
    MOUSE_LEFT: new Rect(302, 2, 52, 56),
    UP_HURT: new Rect(409, 2, 47, 57),
    DOWN_HURT: new Rect(456, 2, 47, 57),
    RIGHT_HURT: new Rect(501, 2, 52, 58),
    LEFT_HURT: new Rect(554, 2, 52, 58),
    FORK_UP: new Rect(14, 82, 21, 115),
    FORK_DOWN: new Rect(164, 82, 21, 115),
    FORK_RIGHT: new Rect(42, 114, 115, 21),
    FORK_LEFT: new Rect(42, 90, 115, 21),
    KNIFE_UP: new Rect(195, 97, 31, 98),
    KNIFE_DOWN: new Rect(338, 97, 31, 98),
    KNIFE_RIGHT: new Rect(236, 122, 98, 31),
    KNIFE_LEFT: new Rect(233, 90, 98, 31),
    CHEESE: new Rect(389, 90, 40, 32),
    PEPPER: new Rect(445, 91, 30, 45),
    HEART: new Rect(389, 152, 23, 22),
    REPLAY: new Rect(491, 88, 36, 36),
    PAUSE: new Rect(536, 88, 36, 36),
    HOME: new Rect(581, 88, 36, 36),
}

let close = new GameObject(0, 0, 70, 70);
close.image.src = 'resource/images/icon_x.png';

let manual = new GameObject(0, 0, 1000, 700);
manual.image.src = 'resource/images/help.png';

let heart =
new GameObject(character.HEART.x, character.HEART.y,
  character.HEART.width, character.HEART.height);

let gameover_text = new GameObject(0, 0, 460, 104);
gameover_text.image.src = 'resource/images/text_gameover.png';

let title = new GameObject(0, 0, 1004, 280);
title.image.src = 'resource/images/title.png';

let start = new GameObject(0, 0, 141, 51);
start.image.src = 'resource/images/text_start.png';

let help = new GameObject(0, 0, 108, 50);
help.image.src = 'resource/images/text_help.png';

let replay =
new GameObject(character.REPLAY.x, character.REPLAY.y,
  character.REPLAY.width, character.REPLAY.height);

let pause =
new GameObject(character.PAUSE.x, character.PAUSE.y,
  character.PAUSE.width, character.PAUSE.height);

let home =
new GameObject(character.HOME.x, character.HOME.y,
  character.HOME.width, character.HOME.height);

function cheese(){
  let newObstacle = new GameObject(character.CHEESE.x, character.CHEESE.y,
  character.CHEESE.width, character.CHEESE.height);
  newObstacle.cheese = true;
  objectPush(newObstacle);
}

function pepper(){
  let newObstacle = new GameObject(character.PEPPER.x, character.PEPPER.y,
  character.PEPPER.width, character.PEPPER.height);
  newObstacle.pepper = true;
  objectPush(newObstacle);
}

function Knife(dir){
  let newObstacle;
    if(dir == 0){
      newObstacle =
      new GameObject(character.KNIFE_DOWN.x, character.KNIFE_DOWN.y,
        character.KNIFE_DOWN.width, character.KNIFE_DOWN.height);
      newObstacle.side = 0;
    }
    else if(dir == 1){
      newObstacle =
      new GameObject(character.KNIFE_LEFT.x, character.KNIFE_LEFT.y,
        character.KNIFE_LEFT.width, character.KNIFE_LEFT.height);
      newObstacle.side = 1;
    }
    else if(dir == 2){
      newObstacle =
      new GameObject(character.KNIFE_UP.x, character.KNIFE_UP.y,
        character.KNIFE_UP.width, character.KNIFE_UP.height);
      newObstacle.side = 2;
    }
    else{
      newObstacle =
      new GameObject(character.KNIFE_RIGHT.x, character.KNIFE_RIGHT.y,
        character.KNIFE_RIGHT.width, character.KNIFE_RIGHT.height);
      newObstacle.side = 3;
    }
    objectPush(newObstacle);
}

function Fork(dir){
  let newObstacle;
  if(dir == 0){
    newObstacle =
    new GameObject(character.FORK_DOWN.x, character.FORK_DOWN.y,
      character.FORK_DOWN.width, character.FORK_DOWN.height);
    newObstacle.side = 0;
  }
  else if(dir == 1){
    newObstacle =
    new GameObject(character.FORK_LEFT.x, character.FORK_LEFT.y,
      character.FORK_LEFT.width, character.FORK_LEFT.height);
    newObstacle.side = 1;
  }
  else if(dir == 2){
    newObstacle =
    new GameObject(character.FORK_UP.x, character.FORK_UP.y,
      character.FORK_UP.width, character.FORK_UP.height);
    newObstacle.side = 2;
  }
  else{
    newObstacle =
    new GameObject(character.FORK_RIGHT.x, character.FORK_RIGHT.y,
      character.FORK_RIGHT.width, character.FORK_RIGHT.height);
    newObstacle.side = 3;
  }
  objectPush(newObstacle);
}

function objectPush(newObstacle){
  objectArray.push(newObstacle);
  newObstacle.isObstacle = true;
  newObstacle.direction = parseInt(Math.random()*3);
  const rx = Math.random() * (canvas.width-newObstacle.width-2);
  //리스폰되는 x좌표
  const ry = Math.random() * (canvas.height-newObstacle.height-2);
  //리스폰되는 y좌표
  appearSide(rx, ry, newObstacle);
}

function appearSide(rx, ry, newObstacle){
  const n = newObstacle;
  if(!n.side){
    n.x = rx;
    n.y = -n.height;
  }
  else if(n.side == 1){
    n.x = canvas.width;
    n.y = ry;
  }
  else if(n.side == 2){
    n.x = rx;
    n.y = canvas.height;
  }
  else{
    n.x = -n.width;
    n.y = ry;
  }
}

function down(obj){
  if(obj.x < 0) obj.direction = 0;
  else if(obj.x > canvas.width)obj.direction = 1;
  //벽에 맞으면 튕겨내기

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
}

function up(obj){
  if(obj.x < 0) obj.direction = 0;
  else if(obj.x > canvas.width)obj.direction = 1;
  //벽에 맞으면 튕겨내기

  if(obj.direction == 0){
      obj.x += 5;
      obj.y -= 5;
  }
  else if(obj.direction == 1){
      obj.x -= 5;
      obj.y -= 5;
  }
  else if(obj.direction == 2){
      obj.y -= 5;
  }
}

function left(obj){
  if(obj.y < 0) obj.direction = 0;
  else if(obj.y > canvas.height)obj.direction = 1;
  //벽에 맞으면 튕겨내기

  if(obj.direction == 0){
      obj.x -= 5;
      obj.y += 5;
  }
  else if(obj.direction == 1){
      obj.x -= 5;
      obj.y -= 5;
  }
  else if(obj.direction == 2){
      obj.x -= 5;
  }
}

function right(obj){
  if(obj.y < 0) obj.direction = 0;
  else if(obj.y > canvas.height)obj.direction = 1;
  //벽에 맞으면 튕겨내기

  if(obj.direction == 0){
      obj.x += 5;
      obj.y += 5;
  }
  else if(obj.direction == 1){
      obj.x += 5;
      obj.y -= 5;
  }
  else if(obj.direction == 2){
      obj.x += 5;
  }
}

// 1초마다 한번씩 실행
setInterval(function() {
    if(play){
      let p = parseInt(Math.random()*15);
      if(!p)cheese();
      else if(p == 1)pepper();
      else{
        let n = parseInt(Math.random()*2);
        let dir = parseInt(Math.random()*4);
        if(n) Knife(dir);
        else Fork(dir);
      }
    }
}, level*=(9/10));

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

if(play) window.requestAnimationFrame(run);
if(main_screen) window.requestAnimationFrame(main);

let startO = new GameObject(0, 0, 141, 51);
startO.image.src = 'resource/images/text_s_start.png';
startO.x = canvas.width/2-startO.width/2;
startO.y = canvas.height/2+60;

let helpO = new GameObject(0, 0, 108, 50);
helpO.image.src = 'resource/images/text_s_help.png';
helpO.x = canvas.width/2-helpO.width/2;
helpO.y = canvas.height/2+startO.height+100;

let startP = new GameObject(0, 0, 141, 51);
startP.image.src = 'resource/images/text_start.png';
startP.x = canvas.width/2-start.width/2;
startP.y = canvas.height/2+60;

let helpP = new GameObject(0, 0, 108, 50);
helpP.image.src = 'resource/images/text_help.png';
helpP.x = canvas.width/2-help.width/2;
helpP.y = canvas.height/2+start.height+100;

function main(){
  if(!main_screen) return;
  if(!first){
    audio.src = 'audio/bgm.mp3';
    first = 1;
  }
  audio.play();

  context.fillStyle = '#e7c67e';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.drawImage(title.image, 0,
    canvas.height/2-title.height+30, title.width, title.height);

  context.drawImage(startP.image, startP.x,
    startP.y , startP.width, startP.height);

  context.drawImage(helpP.image, helpP.x,
    helpP.y, helpP.width, helpP.height);

  canvas.onmousemove = function(e){
    var canvasRect = canvas.getBoundingClientRect();
    var canvasX = event.pageX-canvasRect.left;
    var canvasY = event.pageY-canvasRect.top;

    if(main_screen && canvasX >= canvas.width/2-start.width/2 && canvasX <= canvas.width/2-start.width/2+start.width
    && canvasY >= canvas.height/2+60 && canvasY <= canvas.height/2+60+start.height){
      startP.image = startO.image;
      startP.x = startO.x;
      startP.y = startO.y;
      startP.width = startO.width;
      startP.height = startO.height;
    }
    else{
      startP.image = start.image;
      startP.x = canvas.width/2-start.width/2;
      startP.width = start.width;
      startP.height = start.height;
    }
    if(main_screen && canvasX >= canvas.width/2-help.width/2 && canvasX <= canvas.width/2-help.width/2+help.width
    && canvasY >= canvas.height/2+start.height+100 && canvasY <= canvas.height/2+start.height+100+help.height){
      helpP.image = helpO.image;
      helpP.x = helpO.x;
      helpP.y = helpO.y;
      helpP.width = helpO.width;
      helpP.height = helpO.height;
    }
    else{
      helpP.image = help.image;
      helpP.x = canvas.width/2-help.width/2;
      helpP.y = canvas.height/2+start.height+100;
      helpP.width = help.width;
      helpP.height = help.height;
    }
  }

  window.requestAnimationFrame(main);
}

function gameover_screen(){

  if(!gameover)return;
  if(!first){
    audio.src = 'audio/ending.wav';
    audio.play();
    first = 1;
  }
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height); //가운데 정렬로 바꾸기

  context.font = "30px Impact"; //폰트의 크기, 글꼴체 지정
  context.fillStyle = '#c02026'; //색상지정

  gameover_text.x = canvas.width/2-gameover_text.width/2;
  gameover_text.y = canvas.height/2-gameover_text.height - 25;
  context.drawImage(gameover_text.image, gameover_text.x,
  gameover_text.y, gameover_text.width, gameover_text.height);

  replay.x = canvas.width/2-replay.width/2;
  replay.y = canvas.height/2+90;
  context.drawImage(replay.image, replay.cx, replay.cy, replay.width,
    replay.height, replay.x, replay.y, replay.width, replay.height);

  context.fillText("score : "+score, canvas.width/2-55, canvas.height/2+45)
  context.fill();

  window.requestAnimationFrame(gameover_screen);
}

function run()
{

  if(!first){
    isPaused = false;
    objectArray.length = 1;
    ++first;
  }

    if (gameover){
      first = 0;
      play = false;
      gameover_screen();
      return;
    }

    if(!play)return;

    context.fillStyle = '#e7c67e';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "20px Impact";
    context.fillStyle = 'black';
    context.fillText("score : "+score, 5, 23)

    context.drawImage(pause.image, pause.cx, pause.cy, pause.width,
        pause.height, canvas.width-pause.width-5 , 5, pause.width, pause.height);

    for (let obj of objectArray) {
        // 투명도
        context.globalAlpha = obj.alpha;

        if(!obj.eaten){
        context.drawImage(obj.image, obj.cx, obj.cy,
            obj.width, obj.height, obj.x, obj.y, obj.width, obj.height);
          }

          switch(life){
            case 3: context.drawImage(heart.image, heart.cx, heart.cy, heart.width,
            heart.height, heart.width*2+15,
            30, heart.width, heart.height);
            case 2: context.drawImage(heart.image, heart.cx, heart.cy, heart.width,
            heart.height, heart.width+10,
            30, heart.width, heart.height);
            case 1: context.drawImage(heart.image, heart.cx, heart.cy, heart.width,
            heart.height, 5,
            30, heart.width, heart.height);break;
          }

          if(player.hurt){
            switch(player.direction){
              case 0: player.cx = character.LEFT_HURT.x;
                      player.cy = character.LEFT_HURT.y;
                      player.width = character.LEFT_HURT.width;
                      player.height = character.LEFT_HURT.height;
                      break;
              case 1: player.cx = character.RIGHT_HURT.x;
                      player.cy = character.RIGHT_HURT.y;
                      player.width = character.RIGHT_HURT.width;
                      player.height = character.RIGHT_HURT.height;
                      break;
              case 2: player.cx = character.UP_HURT.x;
                      player.cy = character.UP_HURT.y;
                      player.width = character.UP_HURT.width;
                      player.height = character.UP_HURT.height;
                      break;
              case 3: player.cx = character.DOWN_HURT.x;
                      player.cy = character.DOWN_HURT.y;
                      player.width = character.DOWN_HURT.width;
                      player.height = character.DOWN_HURT.height;
                      break;
          }
        }

        else{
          switch(player.direction){
            case 0: player.cx = character.MOUSE_LEFT.x;
                    player.cy = character.MOUSE_LEFT.y;
                    player.width = character.MOUSE_LEFT.width;
                    player.height = character.MOUSE_LEFT.height;
                    break;
            case 1: player.cx = character.MOUSE_RIGHT.x;
                    player.cy = character.MOUSE_RIGHT.y;
                    player.width = character.MOUSE_RIGHT.width;
                    player.height = character.MOUSE_RIGHT.height;
                    break;
            case 2: player.cx = character.MOUSE_UP.x;
                    player.cy = character.MOUSE_UP.y;
                    player.width = character.MOUSE_UP.width;
                    player.height = character.MOUSE_UP.height;
                    break;
            case 3: player.cx = character.MOUSE_DOWN.x;
                    player.cy = character.MOUSE_DOWN.y;
                    player.width = character.MOUSE_DOWN.width;
                    player.height = character.MOUSE_DOWN.height;
                    break;
          }
        }

        if (obj === player) {
            //사용자 사라짐 방지
            if(obj.x < 0){
                obj.x = canvas.width-obj.width;
            }
            else if(obj.x > canvas.width){
                obj.x = 0;
            }
            if(obj.y < 0){
                obj.y = canvas.height-obj.height;
            }
            else if(obj.y > canvas.height){
                obj.y = 0;
            }
            continue;
        }

        if (obj.isObstacle) {
            //장애물 여러방향에서 내려오기(장애물 이동방향 기준)
            if(!obj.side) {
              if(obj.y > canvas.height && !obj.scored){
                obj.scored = true;
                ++score;
              }
              down(obj);
            }
            else if(obj.side == 1) {
              if(obj.x < 0 && !obj.scored){
                obj.scored = true;
                ++score;
              }
              left(obj);
            }
            else if(obj.side == 2) {
              if(obj.y < 0 && !obj.scored){
                obj.scored = true;
                ++score;
              }
              up(obj);
            }
            else {
              if(obj.x < canvas.width && !obj.scored){
                obj.scored = true;
                ++score;
              }
              right(obj);
            }
        }

        if(!isPaused && checkCollision(player, obj)) {
          if(obj.cheese){
            audio.src = 'audio/cheese.wav';
            audio.play();
            obj.eaten = true;
            if(life<3 && !player.cc){
              player.cc = true;
              ++life;
              setTimeout(function(){
                  player.cc = false;
              },1000);
            }
          }

          else if(obj.pepper){
            obj.eaten = true;
            audio.src = 'audio/running.mp3';
            audio.play();
            if(!player.pc){
              player.pc = true;
              move += 5;
              setTimeout(function(){
                  move -= 5;
                  player.pc = false;
              },4000);
            }
          }

          else {
            if(life <= 0) gameover = true;
            else if(!player.hurt){
              audio.src = 'audio/hurt.WAV';
              audio.play();
              --life;
              player.hurt = true;
              setTimeout(function(){
                  player.hurt = false;
              },1000);
            }
          }
        }
    }

    if(life <= 0) gameover = true;

    if (downKeys['ArrowLeft']){
        player.x -= move;
        player.direction = 0;
    }
    if (downKeys['ArrowRight']){
        player.x += move;
        player.direction = 1;
    }
    if (downKeys['ArrowUp']){
        player.y -= move;
        player.direction = 2;
    }
    if (downKeys['ArrowDown']){
        player.y += move;
        player.direction = 3;
      }

    window.requestAnimationFrame(run);
}

function checkCollision(a, b) {
    return !(a.x > b.x + b.width ||
        a.x + a.width < b.x ||
        a.y > b.y + b.height ||
        a.y + a.height < b.y
    );
}
