import type {
    Post,
    RedditAPIClient,
    RedisClient,
    Scheduler,
    ZRangeOptions,
} from '@devvit/public-api';



type LeaderboardScore = {
    member: string;
    score: number;
}


export class Service {
    readonly redis: RedisClient;
    readonly reddit?: RedditAPIClient;
    readonly scheduler?: Scheduler;

    constructor(context: { redis: RedisClient; reddit?: RedditAPIClient; scheduler?: Scheduler }) {
        this.redis = context.redis;
        this.reddit = context.reddit;
        this.scheduler = context.scheduler;
    }

    async getUsersData():Promise<LeaderboardScore[]>{
        return await this.redis.zRange('leaderboard', 0, 8, {reverse:true, by: 'rank' })
    }

    async getCurrentUserData():Promise<{name:string,score:number,rank:number}>{
        const username = await this.reddit?.getCurrentUsername() || 'Unknown';
        const currUserScore = (await this.redis.zScore('leaderboard', `${username}`)) || 0;
        const totalUsers = await this.redis.zCard('leaderboard');
        const rank = (await this.redis.zRank('leaderboard', `${username}`)) || 0;
        const currUserRank = totalUsers - rank;
        return {name:username,score:currUserScore, rank:currUserRank};
    }  

}  