import { GRAVITY, BIRD_HEIGHT, FLOOR_HEIGHT, CANVAS_HEIGHT } from "./constants";


 // Updates the bird's vertical position and velocity.
 // Returns whether the bird has hit the floor.
 
export const updatedBird = (birdY, velocityY, canvasHeight) => {
  velocityY.current += GRAVITY;
  birdY.current += velocityY.current;

  const floorY = canvasHeight - FLOOR_HEIGHT;

  //Ceiling collision
  if (birdY.current < 0) {
    birdY.current = 0;
    velocityY.current = 0;
  }

  //Floor collision
  if (birdY.current + BIRD_HEIGHT >= floorY) {
    birdY.current = floorY - BIRD_HEIGHT;
    velocityY.current = 0;
    return true; // return true if the bird hits the floor
  }
  return false;
};

export function applyJump(velocityY, jumpStrength) {
  velocityY.current = jumpStrength;
}
