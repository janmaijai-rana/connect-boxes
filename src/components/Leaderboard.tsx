import { Devvit, Context, useAsync, useState } from '@devvit/public-api';
import { Service } from '../service.js';


type LeaderboardScore = {
    member: string;
    score: number;
}


interface Props {
    setView: (view: 'board' | 'shape' | 'instructions' | null) => void;
}


const renderLeaderboard = (context: Context): JSX.Element[] => {

    const userId = context.userId;
    const service = new Service(context);

    const { data, loading } = useAsync<{
        leaderboard: LeaderboardScore[];
        user: {
            name: string;
            score: number;
            rank: number;
        };
    }>(async () => {
        try {
            return {
                leaderboard: await service.getUsersData(),
                user: await service.getCurrentUserData(),
            };
        } catch (error) {
            if (error) {
                console.error('Error loading leaderboard data', error);
            }
            return {
                leaderboard: [],
                user: { name: '', score: 0, rank: -1 }
            };
        }
    });

    let leaderboard = [];

    if (loading || data === null) {
        leaderboard.push(
            <hstack width="60%" height="60%" alignment='middle center'>
                <text size='large' color='#ffffff'>Loading...</text>
            </hstack>
        );
        return leaderboard;
    }

    for (let i = 0; i < data.leaderboard.length; i++) {
        leaderboard.push(
            <hstack width="100%">
                <text size='medium' color='#ffffff'>{i + 1}.</text>
                <spacer width="5px" />
                <text size='medium' color='#ffffff'>{data.leaderboard[i].member}</text>
                <spacer grow={true} />
                <text size='medium' color='#ffffff'>{data.leaderboard[i].score}</text>
            </hstack>
        );
    }


    leaderboard.push(
        <hstack width="100%">
            <text size='medium' color='#ffffff'>{data.user.rank}.</text>
            <spacer width="5px" />
            <text size='medium' color='#ffffff'>{data.user.name}</text>
            <spacer grow={true} />
            <text size='medium' color='#ffffff'>{data.user.score}</text>
        </hstack>
    );
    return leaderboard;
}


const Leaderboard = ({ setView }: Props, context: Context): JSX.Element => {
    return (
        <vstack width="100%" height="100%" backgroundColor="#2c3b50" padding='medium' gap='medium' alignment='middle center'>
            <text weight='bold' size='xxlarge' alignment='top center' color='#ffffff'>Leaderboard</text>
            {renderLeaderboard(context)}
            <hstack width="130px" height="40px" alignment='middle center' backgroundColor="#242738" cornerRadius="medium" onPress={() => setView(null)}><text weight='bold' size='medium' color='#ffffff'>Back</text></hstack>
        </vstack>
    );
};

export default Leaderboard;