import { Devvit, useState } from '@devvit/public-api';

interface Props {
    setView: (view: 'board' | 'shape' | 'instructions' | null) => void;
}

const Instructions = ({ setView }: Props): JSX.Element => {
    return (
        <>
            <vstack height="70%"
                width="280px"
                alignment="middle center" gap='medium'>
                <vstack alignment="center middle">
                    <text color="#ffffff" weight="bold" size="xxlarge">Instructions</text>
                </vstack>
                <vstack alignment="center middle" gap='small'>
                    <text wrap grow={true} size="medium" color="#ffffff">
                        Start Point: Begin at the starting box, which is highlighted in green.
                    </text>
                    <text wrap grow={true} size="medium" color="#ffffff">
                        Movement: Connect to an adjacent box in one of four directions — left, right, up, or down.
                    </text>
                    <text wrap grow={true} size="medium" color="#ffffff">
                        Objective: Continue connecting to adjacent boxes until all cells are connected.
                    </text>
                    <text wrap grow={true} size="medium" color="#ffffff">
                        Completion: Once every cell is connected, the game is over.
                    </text>
                    <text wrap grow={true} size="medium" color="#ffffff">
                        Reward: Successfully connecting all cells awards you 10 points.
                    </text>
                </vstack>
            </vstack>
            <hstack width="130px" height="40px" alignment='middle center' backgroundColor="#242738" cornerRadius="medium" onPress={() => setView(null)}><text weight='bold' size='medium' color='#ffffff'>Back</text></hstack>
        </>
    );
}

export default Instructions;