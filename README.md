# Maze Generator
A React-based maze generator and solver that creates perfect mazes using depth-first search algorithm with recursive backtracking. The application provides an interactive interface to generate, visualize, and solve mazes of custom dimensions.

## Features
- Custom maze dimensions
- Automatic maze generation
- Maze solving visualization
- Interactive UI with real-time updates
- Visual indicators for entrance (green), exit (red), and solution path (blue)

## Technical Implementation

### Core Components

#### MazeGenerator Component
The main component that handles the maze generation, solving, and visualization logic.

### Algorithms

#### 1. Maze Generation Algorithm
- **Method**: Depth-First Search with Recursive Backtracking
- **Implementation**: [`generateMaze()`](rag://rag_source_4)
- **Process**:
  - Creates a grid of cells with all walls intact
  - Starts from the top-left cell
  - Randomly visits unvisited neighbors
  - Removes walls between visited cells
  - Backtracks when no unvisited neighbors are available
  - Creates entrance at top-left and exit at bottom-right

#### 2. Maze Solving Algorithm
- **Method**: Breadth-First Search (BFS)
- **Implementation**: [`findPath()`](rag://rag_source_8)
- **Process**:
  - Starts from the entrance (top-left)
  - Explores all possible paths level by level
  - Tracks visited cells to avoid cycles
  - Returns the first path found to the exit (bottom-right)

### Data Structures

#### Cell Interface
```typescript
interface Cell {
  x: number;          // X coordinate
  y: number;          // Y coordinate
  walls: boolean[];   // Array of 4 walls [top, right, bottom, left]
  visited: boolean;   // Visited state for maze generation
}
```

### Key Methods

#### 1. Wall Management
- **removeWallsBetween(cell1: Cell, cell2: Cell)**
  - Removes walls between adjacent cells during maze generation
  - Handles all four possible directions (top, right, bottom, left)

#### 2. Neighbor Operations
- **getUnvisitedNeighbors(cell: Cell, maze: Cell[][])**
  - Returns unvisited neighboring cells during maze generation
- **getAccessibleNeighbors(cell: Cell)**
  - Returns accessible neighbors (no walls between) during path finding

#### 3. Visualization
- **drawMaze(maze: Cell[][], solutionPath: Cell[])**
  - Renders the maze using HTML Canvas
  - Draws walls, entrance, exit, and solution path
  - Converts canvas to image data URL for display

## User Interface

### Controls
- **Width input**: Set maze width
- **Height input**: Set maze height
- **Save Dimensions button**: Apply new dimensions
- **Generate New Maze button**: Create a new maze
- **Solve Maze button**: Find and display solution path

### Visual Elements
- Maze grid with black walls
- Green square: Entrance (top-left)
- Red square: Exit (bottom-right)
- Blue line: Solution path (when solved)

## Technical Constants
- `CELL_SIZE`: 20 pixels (defines the size of each cell in the maze)
- Default maze dimensions: 20x20 cells

## CSS Modules
The project uses CSS Modules for styling, with classes defined in `MazeGenerator.module.css`:
- Responsive layout with flex containers
- Styled buttons with hover effects
- Consistent spacing and alignment
- Color-coded buttons for different actions

## Error Handling
- ✓ Input validation for maze dimensions
- ✓ Alert for invalid dimensions (≤ 0)
- ✓ Fallback handling for path finding when no solution exists

## Future Improvements
- [ ] Add animation for maze generation process
- [ ] Implement different maze generation algorithms
- [ ] Add multiple solving algorithms
- [ ] Add difficulty levels
- [ ] Add mobile responsiveness
- [ ] Add maze saving/loading functionality
- [ ] Add step-by-step solution visualization

## Technologies Used
- ⚛️ React
- 📘 TypeScript
- 🎨 HTML Canvas
- 🎯 CSS Modules
- ⚡ Next.js

## Requirements
- Node.js
- npm/yarn
- Modern web browser with canvas support
