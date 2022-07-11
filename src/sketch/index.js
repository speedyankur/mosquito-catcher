import { detections, test } from "../detection";
export default function sketch(s) {
  let bg;
  let handHitSound;
  let flies;
  let isHandClosed = false;
  let palmPoints = [];
  let score = 0;

  const width = 1400;
  const height = 700;
  s.preload = () => {};
  s.setup = () => {
    s.createCanvas(width, height);
    s.textSize(18);
    //s.textAlign(CENTER, CENTER);
    handHitSound = s.loadSound("assets/sounds/hand-hit.mp3");
    bg = s.loadImage("assets/bg.jpg");
    flies = new s.Group();
    for (let i = 0; i < 20; i++) {
      let fly = s.createSprite(s.random(0, width), s.random(0, height));
      fly.addAnimation("normal", "assets/fly.png");
      //fly.debug = true;
      fly.setCollider("circle", 0, 0, 100);
      fly.setSpeed(s.random(2, 3), s.random(0, 360));

      //scale affects the size of the collider
      fly.scale = s.random(0.2, 0.25);
      //mass determines the force exchange in case of bounce
      fly.mass = fly.scale;
      //restitution is the dispersion of energy at each bounce
      //if = 1 the circles will bounce forever
      //if < 1 the circles will slow down
      //if > 1 the circles will accelerate until they glitch
      //circle.restitution = 0.9;
      flies.add(fly);
    }
  };

  s.draw = () => {
    s.clear();
    s.scale(1, 1);
    s.background(bg);
    s.text("Score : " + score, width - 110, 25);
    //s.drawGrid();
    //flies bounce against each others and against boxes
    flies.bounce(flies);
    //all sprites bounce at the screen edges
    for (let i = 0; i < s.allSprites.length; i++) {
      let sprite = s.allSprites[i];
      if (sprite.position.x < 0) {
        sprite.position.x = width;
        //sprite.velocity.x = s.abs(sprite.velocity.x);
      }

      if (sprite.position.x > width) {
        sprite.position.x = 0;
        //sprite.velocity.x = -s.abs(sprite.velocity.x);
      }

      if (sprite.position.y < 0) {
        sprite.position.y = 1;
        sprite.velocity.y = s.abs(sprite.velocity.y);
      }

      if (sprite.position.y > height) {
        sprite.position.y = height - 1;
        sprite.velocity.y = -s.abs(sprite.velocity.y);
      }
    }
    s.circle(s.mouseX, s.mouseY, 20);

    s.scale(-1, 1);
    s.translate(-s.width, 0);
    s.drawSprites();
    if (detections != undefined) {
      if (detections.hands.multiHandLandmarks != undefined) {
        if (detections.hands.multiHandLandmarks.length > 0) {
          const indexFingerTip = detections.hands.multiHandLandmarks[0][8].y;
          const indexFingerLow = detections.hands.multiHandLandmarks[0][5].y;
          if (indexFingerTip >= indexFingerLow) {
            let maxX = Math.max(...palmPoints.map((o) => o.x));
            let minX = Math.min(...palmPoints.map((o) => o.x));
            let maxY = Math.max(...palmPoints.map((o) => o.y));
            let minY = Math.min(...palmPoints.map((o) => o.y));
            for (let i = 0; i < s.allSprites.length; i++) {
              let sprite = s.allSprites[i];
              if (sprite.position.x <= maxX && sprite.position.x >= minX) {
                if (sprite.position.y <= maxY && sprite.position.y >= minY) {
                  sprite.remove();
                  score = score + 100;
                  handHitSound.play();
                }
              }
            }
          }
        }

        s.drawLines([0, 5, 9, 13, 17, 0], true); //palm
        s.drawLines([0, 1, 2, 3, 4]); //thumb
        s.drawLines([5, 6, 7, 8]); //index finger
        s.drawLines([9, 10, 11, 12]); //middle finger
        s.drawLines([13, 14, 15, 16]); //ring finger
        s.drawLines([17, 18, 19, 20]); //pinky

        s.drawLandmarks([0, 1], 0); //palm base
        s.drawLandmarks([1, 5], 60); //thumb
        s.drawLandmarks([5, 9], 120); //index finger
        s.drawLandmarks([9, 13], 180); //middle finger
        s.drawLandmarks([13, 17], 240); //ring finger
        s.drawLandmarks([17, 21], 300); //pinky
      }
    }
  };

  s.mousePressed = () => {
    console.log(s.mouseX, s.mouseY);
    for (let i = 0; i < s.allSprites.length; i++) {
      let sprite = s.allSprites[i];
      let distance = s.dist(
        sprite.position.x,
        sprite.position.y,
        s.mouseX,
        s.mouseY
      );
      if (distance < 50) {
        sprite.remove();
      }
    }
  };

  s.drawGrid = () => {
    s.stroke(200);
    s.fill(120);
    for (var x = -width; x < width; x += 40) {
      s.line(x, -height, x, height);
      s.text(x, x + 1, 12);
    }
    for (var y = -height; y < height; y += 40) {
      s.line(-width, y, width, y);
      s.text(y, 1, y + 12);
    }
  };

  s.drawLines = function (index, isPalm) {
    s.stroke(0, 0, 255);
    s.strokeWeight(3);
    for (let i = 0; i < detections.hands.multiHandLandmarks.length; i++) {
      for (let j = 0; j < index.length - 1; j++) {
        let x = detections.hands.multiHandLandmarks[i][index[j]].x * s.width;
        let y = detections.hands.multiHandLandmarks[i][index[j]].y * s.height;
        // let z = detections.multiHandLandmarks[i][index[j]].z;

        let _x =
          detections.hands.multiHandLandmarks[i][index[j + 1]].x * s.width;
        let _y =
          detections.hands.multiHandLandmarks[i][index[j + 1]].y * s.height;
        // let _z = detections.multiHandLandmarks[i][index[j+1]].z;
        s.line(x, y, _x, _y);
      }
      if (isPalm) {
        palmPoints = [];
        //capture palm points
        for (let j = 0; j < index.length; j++) {
          let x = detections.hands.multiHandLandmarks[i][index[j]].x * s.width;
          let y = detections.hands.multiHandLandmarks[i][index[j]].y * s.height;
          palmPoints.push({
            x,
            y,
          });
        }
      }
    }
  };

  s.drawLandmarks = function (indexArray, hue) {
    s.noFill();
    s.strokeWeight(8);
    for (let i = 0; i < detections.hands.multiHandLandmarks.length; i++) {
      for (let j = indexArray[0]; j < indexArray[1]; j++) {
        let x = detections.hands.multiHandLandmarks[i][j].x * s.width;
        let y = detections.hands.multiHandLandmarks[i][j].y * s.height;
        // let z = detections.multiHandLandmarks[i][j].z;
        s.stroke(hue, 40, 255);
        s.point(x, y);
      }
    }
  };
}
