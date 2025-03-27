import { Devvit, useAsync, useState } from '@devvit/public-api';
import Board from "../components/Board.js"
import Shape from "../components/Shape.js";
import Instructions from "../components/Instructions.js";
import Leaderboard from '../components/Leaderboard.js';
import Answer from '../components/Answer.js';
import type { Context } from '@devvit/public-api';


const Home = (props: any, context: Context): JSX.Element => {
    const [view, setView] = useState<'board' | 'shape' | 'instructions' | 'leaderboard' | 'answer' | null>(null);
    const [selectedCells, setSelectedCells] = useState<{ row: number, col: number, color: string }[]>([]);
    const [firstCell, setFirstCell] = useState<[number, number] | null>(null);

    const handleBoardSelection = (cells: { row: number, col: number, color: string }[], firstCell: [number, number] | null) => {
        setSelectedCells(cells);
        setFirstCell(firstCell);
        setView('shape');
    };


    const { data } = useAsync(async (): Promise<[string, string, string, string,string,string | null]> => {
        const postId = context.postId;
        const userId = context.userId;
        const selectCells = await context.redis.hGet(`post:${postId}`, 'selectedCells');
        const firstCells = await context.redis.hGet(`post:${postId}`, 'firstCell');
        const postType = await context.redis.hGet(`post:${postId}`, 'postType');
        const answer = await context.redis.hGet(`post:${postId}`, 'answer');
        const postSolved = await context.redis.hGet(`user:${userId}`,'solvedPosts')
        return [postId ?? '', selectCells ?? '', firstCells ?? '', postType ?? '', answer ?? '', postSolved ?? '']; 
    });
    const [postId, selectCells, firstCells, postType, answer,postSolved] = data || [null,null,null,null,null,null]

    let isSolved = false;
    if (postSolved && typeof postSolved === 'string' && postSolved.trim() !== '') { 
        try {
            const solvedPosts = JSON.parse(postSolved);
            if (Array.isArray(solvedPosts) && solvedPosts.includes(postId)) {
                isSolved = true;
            }
        } catch (e) {
            console.error("Error parsing solvedPosts:", e);
        }
    }
        
        

    return (
        <>
            <vstack
                width="304px"
                height="500px"
                cornerRadius='medium'
                backgroundColor='#2c3b50'
                alignment='middle center'
            >
                {postType === 'drawing' ? (
                    
                    (view === 'answer' || isSolved) 
                        ? (<Answer isSolved={isSolved} setView={setView} answer={JSON.parse(answer || '[]')}/>)
                        : (<Shape postType={postType}  isSolved={isSolved} selectedCells={JSON.parse(selectCells)} firstCell={JSON.parse(firstCells)} setView={setView}/>)
                ) : (
                    <>
                        {view === null && (
                            <vstack gap="medium" width="80%" padding='medium' alignment='middle center'>
                                <text weight='bold' outline='thin' size='xxlarge' alignment='top center' color='#ffffff'>Connect Boxes</text>
                                <spacer grow />
                                <vstack grow={true} width="204px" height="75px" backgroundColor='#8a2be2' cornerRadius='medium' onPress={() => setView('board')} alignment='middle center'><text weight='bold' size='xxlarge' color='#ffffff'>Create</text></vstack>
                                <vstack grow={true} width="204px" height="75px" backgroundColor='#e6e6fa' cornerRadius='medium' onPress={() => setView('instructions')} alignment='middle center'><text weight='bold' size='xxlarge' color='#333333'>Instructions</text></vstack>
                                <vstack grow={true} width="204px" height="75px" backgroundColor='#add8e6' cornerRadius='medium' onPress={() => setView('leaderboard')} alignment='middle center'><text weight='bold' size='xxlarge' color='#333333'>Leaderboard</text></vstack>
                            </vstack>
                        )}
                        {view === 'board' && <Board onSelectionComplete={handleBoardSelection} setView={setView} />}
                        {view === 'shape' && <Shape postType={postType || ""} isSolved={isSolved} selectedCells={selectedCells} firstCell={firstCell} setView={setView} />}
                        {view === 'leaderboard' && <Leaderboard setView={setView}/>}
                        {view === 'instructions' && <Instructions setView={setView} />}
                    </>
                )}
            </vstack>
        </>
    );
}

export default Home;