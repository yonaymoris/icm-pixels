let video;
let detector;
let detections;
let counter = 0;

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  pixelDensity(1);
  detector = ml5.objectDetector('cocossd', modelReady);
}

function modelReady() {
  console.log('model loaded');
  detect();
}

function detect() {
  detector.detect(video, gotResults);
}

function gotResults(err, results) {
  if (err) {
    console.log(err);
    return;
  }

  detections = results;

  detect();
}

function draw() {
  video.loadPixels();
  image(video, 0, 0, width, height);
  if (detections) {
    detections.forEach(detection => {
      noStroke();
      fill(255);
      strokeWeight(2);

      noFill();
      strokeWeight(3);
      if (detection.label === 'person') {
        stroke(0, 255, 0);
      } else {
        stroke(0, 0, 255);
      }
      // rect(
      //   round(detection.x),
      //   round(detection.y),
      //   round(detection.width),
      //   round(detection.height)
      // );
      pixelStuff(
        round(detection.x),
        round(detection.y),
        round(detection.width),
        round(detection.height),
        detections.indexOf(detection)
      );
      textSize(48);
      textAlign(CENTER, CENTER);
      text(
        detection.label,
        detection.x + detection.width / 2,
        detection.y + detection.height / 2
      );
    });
  }
}

function pixelStuff(x, y, w, h, n) {
  for (let i = x; i < x + w; i += 15) {
    for (let j = y; j < y + h; j += 15) {
      let index = (i + j * w) * 4;
      fill(
        video.pixels[index],
        video.pixels[index + 1],
        video.pixels[index + 2],
        video.pixels[index + 3]
      );
      noStroke();
      rect(i, j, 15, 15);
    }
  }
}
