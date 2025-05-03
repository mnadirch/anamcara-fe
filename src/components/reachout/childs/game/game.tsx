import { useState } from "react";
import styles from "./game.module.css";
const Game = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [toggleGame, settoggleGame] = useState(true);
  const [grid1, setGrid1] = useState(
    Array.from({ length: 9 }, () => Array(8).fill("#006400"))
  );
  const shapes = {
    heart: [
      [0, 0, 1, 1, 0, 1, 1, 0, 0],
      [0, 1, 0, 0, 1, 0, 0, 1, 0],
      [1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
    ],
    dog: [
      [0, 0, 1, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 0, 1, 1, 0],
    ],
    packman: [
      [1, 1, 1, 1, 1, 1, 0, 0, 0],
      [1, 0, 1, 1, 0, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 1, 0, 0, 1, 0, 0, 0, 0],
      [1, 1, 0, 1, 1, 0, 0, 0, 0],
    ],
    toffee: [
      [0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0],
    ],
  };
  type ShapeKey = keyof typeof shapes;

  const shapeKeys: ShapeKey[] = ["heart", "dog", "packman", "toffee"];
  const [index, setIndex] = useState(0);

  const [grid, setGrid] = useState(shapes[shapeKeys[index]]);

  const handleChangeShape = () => {
    const nextIndex = (index + 1) % shapeKeys.length;
    setIndex(nextIndex);
    setGrid(shapes[shapeKeys[nextIndex]]);
    settoggleGame(true);
  };

  const handleBlockClick1 = (row: any, col: any) => {
    const newGrid = grid.map((r, rowIndex) =>
      r.map((val, colIndex) =>
        rowIndex === row && colIndex === col ? (val === 1 ? 2 : val) : val
      )
    );
    setGrid(newGrid);
  };
  const getColor = (value: any) => {
    switch (value) {
      case 1:
        return "#9ef01a";
      case 2:
        return "#9ef01a";
      default:
        return "#006400";
    }
  };

  const handleBlockClick = (row: any, col: any) => {
    const newGrid = grid1.map((r, rowIndex) =>
      r.map((color, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return color === "#9ef01a" ? "initialColor" : "#9ef01a";
        }
        return color;
      })
    );
    setGrid1(newGrid);
  };

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setGrid1(Array.from({ length: 9 }, () => Array(8).fill("#006400")));
      setIsResetting(false);
      settoggleGame(false);
    }, 300);
    settoggleGame(false);
  };

  return (
    <div className={styles.gameSection}>
      {toggleGame ? (
        <div className={styles.parentgrid1}
        >
          {grid.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleBlockClick1(rowIndex, colIndex)}
                className={styles.gridblock}
                style={{
                  backgroundColor: getColor(value),
                }}
              />
            ))
          )}
        </div>
      ) : (
        <div 
        className={styles.parentgrid2}>
          {grid1.map((row, rowIndex) =>
            row.map((color, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleBlockClick(rowIndex, colIndex)}
                className={`${styles.gridblock} ${
                  isResetting ? styles.scale : ""
                }`}
                style={{
                  backgroundColor: color,
                  border: "1px solid black",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "yellow")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "black")
                }
              />
            ))
          )}
        </div>
      )}

      <div className={styles.buttonSection}>
        <div onClick={handleChangeShape} className={styles.btn1}></div>

        <div onClick={handleReset} className={styles.btn2}></div>
      </div>
    </div>
  );
};

export default Game;
