import { Devvit, useState, useAsync } from '@devvit/public-api';
import Cell from "./Cell.js";
import { CreatePost } from './CreatePost.js';
import { Context } from '@devvit/public-api';

interface ShapeProps {
  selectedCells: { row: number, col: number, color: string }[];
  firstCell: [number, number] | null;
  setView: (view: 'board' | 'shape' | 'instructions' | 'answer' | null) => void;
  isSolved: boolean;
  postType: string;
  
}


const GRID_SIZE = 31;
const CONTAINER_SIZE = 280;

const Shape = ({ selectedCells, firstCell, setView, isSolved,postType }: ShapeProps, context: Context): JSX.Element => {
  const [userSelectedCells, setUserSelectedCells] = useState<{ row: number, col: number, order: number }[]>([]);


  // Calculate bounds 
  const rows = selectedCells.map(cell => cell.row);
  const cols = selectedCells.map(cell => cell.col);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);


  const currentCell = userSelectedCells[userSelectedCells.length - 1];
  const isCompleted = userSelectedCells.length === selectedCells.length;

  const handleCellClick = (row: number, col: number) => {

    // Find if clicked cell exists in current path
    const existingIndex = userSelectedCells.findIndex(cell =>
      cell.row === row && cell.col === col
    );

    // Handle path truncation
    if (existingIndex !== -1) {
      // If the clicked cell is the last one, remove it
      if (existingIndex === userSelectedCells.length - 1) {
        setUserSelectedCells(prev => prev.slice(0, existingIndex));
      } else {
        // If the clicked cell is not the last one, truncate the path
        setUserSelectedCells(prev => prev.slice(0, existingIndex + 1));
      }
      return;
    }

    // Validate first cell or adjacency
    if (userSelectedCells.length === 0) {
      if (firstCell?.[0] === row && firstCell?.[1] === col) {
        setUserSelectedCells([{ row, col, order: 1 }]);
      }
      return;
    }

    // Check adjacency using Manhattan distance
    const lastCell = userSelectedCells[userSelectedCells.length - 1];
    if (Math.abs(lastCell.row - row) + Math.abs(lastCell.col - col) !== 1) return;

    // Update path
    setUserSelectedCells(prev => [...prev, { row, col, order: prev.length + 1 }]);
  };

  const postId = context.postId;
  const userId = context.userId;

  const [userIdDb] = useState(
    async () => {
      const userIdDb = await context.redis.hGet(`post:${postId}`, 'userId') || "not present";
      return userIdDb;
    }
  );

  if (isCompleted && userIdDb !== userId && !isSolved) {
    console.log("isSolved ",isSolved)
    const updateScore = async () => {
      const userName = await context.reddit.getCurrentUsername();
      let userScore = await context.redis.zScore('leaderboard', `${userName}`);

      if (userScore === undefined) {
        userScore = 0;
      }
      await context.redis.zAdd(
        'leaderboard',
        { member: `${userName}`, score: userScore + 10 }
      );
    }

    const updateSolvedPosts = async () => {
      const postId = context.postId;
      const userId = context.userId;
      const postSolved = await context.redis.hGet(`user:${userId}`, 'solvedPosts') || "not present";

      if (postSolved === "not present") {
        await context.redis.hSet(`user:${userId}`, {
          'solvedPosts': JSON.stringify([postId])
        })
      } else {
        const solvedPosts = JSON.parse(postSolved);
        if(!solvedPosts.includes(postId)){
          solvedPosts.push(postId);
          await context.redis.hSet(`user:${userId}`, {
            'solvedPosts': JSON.stringify(solvedPosts)
          })
        }
      }

      isSolved=true;

    }

    updateSolvedPosts();
    updateScore();
  }


  // Generate grid cells 
  const gridCells = [];
  for (let row = minRow; row <= maxRow; row++) {
    const rowCells = [];
    for (let col = minCol; col <= maxCol; col++) {
      const selectedCell = userSelectedCells.find(c => c.row === row && c.col === col);
      const isSelected = !!selectedCell;
      const originalCell = selectedCells.find(c => c.row === row && c.col === col)
      const isActive = currentCell !== undefined && ((((Math.abs(currentCell.row - row) + Math.abs(currentCell.col - col) < 2) && (selectedCells.find(c => c.row === row && c.col === col) !== undefined)) || (userSelectedCells.find(c => c.row === row && c.col === col) !== undefined)))
        ? true : false;
      ;

      rowCells.push(
        <Cell
          key={`${row}-${col}`}
          row={row}
          col={col}
          backgroundColor={isSelected ? "KiwiGreen-50" : originalCell?.color || "transparent"}
          onPress={() => handleCellClick(row, col)}
          borderColor={isSelected ? "KiwiGreen-200" : "#2c3b50"}
          borderWidth={isSelected ? "thick" : "none"}
          disabled={isCompleted || (!!currentCell && !isActive)}
          isSelected={isSelected}
          order={selectedCell?.order}
        />
      );
    }
    gridCells.push(<hstack key={`row-${row}`}>{rowCells}</hstack>);
  }

 
  return (
    <>
      <text color="white" size="large" alignment='top center'>Solve the puzzle!</text>
      <spacer height="3px" />
      <zstack
        height={`${CONTAINER_SIZE}px`}
        width={`${CONTAINER_SIZE}px`}
        alignment='middle center'
        gap='medium'
      >
        <vstack>{gridCells}</vstack>
        {isCompleted && (
          <vstack
            backgroundColor="rgba(44,59,80,0.9)"
            width="100%"
            height="100%"
            alignment="middle center"
            gap='medium'
          >
            <text color="white" size="xxlarge">Congratulations🎉🎉🎉!</text>
            {(isSolved && postType === 'drawing') ? <text color="white" size="large">You have already solved this puzzle!</text>
              : <text color="white" size="large">Create Post and get 10 points!</text>
            }
          </vstack>
        )}
      </zstack>
      {userIdDb === "not present"
        ?
        <hstack width="100%" gap="medium" padding="medium" alignment='middle center'>
          <hstack width="130px" height="40px" alignment='middle center' backgroundColor="#242738" cornerRadius="medium" onPress={() => setView(null)}><text weight='bold' size='medium' color='#ffffff'>Cancel</text></hstack>
          <CreatePost userSelectedCells={userSelectedCells} selectedCells={selectedCells} firstCell={firstCell} isCompleted={isCompleted} />
        </hstack>
        :
        <hstack width="130px" height="40px" alignment='middle center' backgroundColor="#242738" cornerRadius="medium" onPress={() => setView('answer')}><text weight='bold' size='medium' color='#ffffff'>Give Up</text></hstack>
      }

    </>
  );
};

export default Shape;