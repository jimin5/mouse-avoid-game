const canvas = document.getElementById('panel');
const context = canvas.getContext('2d');

const src = 'resource/images/img_Character.png';
const objectArray = [];
let isPaused = false;
let play = true;
let score = 0;
let level = 800;
let life = 3;

let player = new GameObject(2, 2, 47, 57);
objectArray.push(player);

player.x = canvas.width/2 - player.width/2;
player.y = canvas.height/2 - player.height/2;
//화면 아래에서 리스폰

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

    this.isObstacle = false;//장애물인지 확인
    this.cheese = false;
    this.pepper = false;
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
    UP_HURT: new Rect(49, 2, 46, 57),
    DOWN_HURT: new Rect(142, 2, 46, 57),
    RIGHT_HURT: new Rect(240, 2, 52, 58),
    LEFT_HURT: new Rect(354, 2, 52, 58),
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
    HEART: new Rect(389, 152, 23, 22)
}

function heart(){

}

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
    if(isPaused) play = false;
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

let gameover = false;

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

    context.fillStyle = '#e7c67e';
    context.fillRect(0, 0, canvas.width, canvas.height); //가운데 정렬로 바꾸기(브라우저 크기 받아와서)
    //fillRect 대신에 이미지로 바꾸기

    for (let obj of objectArray) {
        // 투명도
        context.globalAlpha = obj.alpha;

        context.drawImage(obj.image,
            obj.cx, obj.cy,
            obj.width, obj.height, obj.x, obj.y, obj.width, obj.height);

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
            if(!obj.side) down(obj);
            else if(obj.side == 1) left(obj);
            else if(obj.side == 2) up(obj);
            else right(obj);
        }

        if(checkCollision(player, obj)) {
          if(obj.cheese){

          }
          else if(obj.pepper){

          }
          else gameover = true;
        }
    }

    window.addEventListener('blur', function(e) {
      e.preventDefault();
      isPaused = true;
    });

    window.addEventListener('focus', function(e) {
      e.preventDefault();
      isPaused = false;
    });

    if (downKeys['ArrowLeft']){
        player.x -= 10;
        player.cx = character.MOUSE_LEFT.x;
        player.cy = character.MOUSE_LEFT.y;
        player.width = character.MOUSE_LEFT.width;
        player.height = character.MOUSE_LEFT.height;
      }
    if (downKeys['ArrowRight']){
        player.x += 10;
        player.cx = character.MOUSE_RIGHT.x;
        player.cy = character.MOUSE_RIGHT.y;
        player.width = character.MOUSE_RIGHT.width;
        player.height = character.MOUSE_RIGHT.height;
      }
    if (downKeys['ArrowUp']){
        player.y -= 10;
        player.cx = character.MOUSE_UP.x;
        player.cy = character.MOUSE_UP.y;
        player.width = character.MOUSE_UP.width;
        player.height = character.MOUSE_UP.height;
      }
    if (downKeys['ArrowDown']){
        player.y += 10;
        player.cx = character.MOUSE_DOWN.x;
        player.cy = character.MOUSE_DOWN.y;
        player.width = character.MOUSE_DOWN.width;
        player.height = character.MOUSE_DOWN.height;
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
