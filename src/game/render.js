import {
  FLOOR_HEIGHT,
  PIPE_WIDTH,
  GAP_HEIGHT,
  BIRD_HEIGHT,
  BIRD_WIDTH,
} from "./constants";

export const drawBackground = (ctx, bgImage, canvasWidth, canvasHeight) => {
  if (bgImage.complete) {
    ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
  }
};

export const drawPipes = (
  ctx,
  pipes,
  pipeTopImg,
  pipeBottomImg,
  canvasHeight,
) => {
  pipes.current.forEach((pipe) => {
    if (pipeTopImg.complete) {
      ctx.drawImage(pipeTopImg, pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
    }
    if (pipeBottomImg.complete) {
      ctx.drawImage(
        pipeBottomImg,
        pipe.x,
        pipe.topHeight + GAP_HEIGHT,
        PIPE_WIDTH,
        canvasHeight,
      );
    }
  });
};

export const drawForeground = (
  ctx,
  foregroundImage,
  scrollXFloor,
  canvasWidth,
  canvasHeight,
) => {
  if (!foregroundImage.complete) return;
  const floorY = canvasHeight - FLOOR_HEIGHT;
  // Draw two images for seamless scrolling
  const x1 = Math.floor(scrollXFloor.current);
  const x2 = Math.floor(scrollXFloor.current + canvasWidth);

  ctx.drawImage(foregroundImage, x1, floorY, canvasWidth, FLOOR_HEIGHT + 2);
  ctx.drawImage(foregroundImage, x2, floorY, canvasWidth, FLOOR_HEIGHT + 2);
};

export const drawBird = (ctx, birdImage, birdY) => {
  if (birdImage.complete) {
    ctx.drawImage(birdImage, 50, birdY.current, BIRD_WIDTH, BIRD_HEIGHT);
  }
};

export const drawScore = (ctx, score, canvasWidth) => {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.font = "bold 60px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  ctx.textAlign = "center";

  const scoreX = canvasWidth / 2;
  const scoreY = 80;

  ctx.fillText(score, scoreX, scoreY);
  ctx.strokeText(score, scoreX, scoreY);
};
