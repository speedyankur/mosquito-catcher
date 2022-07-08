import { detections, test } from "../detection";
export default function sketch(s) {
  let bg;

  const width = 1400;
  const height = 700;
  s.preload = () => {};
  s.setup = () => {
    s.createCanvas(width, height);
    bg = s.loadImage("assets/bg.jpg");
  };

  s.draw = () => {
    s.clear();
    s.scale(1, 1);
    s.background(bg);
    s.drawGrid();
    s.circle(s.mouseX, s.mouseY, 20);
    if (detections != undefined) {
      if (detections.hands.multiHandLandmarks != undefined) {
        if (detections.hands.multiHandLandmarks.length > 0) {
          const indexFingerTip = detections.hands.multiHandLandmarks[0][8].y;
          const indexFingerLow = detections.hands.multiHandLandmarks[0][5].y;

          const middleFingerTip = detections.hands.multiHandLandmarks[0][12].y;
          const middleFingerLow = detections.hands.multiHandLandmarks[0][9].y;

          const ringFingerTip = detections.hands.multiHandLandmarks[0][16].y;
          const ringFingerLow = detections.hands.multiHandLandmarks[0][13].y;

          if (
            indexFingerTip >= indexFingerLow &&
            middleFingerTip >= middleFingerLow &&
            ringFingerTip >= ringFingerLow
          ) {
            console.log("closed");
            console.log(indexFingerTip, indexFingerLow);
          }
        }

        s.scale(-1, 1);
        s.translate(-s.width, 0);
        s.drawLines([0, 5, 9, 13, 17, 0]); //palm
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

  s.drawLines = function (index) {
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
