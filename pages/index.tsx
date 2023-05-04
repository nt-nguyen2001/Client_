import LoggedPages from '@HOCs/LoggedPages';
import { HomePageOverView } from '../features/homePage/pages/homePage.page';

const Home = () => {
  return (
    <LoggedPages>
      <HomePageOverView />
    </LoggedPages>
  );
};

export default Home;
