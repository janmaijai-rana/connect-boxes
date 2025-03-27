import { Devvit, Context } from '@devvit/public-api';
import Cell from './Cell.js';

interface AnswerCell {
    row: number;
    col: number;
    order: number;
}

interface AnswerProps {
    answer: AnswerCell[];
    setView: (view: 'board' | 'shape' | 'instructions' | 'leaderboard' | 'answer' | null) => void;
    isSolved: boolean;
}




const Answer = ({ answer, setView, isSolved }: AnswerProps, context: Context): JSX.Element => {

    const rows = answer.map(cell => cell.row);
    const cols = answer.map(cell => cell.col);
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);

    // Generate grid cells 
    const gridCells = [];
    for (let row = minRow; row <= maxRow; row++) {
        const rowCells = [];
        for (let col = minCol; col <= maxCol; col++) {
            const answerCell = answer.find(c => c.row === row && c.col === col);
            const isPresent = !!answerCell;
            rowCells.push(
                <Cell
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    backgroundColor={isPresent ? "KiwiGreen-50" : "transparent"}
                    onPress={() => { }}
                    borderColor={isPresent ? "KiwiGreen-200" : "#2c3b50"}
                    borderWidth={isPresent ? "thick" : "none"}
                    disabled={true}
                    isSelected={isPresent}
                    order={answerCell?.order}
                />
            );
        }
        gridCells.push(<hstack key={`row-${row}`}>{rowCells}</hstack>);
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
            if (!solvedPosts.includes(postId)) {
                solvedPosts.push(postId);
                await context.redis.hSet(`user:${userId}`, {
                    'solvedPosts': JSON.stringify(solvedPosts)
                })
            }
        }

        isSolved = true;

    }
    updateSolvedPosts();

    return (
        <>
            <zstack
                height={`280px`}
                width={`280px`}
                alignment='middle center'
                gap='medium'
            >
                <vstack>{gridCells}</vstack>
                <vstack
                    backgroundColor="rgba(44,59,80,0.9)"
                    width="100%"
                    height="100%"
                    alignment="middle center"
                    gap='medium'
                >
                    <text color="white" size="large">You have already solved this puzzle!</text>
                </vstack>
            </zstack>
            <hstack width="150px" height="40px" backgroundColor='#8a2be2' cornerRadius='medium' onPress={() => setView('board')} alignment='middle center'><text weight='bold' size='medium' color='#ffffff'>Create</text></hstack>
        </>
    );
};

export default Answer;

