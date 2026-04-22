import { useReducer } from "react";
import "./App.css";
import Bird from "./components/Bird";

const initialState = { status: "start", score: 0 };
function gameReducer(state, action) {
  switch (action.type) {
    case "start_game":
      return { ...state, status: "playing", score: 0 };
    case "game_over":
      return {
        ...state,
        status: "gameOver",
      };
    case "restart":
      return { ...state, status: "start", score: 0 };
    case "increment_score":
      return {
        ...state,
        score: state.score + 1,
      };
    default:
      return state;
  }
}
function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <div className="flex justify-center items-center mx-auto">
      <div className="back-ground flex items-center">
        <Bird status={state.status} dispatch={dispatch} />
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
