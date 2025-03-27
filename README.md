# Connect Boxes

### One Path Connects All ! 

## Inspiration
The inspiration for Connect Boxes came directly from seeing impressive Devvit applications like Pixelary and ChessQuiz thriving within Reddit. Witnessing these engaging games sparked the desire to create my own game using the framework. Therefore I decided to build a puzzle game that was intuitive to learn but offered satisfying depth, specifically designed to be easily playable across platforms (ios, android and web) to attract and engage a wide audience with the fun of puzzle-solving.

## What it does
Connect Boxes is a grid-based puzzle game where the player must draw a single, continuous path starting from a designated green box. Using simple swipe controls (up, down, left, right), the player needs to extend the path to visit every single box on the grid exactly once. The level is won when all the boxes of the entire grid are successfully traversed.

## How we built it
Connect Boxes is developed using Reddit's framework Devvit . The core logic for path tracking, grid state management, input handling (swipe detection), and win condition validation is  written with Typescript. Visual elements for the grid, boxes, and path are created using Devvit's Blocks. Level data (grid dimensions, start position) is stored within Devvit's inbuilt database Redis , allowing for easy creation and expansion. 

## Challenges & Accomplishments
My first idea was to build the game using a WebView, which seemed easier. However, I quickly realized this wouldn't give users a smooth experience. I didn't want players to have to click a button and open a new window just to play. This approach also meant the puzzles wouldn't show up directly in their Reddit feed, and I wasn't sure how it would look on different platforms like iOS, Android, and the web.
So, I decided to use Devvit blocks. Learning Devvit Blocks was much harder for me at the start. It was so challenging that I almost gave up on the project and stopped working on it for a whole week.
But after taking a break, I slowly began to understand how Devvit Blocks works. The official Devvit documentation, Devvit's platform AI and the code for the Pixelary game were all a huge help. My biggest accomplishment is pushing through those difficulties and actually completing the game I almost gave up on.

## What we learned
Never Give Up!  Stay Consistent!  Take a break!  and  Just Do It!

## What's next for Connect Boxes
My immediate plans for Connect Boxes include expanding the content with many more levels, potentially introducing varying grid sizes. I'm also thinking about introducing optional challenges like move limits or time trials. Exploring different visual themes and potentially adding special tile types (like obstacles ) are also future possibilities to add more variety.
