import { FC } from 'react';
import DefaultLayout from '../DefaultLayout';
import RegisterPage from '../register';

export const RegisterPageOverView: FC = () => {
  return (
    <DefaultLayout type='Login' path='/Login'>
      <RegisterPage />
    </DefaultLayout>
  );
};
