import { PIPE_WIDTH, GAP_HEIGHT, FLOOR_HEIGHT, PIPE_SPEED } from "./constants";

 // Updates all pipe positions and recycles off-screen pipes.
 // Returns the pipes array (mutated in place).
 

export const updatePipes = (pipes, canvasWidth, canvasHeight) => {
  pipes.current.forEach((pipe) => {
    pipe.x -= PIPE_SPEED;

    // Recycle pipe if it goes off screen
    if (pipe.x + PIPE_WIDTH < 0) {
      pipe.x = canvasWidth;
      pipe.passed = false;
      pipe.topHeight =
        Math.random() * (canvasHeight - FLOOR_HEIGHT - GAP_HEIGHT - 100) + 50; // randomize top pipe height
    }
  });
};

 // Checks if the bird has passed a pipe and should score.
 // Calls onScore() for each newly passed pipe.
 
export const checkScore = (pipes, birdX, onScore) => {
  pipes.current.forEach((pipe) => {
    if (!pipe.passed && birdX > pipe.x + PIPE_WIDTH) {
      pipe.passed = true;
      onScore();
    }
  });
};

export const createInitialPipes = (startX) => {
  return { x: startX, topHeight: 150, passed: false };
};
