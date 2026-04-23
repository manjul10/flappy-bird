import bgPath from "../assets/background-night.png";
import pipeTopPath from "../assets/pipe-top.png";
import pipeBottomPath from "../assets/pipe-bottom.png";
import birdPath from "../assets/bird.png";
import foregroundPath from "../assets/foreground.png";

export const loadImages = () => ({
  bgImage: Object.assign(new Image(), { src: bgPath }),
  pipeTop: Object.assign(new Image(), { src: pipeTopPath }),
  pipeBottom: Object.assign(new Image(), { src: pipeBottomPath }),
  birdImage: Object.assign(new Image(), { src: birdPath }),
  foregroundImage: Object.assign(new Image(), { src: foregroundPath }),
});
