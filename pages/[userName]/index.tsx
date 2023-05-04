import LoggedPages from '@HOCs/LoggedPages';
import UsersPageOverView from '../../features/usersPage/pages/usersPage.page';

function Users() {
  return (
    <LoggedPages>
      <UsersPageOverView />
    </LoggedPages>
  );
}

export default Users;
