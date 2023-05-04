import LoggedPages from '@HOCs/LoggedPages';
import { PeopleOverView } from '@features/Search/People/pages/PeopleOverView';

function Post() {
  return (
    <LoggedPages>
      <PeopleOverView />
    </LoggedPages>
  );
}

export default Post;
