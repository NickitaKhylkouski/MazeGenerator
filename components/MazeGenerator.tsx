import { useState, useEffect } from 'react';
import styles from '../styles/MazeGenerator.module.css';

const CELL_SIZE = 20;

interface Cell {
  x: number;
  y: number;
  walls: boolean[];
  visited: boolean;
}

const MazeGenerator = () => {
  const [mazeWidth, setMazeWidth] = useState<number>(20);
  const [mazeHeight, setMazeHeight] = useState<number>(20);
  const [tempWidth, setTempWidth] = useState<number>(20);
  const [tempHeight, setTempHeight] = useState<number>(20);
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [mazeImage, setMazeImage] = useState<string>('');
  const [solution, setSolution] = useState<Cell[]>([]);

  useEffect(() => {
    generateMaze();
  }, [mazeWidth, mazeHeight]);

  const generateMaze = () => {
    const newMaze: Cell[][] = [];
    for (let y = 0; y < mazeHeight; y++) {
      newMaze[y] = [];
      for (let x = 0; x < mazeWidth; x++) {
        newMaze[y][x] = { x, y, walls: [true, true, true, true], visited: false };
      }
    }

    // Create entrance (top-left)
    newMaze[0][0].walls[0] = false;

    // Create exit (bottom-right)
    newMaze[mazeHeight - 1][mazeWidth - 1].walls[2] = false;

    const stack: Cell[] = [];
    const startCell = newMaze[0][0];
    startCell.visited = true;
    stack.push(startCell);

    while (stack.length > 0) {
      const currentCell = stack.pop()!;
      const unvisitedNeighbors = getUnvisitedNeighbors(currentCell, newMaze);

      if (unvisitedNeighbors.length > 0) {
        stack.push(currentCell);
        const randomNeighbor = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
        removeWallsBetween(currentCell, randomNeighbor);
        randomNeighbor.visited = true;
        stack.push(randomNeighbor);
      }
    }

    setSolution([]);
    setMaze(newMaze);
    drawMaze(newMaze, []);
  };

  const getUnvisitedNeighbors = (cell: Cell, maze: Cell[][]) => {
    const neighbors: Cell[] = [];
    const { x, y } = cell;

    if (x > 0 && !maze[y][x - 1].visited) neighbors.push(maze[y][x - 1]);
    if (x < mazeWidth - 1 && !maze[y][x + 1].visited) neighbors.push(maze[y][x + 1]);
    if (y > 0 && !maze[y - 1][x].visited) neighbors.push(maze[y - 1][x]);
    if (y < mazeHeight - 1 && !maze[y + 1][x].visited) neighbors.push(maze[y + 1][x]);

    return neighbors;
  };

  const removeWallsBetween = (cell1: Cell, cell2: Cell) => {
    const dx = cell2.x - cell1.x;
    const dy = cell2.y - cell1.y;

    if (dx === 1) {
      cell1.walls[1] = false;
      cell2.walls[3] = false;
    } else if (dx === -1) {
      cell1.walls[3] = false;
      cell2.walls[1] = false;
    } else if (dy === 1) {
      cell1.walls[2] = false;
      cell2.walls[0] = false;
    } else if (dy === -1) {
      cell1.walls[0] = false;
      cell2.walls[2] = false;
    }
  };

  const drawMaze = (maze: Cell[][], solutionPath: Cell[]) => {
    const canvas = document.createElement('canvas');
    canvas.width = mazeWidth * CELL_SIZE;
    canvas.height = mazeHeight * CELL_SIZE;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    for (let y = 0; y < mazeHeight; y++) {
      for (let x = 0; x < mazeWidth; x++) {
        const cell = maze[y][x];
        const cellX = x * CELL_SIZE;
        const cellY = y * CELL_SIZE;

        if (cell.walls[0]) {
          ctx.beginPath();
          ctx.moveTo(cellX, cellY);
          ctx.lineTo(cellX + CELL_SIZE, cellY);
          ctx.stroke();
        }
        if (cell.walls[1]) {
          ctx.beginPath();
          ctx.moveTo(cellX + CELL_SIZE, cellY);
          ctx.lineTo(cellX + CELL_SIZE, cellY + CELL_SIZE);
          ctx.stroke();
        }
        if (cell.walls[2]) {
          ctx.beginPath();
          ctx.moveTo(cellX, cellY + CELL_SIZE);
          ctx.lineTo(cellX + CELL_SIZE, cellY + CELL_SIZE);
          ctx.stroke();
        }
        if (cell.walls[3]) {
          ctx.beginPath();
          ctx.moveTo(cellX, cellY);
          ctx.lineTo(cellX, cellY + CELL_SIZE);
          ctx.stroke();
        }
      }
    }

    // Draw entrance (green)
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, CELL_SIZE / 4, CELL_SIZE / 4);

    // Draw exit (red)
    ctx.fillStyle = 'red';
    ctx.fillRect(
      canvas.width - CELL_SIZE / 4,
      canvas.height - CELL_SIZE / 4,
      CELL_SIZE / 4,
      CELL_SIZE / 4
    );

    // Draw solution path
    if (solutionPath.length > 0) {
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(solutionPath[0].x * CELL_SIZE + CELL_SIZE / 2, solutionPath[0].y * CELL_SIZE + CELL_SIZE / 2);
      for (let i = 1; i < solutionPath.length; i++) {
        ctx.lineTo(solutionPath[i].x * CELL_SIZE + CELL_SIZE / 2, solutionPath[i].y * CELL_SIZE + CELL_SIZE / 2);
      }
      ctx.stroke();
    }

    setMazeImage(canvas.toDataURL());
  };

  const solveMaze = () => {
    const start = maze[0][0];
    const end = maze[mazeHeight - 1][mazeWidth - 1];
    const path = findPath(start, end);
    console.log("Solution path:", path);
    setSolution(path);
    drawMaze(maze, path);
  };

  const findPath = (start: Cell, end: Cell): Cell[] => {
    const queue: { cell: Cell; path: Cell[] }[] = [{ cell: start, path: [start] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { cell, path } = queue.shift()!;

      if (cell === end) {
        return path;
      }

      const cellKey = `${cell.x},${cell.y}`;
      if (!visited.has(cellKey)) {
        visited.add(cellKey);
        const neighbors = getAccessibleNeighbors(cell);
        for (const neighbor of neighbors) {
          queue.push({ cell: neighbor, path: [...path, neighbor] });
        }
      }
    }

    console.log("No path found");
    return [];
  };

  const getAccessibleNeighbors = (cell: Cell): Cell[] => {
    const neighbors: Cell[] = [];
    const { x, y } = cell;

    if (!cell.walls[0] && y > 0) neighbors.push(maze[y - 1][x]); // Top
    if (!cell.walls[1] && x < mazeWidth - 1) neighbors.push(maze[y][x + 1]); // Right
    if (!cell.walls[2] && y < mazeHeight - 1) neighbors.push(maze[y + 1][x]); // Bottom
    if (!cell.walls[3] && x > 0) neighbors.push(maze[y][x - 1]); // Left

    return neighbors;
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10);
    if (!isNaN(newWidth)) {
      setTempWidth(newWidth);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10);
    if (!isNaN(newHeight)) {
      setTempHeight(newHeight);
    }
  };

  const handleSaveDimensions = () => {
    if (tempWidth > 0 && tempHeight > 0) {
      setMazeWidth(tempWidth);
      setMazeHeight(tempHeight);
    } else {
      alert("Width and height must be greater than 0");
    }
  };

  return (
    <div className={styles.mazeContainer}>
      <div className={styles.controls}>
        <label>
          Width:
          <input type="number" value={tempWidth} onChange={handleWidthChange} />
        </label>
        <label>
          Height:
          <input type="number" value={tempHeight} onChange={handleHeightChange} />
        </label>
        <button onClick={handleSaveDimensions} className={styles.saveButton}>
          Save Dimensions
        </button>
      </div>
      {mazeImage && <img src={mazeImage} alt="Generated Maze" className={styles.mazeImage} />}
      <div className={styles.buttons}>
        <button onClick={generateMaze} className={styles.generateButton}>
          Generate New Maze
        </button>
        <button onClick={solveMaze} className={styles.solveButton}>
          Solve Maze
        </button>
      </div>
    </div>
  );
};

export default MazeGenerator;