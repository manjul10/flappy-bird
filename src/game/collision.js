import { BIRD_WIDTH, BIRD_HEIGHT, PIPE_WIDTH, GAP_HEIGHT } from "./constants";


 // Returns true if the bird collides with any pipe.
 
export const checkCollision = (birdY, pipes, birdX) => {
  for (let pipe of pipes.current) {
    const horizontalOverlap =
      birdX + BIRD_WIDTH > pipe.x && birdX < pipe.x + PIPE_WIDTH;

    if (horizontalOverlap) {
      const hitsTopPipe = birdY < pipe.topHeight;
      const hitsBottomPipe = birdY + BIRD_HEIGHT > pipe.topHeight + GAP_HEIGHT;

      if (hitsTopPipe || hitsBottomPipe) {
        return true; 
      }
    }
  }
  return false; 
};
