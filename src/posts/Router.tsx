import { Devvit} from '@devvit/public-api';
import Home from './Home.js'



const Router = (): JSX.Element => {


  return (
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
      <Home/>
    </zstack>
  );
};

export default Router;