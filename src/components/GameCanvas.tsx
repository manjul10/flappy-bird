import { useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BIRD_START_Y,
  JUMP_STRENGTH,
  PIPE_START_X,
} from "../game/constants";

import { applyJump } from "../game/physics";
import { createInitialPipes } from "../game/pipes";

import { loadImages } from "../game/images";
import { drawIdleFrame, drawPlayingFrame } from "../game/gameLoop";

const GameCanvas = () => {
  const { state, dispatch } = useGame(); // using the context to get the game state and dispatch function
  const { status, score } = state;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isGameOver = useRef(false);
  const pipes = useRef([createInitialPipes(PIPE_START_X)]); // Initial pipe position
  const scrollXFloor = useRef(0);

  //Physics Refs
  const birdY = useRef(BIRD_START_Y);
  const velocityY = useRef(0);
  const scoreRef = useRef(0); // use ref to keep track of score without causing re-renders

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    if (status === "start") {
      birdY.current = BIRD_START_Y;
      velocityY.current = 0;
      pipes.current = [createInitialPipes(PIPE_START_X)]; // reset pipe position
      isGameOver.current = false;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.imageSmoothingEnabled = false;

    //loading images
    const images = loadImages();
    const refs = { birdY, velocityY, pipes, scrollXFloor, scoreRef };
    let animationFrameId: number;

    const endGame = () => {
      if (isGameOver.current) return;
      isGameOver.current = true;
      dispatch({ type: "game_over" });
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && status === "playing") {
        e.preventDefault();
        applyJump(velocityY, JUMP_STRENGTH);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // main loop
    const animate = () => {
      if (status !== "playing") {
        drawIdleFrame(context, images, canvas.width, canvas.height);
        if (!isGameOver.current)
          animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const result = drawPlayingFrame(
        context,
        images,
        refs,
        canvas.width,
        canvas.height,
        dispatch,
      );
      if (result === "floor" || result === "pipe") {
        endGame();
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown); // cleanup listner
    };
  }, [status, dispatch]); // only re-run effect if status or dispatch changes
  return (
    <canvas
      style={{
        display: "block",
        imageRendering: "pixelated",
        backgroundColor: "black",
      }}
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-gray-400"
    ></canvas>
  );
};

export default GameCanvas;
