import React, { useEffect, useRef, useState } from "react";

function App() {
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const boxSize = 22;
  const containerRef = useRef(null);

  // GAME STATE
  const [snake, setSnake] = useState([
    [5, 5],
    [4, 5],
    [3, 5],
  ]); // starting snake position
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState([10, 10]);
  const [speed, setSpeed] = useState(120);
  const [score, setScore] = useState(0);

  // Generate food at a random position
  const generateFood = () => {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);

    setFood([x, y]);
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;

        setCols(Math.floor(clientWidth / boxSize));
        setRows(Math.floor(clientHeight / boxSize));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (cols > 0 && rows > 0) {
      generateFood();
    }
  }, [cols, rows]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
      if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
      if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
      if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (cols === 0 || rows === 0) return;

    const interval = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(interval);
  }, [snake, direction, cols, rows, speed]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = [...newSnake[0]];

    if (direction === "UP") head[1] -= 1;
    if (direction === "DOWN") head[1] += 1;
    if (direction === "LEFT") head[0] -= 1;
    if (direction === "RIGHT") head[0] += 1;

    // Wall collision
    if (head[0] < 0 || head[0] >= cols || head[1] < 0 || head[1] >= rows) {
      alert("GAME OVER!");
      window.location.reload();
      return;
    }

    // Self collision
    for (let part of newSnake) {
      if (part[0] === head[0] && part[1] === head[1]) {
        alert("GAME OVER!");
        window.location.reload();
        return;
      }
    }

    newSnake.unshift(head); // new head added

    // Food eaten
    if (head[0] === food[0] && head[1] === food[1]) {
      generateFood(); // grow snake
      setSpeed((prev) => (prev > 20 ? prev - 2 : prev)); // increase speed
      setScore((prev) => prev + 10); // increase score
    } else {
      newSnake.pop(); // normal movement: remove tail
    }

    setSnake(newSnake);
  };

  const isSnake = (x, y) => snake.some((s) => s[0] === x && s[1] === y);
  const isFood = (x, y) => food[0] === x && food[1] === y;

  const boxesCount = cols * rows;

  return (
    <main className="h-screen w-full bg-zinc-900 text-white flex flex-col items-center justify-center">
      <div className="container mx-auto p-4 flex flex-col h-full gap-4 max-w-7xl">
        <div className="w-full">
          <h2>High Score: {score}</h2>
        </div>

        <div
          ref={containerRef}
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${boxSize}px)`,
          }}
        >
          {Array.from({ length: rows }).map((_, row) =>
            Array.from({ length: cols }).map((_, col) => {
              const snakePart = isSnake(col, row);
              const foodHere = isFood(col, row);

              return (
                <div
                  key={`${col}-${row}`}
                  className={`border border-zinc-700 box-border
                    ${snakePart ? "bg-green-500" : ""}
                    ${foodHere ? "bg-red-500" : ""}
                  `}
                  style={{ width: boxSize, height: boxSize }}
                ></div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
