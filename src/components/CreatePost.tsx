import { Devvit } from '@devvit/public-api';
import type { Context } from '@devvit/public-api';



export const CreatePost = (props: any, context: Context): JSX.Element => {


  const handleCreatePost = async (): Promise<void> => {
    // Check if the user is logged in
    const userId = context.userId;
    const userName = await context.reddit.getCurrentUsername();
    const subredditName = await context.reddit.getCurrentSubredditName();
    if (!userId || !userName) {
      context.ui.showToast('You must be logged in to create a post.');
      return;
    }


    try {
      // Create the post
      const newPost = await context.reddit.submitPost({
        subredditName: subredditName,
        title: "Can you solve this ?",
        preview: (
          <zstack width="100%" height="100%" alignment='middle center'>
            <image
              imageHeight={1080}
              imageWidth={1920}
              height="100%"
              width="100%"
              url="d.png"
              description="Background image"
              resizeMode="cover"
            />
            <image
              url="blocks.gif"
              description="Loading ..."
              imageHeight={1080}
              imageWidth={1920}
              width="128px"
              height="128px"
              resizeMode="scale-down"
            />
          </zstack>
        )
      });

      const newPostId = newPost.id;

      // Store new post data in Redis
      await context.redis.hSet(`post:${newPostId}`, {
        'userId': `${userId}`,
        'userName': `${userName}`,
        'selectedCells': JSON.stringify(props.selectedCells),
        'firstCell': JSON.stringify(props.firstCell),
        'postType': 'drawing',
        'answer': JSON.stringify(props.userSelectedCells)
      });


      // Update the leaderboard
      let userScore = await context.redis.zScore('leaderboard', `${userName}`);

      if (userScore === undefined) {
        userScore = 0;
      }

      await context.redis.zAdd(
        'leaderboard',
        { member: `${userName}`, score: userScore + 10 }
      );

      const updateSolvedPosts = async () => {
        const postId = newPostId;
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
  
      }
  
      updateSolvedPosts();
      context.ui.navigateTo(newPost);


    } catch (error) {
      console.error('Error creating post:', error);
      context.ui.showToast('Failed to create post. Please try again.');
    }
  };

  return (
    <vstack width="130px" height="40px" alignment='middle center' backgroundColor={props.isCompleted ? "KiwiGreen-300" : "KiwiGreen-50"} cornerRadius="medium" onPress={props.isCompleted ? handleCreatePost : () => { }}>
      <text weight='bold' size='medium' color='#ffffff'>Create Post</text>
    </vstack>
  );
};
