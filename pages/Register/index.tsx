import NoneLoggedPages from '@HOCs/NoneLoggedPages';
import { RegisterPageOverView } from '../../features/Authentication/pages/registerPage.page';

function Register() {
  return (
    <NoneLoggedPages>
      <RegisterPageOverView />
    </NoneLoggedPages>
  );
}

export default Register;
