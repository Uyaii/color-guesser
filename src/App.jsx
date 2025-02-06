import { useState, useEffect, useRef } from "react";
import "./App.css";

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generateColorOptions = (correctColor) => {
  const colors = [correctColor];
  while (colors.length < 6) {
    colors.push(generateRandomColor());
  }
  return colors.sort(() => Math.random() - 0.5);
};

function App() {
  const [targetColor, setTargetColor] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const timeoutRef = useRef(null);

  const newGame = () => {
    const newColor = generateRandomColor();
    setTargetColor(newColor);
    setColorOptions(generateColorOptions(newColor));
    setGameStatus("");
    setIsFlipped(false);
    setIsReady(false);

    // Show color for 2 seconds before flipping
    timeoutRef.current = setTimeout(() => {
      setIsFlipped(true);
      setIsReady(true);
    }, 2000);
  };

  const handleColorClick = (selectedColor) => {
    if (!isReady) return;

    if (selectedColor === targetColor) {
      setScore((s) => s + 1);
      setGameStatus("Correct! 🎉");
    } else {
      setGameStatus("Wrong! Try again.");
    }

    // Restart game after 1.5 seconds
    timeoutRef.current = setTimeout(() => {
      newGame();
    }, 1500);
  };

  const handleNewGame = () => {
    setScore(0);
    newGame();
  };

  useEffect(() => {
    newGame();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="game-container">
      <h1>Color Guessing Game</h1>

      <div className="card-container">
        <div className={`card ${isFlipped ? "flipped" : ""}`}>
          <div
            className="card-front"
            style={{ backgroundColor: targetColor }}
            data-testid="colorBox"
          />
          <div className="card-back" />
        </div>
      </div>

      <p data-testid="gameInstructions" className="instructions">
        Memorize the color before it flips!
      </p>

      <div className="color-options">
        {colorOptions.map((color, index) => (
          <button
            key={index}
            data-testid="colorOption"
            className={`color-button ${!isReady ? "disabled" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
            disabled={!isReady}
          />
        ))}
      </div>

      <div data-testid="gameStatus" className="status">
        {gameStatus}
      </div>

      <div className="score-container">
        Score: <span data-testid="score">{score}</span>
      </div>

      <button
        data-testid="newGameButton"
        className="new-game-button"
        onClick={handleNewGame}>
        New Game
      </button>
    </div>
  );
}

export default App;
