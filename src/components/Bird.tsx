import { useEffect, useRef, useState } from "react";
import bgPath from "../assets/background-night.png";
import pipeTopPath from "../assets/pipe-top.png";
import pipeBottomPath from "../assets/pipe-bottom.png";
import birdPath from "../assets/bird.png";
import foregroundPath from "../assets/foreground.png";

const Bird = ({ status, dispatch }) => {
  const [gameOver, setGameOver] = useState(false);
  const isGameOver = useRef(false); //can be used to stop the loop instantly
  const canvasRef = useRef(null);
  const pipes = useRef([{ x: 400, topHeight: 150, passed: false }]); // Initial pipe position
  const scrollXFloor = useRef(0); //use a ref for the scroll position to avoid re-render
  const floorHeight = 100;
  const pipeWidth = 50;
  const gapHeight = 120; // space for the bird to fly through
  const birdWidth = 34;
  const birdHeight = 24;

  //Physics Refs
  const birdY = useRef(150);
  const velocityY = useRef(0);
  const gravity = 0.6; // strength of gravity
  const jumpStrength = -8; // how high the bird jumps
  const speed = 4; //pixel per frame

  
  useEffect(() => {
    if (status === "start") {
      birdY.current = 150;
      velocityY.current = 0;
      pipes.current = [{ x: 400, topHeight: 150 }];
      isGameOver.current = false;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    //loading images
    const bgImage = new Image();
    bgImage.src = bgPath;
    const pipeTop = new Image();
    pipeTop.src = pipeTopPath;
    const pipeBottom = new Image();
    pipeBottom.src = pipeBottomPath;
    const BirdImage = new Image();
    BirdImage.src = birdPath;
    const foregroundImage = new Image();
    foregroundImage.src = foregroundPath;

    let animationFrameId;
    // listen for space Key
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        velocityY.current = jumpStrength; // Apply force jump
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const animate = () => {
      if (status !== "playing") {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (bgImage.complete)
          context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        if (BirdImage.complete)
          context.drawImage(BirdImage, 50, 150, birdWidth, birdHeight);
        if (foregroundImage.complete)
          context.drawImage(
            foregroundImage,
            0,
            canvas.height - floorHeight,
            canvas.width,
            floorHeight + 2,
          );

        // Only continue the loop if we aren't dead
        if (!isGameOver.current) {
          animationFrameId = requestAnimationFrame(animate);
        }
        return;
      }
      //   if (isGameOver.current) return;

      // implementation of Physics
      velocityY.current += gravity; // Apply gravity to velocity
      birdY.current += velocityY.current; // Apply velocity to Y position
      const birdX = 50;
      const floorY = canvas.height - floorHeight;

      //defining Hit Floor
      const hitFloor = birdY.current + birdHeight >= floorY;

      let hitPipe = false;

      // collission hit the celling
      if (birdY.current < 0) {
        birdY.current = 0;
        velocityY.current;
      }

      // keep the bird inside the canvas
      if (birdY.current > canvas.height) birdY.current = canvas.height;
      if (birdY.current < 0) birdY.current = 0;

      //clear and draw-background
      context.clearRect(0, 0, canvas.width, canvas.height);

      // 1.Draw a STATIC background
      if (bgImage.complete) {
        context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      }
      //1. update and draw pipes
      pipes.current.forEach((pipe) => {
        pipe.x -= speed;

        // score detection
        const birdX = 50;
        if (!pipe.passed && birdX > pipe.x + pipeWidth) {
          pipe.passed = true;
          dispatch({ type: "increment_score" });
        }

        //3. reset pipe to right side when leaving the screen
        if (pipe.x + pipeWidth < 0) {
          pipe.x = canvas.width;

          //limit topHeight so the gap is always above the floor
          pipe.topHeight =
            Math.random() * (canvas.height - floorHeight - gapHeight - 50) + 50;
        }

        //check horizontal overlap
        if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth) {
          // check if bird is hitting top pipe or buttom pipe
          if (
            birdY.current < pipe.topHeight ||
            birdY.current + birdHeight > pipe.topHeight + gapHeight
          ) {
            hitPipe = true;
            endGame();
          }
        }

        //Draw the pipe top

        if (pipeTop.complete) {
          context.drawImage(
            pipeTop,
            pipe.x,
            0, //always start the very top of the canvas (Y = 0)
            pipeWidth,
            pipe.topHeight, // stretch the image down to the random topHeight
          );
        }

        // Draw the pipe Bottom

        if (pipeBottom.complete) {
          context.drawImage(
            pipeBottom,
            pipe.x,
            pipe.topHeight + gapHeight,
            pipeWidth,
            canvas.height,
          );
        }
      });

      // draw scrolling foreground (Drawn on top of bottom pipe)
      scrollXFloor.current -= speed;
      if (Math.abs(scrollXFloor.current) >= canvas.width) {
        scrollXFloor.current = 0;
      }

      if (foregroundImage.complete) {
        const floorY = canvas.height - floorHeight;
        const x1 = Math.floor(scrollXFloor.current);
        const x2 = Math.floor(scrollXFloor.current + canvas.width);
        // draw two images for seamless looping
        context.drawImage(
          foregroundImage,
          x1,
          floorY,
          canvas.width,
          floorHeight + 2,
        );
        context.drawImage(
          foregroundImage,
          x2,
          floorY,
          canvas.width,
          floorHeight + 2,
        );
      }
      //Draw the bird

      if (BirdImage.complete) {
        context.drawImage(BirdImage, 50, birdY.current, birdWidth, birdHeight); // (x,y, width, height)
      }
      if (hitPipe || hitFloor) {
        isGameOver.current = true;
        dispatch({ type: "game_over" });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const endGame = () => {
      isGameOver.current = true;
      setGameOver(true);
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown); // cleanup listner
    };
  }, [status]);
  return (
    <canvas
      style={{
        display: "block",
        imageRendering: "pixelated", // Keeps it sharp
        backgroundColor: "black", // Fills any tiny gaps with black instead of white
      }}
      ref={canvasRef}
      width={400}
      height={654}
      className="border-gray-400"
    ></canvas>
  );
};

export default Bird;
