import React, { useEffect, useRef, useState } from "react";

function App() {
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const boxSize = 22;
  const containerRef = useRef(null);

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

  const boxesCount = cols * rows;

  return (
    <main className="h-screen w-full bg-zinc-900 text-white flex flex-col items-center justify-center">
      <div className="container mx-auto p-4 flex flex-col h-full gap-4 max-w-7xl">
        <div className="w-full">
          <h2>High Score: 1000</h2>
        </div>

        <div
          ref={containerRef}
          className="w-full h-full grid border"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${boxSize}px)`,
          }}
        >
          {Array.from({ length: boxesCount }).map((_, index) => (
            <div
              key={index}
              className="w-5 h-5 border border-zinc-600 box-border"
            ></div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
