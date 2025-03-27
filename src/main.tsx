// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import Router from "./posts/Router.js"

Devvit.configure({
  redditAPI: true,
  redis: true
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Connect-Boxes',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Submitting your post - upon completion you'll navigate there.");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Connect the boxes to solve the puzzle!',
      subredditName: subreddit.name,
      // The preview appears while the post loads
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
      ),
    });
    ui.navigateTo(post);
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Connect Boxes',
  height: 'tall',
  render: Router
});



export default Devvit;