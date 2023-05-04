import NoneLoggedPages from '@HOCs/NoneLoggedPages';
import { LoginPageOverView } from '../../features/Authentication/pages/loginPage.page';

export default function Login() {
  return (
    <NoneLoggedPages>
      <LoginPageOverView />
    </NoneLoggedPages>
  );
}
