import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from "react";

type GameStatus = "start" | "playing" | "gameOver";

interface GameState {
  status: GameStatus;
  score: number;
}

type GameAction =
  | { type: "start_game" }
  | { type: "game_over" }
  | { type: "restart" }
  | { type: "increment_score" };

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);
const initialState: GameState = {
  status: "start", // can be 'start', 'playing', 'gameover'
  score: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
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

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
