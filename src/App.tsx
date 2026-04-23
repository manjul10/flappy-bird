import "./App.css";
import GameCanvas from "./components/GameCanvas";
import { useGame } from "./context/GameContext";

function App() {
  const { state, dispatch } = useGame(); // using the context to get the game state and dispatch function
  return (
    <div className="flex justify-center items-center mx-auto">
      <div className="back-ground flex items-center">
        <GameCanvas />
        {state.status === "start" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
              Flappy Bird
            </h1>
            <button
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 transition-colors rounded-lg font-bold text-xl shadow-lg"
              onClick={() => dispatch({ type: "start_game" })}
            >
              Start Game
            </button>
            <p className="mt-4 font-medium">Press Space to Jump</p>
          </div>
        )}

        {state.status === "gameOver" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
            <h1 className="text-4xl font-bold mb-4">GAME OVER</h1>
            <p className="text-2xl mb-6">Your Score is: {state.score}</p>
            <button
              className="px-6 py-2 bg-red-500 rounded-lg font-bold"
              onClick={() => dispatch({ type: "restart" })}
            >
              RESTART
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
