import PostOverView from '@features/postPage/pages/PostOverView';
import LoggedPages from '@HOCs/LoggedPages';

function Post() {
  return (
    <LoggedPages>
      <PostOverView />
    </LoggedPages>
  );
}

export default Post;
