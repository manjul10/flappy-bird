import { useEffect, useRef } from "react";
import bgPath from "../assets/background-night.png";
import pipeTopPath from "../assets/pipe-top.png";
import pipeBottomPath from "../assets/pipe-bottom.png"; // Assuming name is pipe-bottom

const Bird = () => {
  const canvasRef = useRef(null);
  const pipes = useRef([{ x: 400, topHeight: 150 }]); // Initial pipe position
  const speed = 2;
  const pipeWidth = 50;
  const gapHeight = 120; // Space for the bird to fly through

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Load all images
    const bgImage = new Image();
    bgImage.src = bgPath;
    const pipeTop = new Image();
    pipeTop.src = pipeTopPath;
    const pipeBottom = new Image();
    pipeBottom.src = pipeBottomPath;

    let animationFrameId;

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw STATIC background
      if (bgImage.complete) {
        context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      }

      // 2. Update and Draw pipes
      pipes.current.forEach((pipe) => {
        pipe.x -= speed;

        // Reset pipe to right side when it leaves the screen
        if (pipe.x + pipeWidth < 0) {
          pipe.x = canvas.width;
          pipe.topHeight = Math.random() * (canvas.height / 2) + 20;
        }

        // Draw Pipe Top
        if (pipeTop.complete) {
          // Drawing the top pipe downwards from y=0
          context.drawImage(
            pipeTop,
            pipe.x,
            pipe.topHeight - pipeTop.height,
            pipeWidth,
            pipeTop.height,
          );
        }

        // Draw Pipe Bottom
        if (pipeBottom.complete) {
          // Drawing the bottom pipe starting after the gap
          context.drawImage(
            pipeBottom,
            pipe.x,
            pipe.topHeight + gapHeight,
            pipeWidth,
            canvas.height,
          );
        }
      });

      // 3. Draw Player (Box)
      context.fillStyle = "#FF0000";
      context.fillRect(50, 150, 30, 30);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation once at least the background is ready
    bgImage.onload = animate;

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="border border-gray-400"
    />
  );
};

export default Bird;
