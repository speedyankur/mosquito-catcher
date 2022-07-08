export default function sketch(s) {
  let bg;

  const width = 1400;
  const height = 700;

  s.setup = () => {
    s.createCanvas(width, height);
    bg = s.loadImage("assets/bg.jpg");
  };

  s.draw = () => {
    s.background(bg);
  };

  s.mousePressed = () => {
    //backgroundColor = s.color(s.random(255), s.random(255), s.random(255));
  };
}
