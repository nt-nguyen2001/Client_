import React, { FC } from 'react';
import DefaultLayout from '../DefaultLayout';
import LoginPage from '../login';

export const LoginPageOverView: FC = () => {
  return (
    <DefaultLayout type='Register' path='/Register'>
      <LoginPage />
    </DefaultLayout>
  );
};
