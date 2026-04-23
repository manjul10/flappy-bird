import { BIRD_START_Y, BIRD_X, PIPE_SPEED } from "./constants";
import { updatedBird } from "./physics";
import { updatePipes, checkScore } from "./pipes";
import { checkCollision } from "./collision";
import {
  drawBackground,
  drawPipes,
  drawForeground,
  drawBird,
  drawScore,
} from "./render";

export const drawIdleFrame = (ctx, images, canvasWidth, canvasHeight) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawBackground(ctx, images.bgImage, canvasWidth, canvasHeight);
  drawBird(ctx, images.birdImage, { current: BIRD_START_Y });
  drawForeground(
    ctx,
    images.foregroundImage,
    { current: 0 },
    canvasWidth,
    canvasHeight,
  );
};

export const drawPlayingFrame = (
  ctx,
  images,
  refs,
  canvasWidth,
  canvasHeight,
  dispatch,
) => {
  const { birdY, velocityY, pipes, scrollXFloor, scoreRef } = refs;

  // Physics — returns true if bird hit the floor
  const hitFloor = updatedBird(birdY, velocityY, canvasHeight);
  if (hitFloor) return "floor";

  // Pipes — move pipes and check if bird scored
  updatePipes(pipes, canvasWidth, canvasHeight);
  checkScore(pipes, BIRD_X, () => dispatch({ type: "increment_score" }));

  // Collision — check if bird hit a pipe
  const hitPipe = checkCollision(birdY.current, pipes, BIRD_X);
  if (hitPipe) return "pipe";

  // Render everything
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawBackground(ctx, images.bgImage, canvasWidth, canvasHeight);
  drawPipes(ctx, pipes, images.pipeTop, images.pipeBottom, canvasHeight);

  scrollXFloor.current -= PIPE_SPEED;
  if (Math.abs(scrollXFloor.current) >= canvasWidth) scrollXFloor.current = 0;
  drawForeground(
    ctx,
    images.foregroundImage,
    scrollXFloor,
    canvasWidth,
    canvasHeight,
  );

  drawBird(ctx, images.birdImage, birdY);
  drawScore(ctx, scoreRef.current, canvasWidth);

  return "ok";
};
