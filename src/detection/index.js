import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import "@mediapipe/control_utils";
export let detections = {
  hands: {},
};

export const test = "123";

const videoElement = document.getElementById("video");

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8,
});

hands.onResults(gotHands);

function gotHands(results) {
  detections.hands = results;
  //console.log(detections);
}

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1400,
  height: 700,
});
camera.start();
