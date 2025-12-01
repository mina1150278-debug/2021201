let spriteSheet;
let frameCount = 5; // 精靈圖中總共 5 張照片
let frameWidth = 170 / frameCount; // 每幀寬度
let frameHeight = 64; // 每幀高度
let currentFrame = 0;
let frameCounter = 0;
let frameDelay = 5; // 動畫速度，數值越小越快
let spriteScale = 3; // 顯示放大倍數（改名避免與 p5.scale 衝突）
let song;
let amp;

// 新增：角色位置與移動控制
let posX, posY;
let speed = 6;
let facingLeft = false; // 是否面向左邊

function preload() {
  spriteSheet = loadImage('png/all-1.png');
  // 載入音樂檔案，請將 'music.mp3' 替換成您在 music 資料夾中的實際檔名
  song = loadSound('music/music.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);
  amp = new p5.Amplitude();

  // 初始化角色位置到畫布中央
  let displayW = frameWidth * spriteScale;
  let displayH = frameHeight * spriteScale;
  posX = (width - displayW) / 2;
  posY = (height - displayH) / 2;
}

function draw() {
  // 根據音量大小調整動畫速度
  let level = amp.getLevel();
  frameDelay = map(level, 0, 0.5, 15, 0); // 將音量大小 (0 到 0.5 之間) 映射到幀延遲 (15 到 0 之間)，音量越大，延遲越小，動畫越快
  // 背景色 FEFAE0
  background('#CDF3F4');

  // 使用方向鍵控制移動（持續按住可連續移動）
  if (keyIsDown(LEFT_ARROW)) {
    posX -= speed;
    facingLeft = true;
  } else if (keyIsDown(RIGHT_ARROW)) {
    posX += speed;
    facingLeft = false;
  }
  if (keyIsDown(UP_ARROW)) {
    posY -= speed;
  } else if (keyIsDown(DOWN_ARROW)) {
    posY += speed;
  }

  // 顯示尺寸與置中位置（使用 posX, posY）
  let displayW = frameWidth * spriteScale;
  let displayH = frameHeight * spriteScale;

  // 限制角色不要移出畫布
  posX = constrain(posX, 0, width - displayW);
  posY = constrain(posY, 0, height - displayH);

  // 更新幀
  frameCounter++;
  if (frameCounter > frameDelay) {
    currentFrame = (currentFrame + 1) % frameCount;
    frameCounter = 0;
  }

  // 精靈來源位置
  let sourceX = currentFrame * frameWidth;
  let sourceY = 0;

  // 畫出當前幀，按左鍵時翻轉
  if (facingLeft) {
    push();
    // 將畫布原點移到要繪製的右上角，然後水平翻轉（此時 p5.scale 是可用的）
    translate(posX + displayW, posY);
    scale(-1, 1);
    image(spriteSheet, 0, 0, displayW, displayH, sourceX, sourceY, frameWidth, frameHeight);
    pop();
  } else {
    image(spriteSheet, posX, posY, displayW, displayH, sourceX, sourceY, frameWidth, frameHeight);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // 為了符合瀏覽器政策，通常需要使用者互動才能播放聲音。此處設定為點擊滑鼠後開始循環播放音樂。
  if (!song.isPlaying()) {
    song.loop();
  }
}
