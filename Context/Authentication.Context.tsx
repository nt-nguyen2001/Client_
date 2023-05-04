import { CheckLogin, LogOut, RefreshToken } from 'Apis/authentication.api';
import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import Router from 'next/router';
import defaultAvatar from '@public/images/defaultAvatar.png';
import defaultBg from '@public/images/backgroundDefault.jpg';
import { User } from '@Types/User/User.type';
export type UserAuthentication = Pick<
  User,
  '_userId' | '_name' | '_userName' | 'avatar' | 'background_img' | 'role'
>;

type TAuthentication = UserAuthentication & {
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<UserAuthentication>>;
  handleLogOut: () => void;
};
const AuthenticationContext = createContext<TAuthentication>({} as TAuthentication);
export default AuthenticationContext;

const AuthenticationProvider = ({ children }: { children: JSX.Element }) => {
  // const [user, setUser] = useState<UserAuthentication>({
  //   _name: '',
  //   _userId: '',
  //   _userName: '',
  //   avatar: '',
  //   background_img: '',
  //   role: '',
  // });
  // const [isLoading, setIsLoading] = useState(true);
  // const handleLogOut = () => {
  //   LogOut();
  //   setUser({} as User);
  //   Router.push('/Login');
  // };
  // useEffect(() => {
  //   CheckLogin()
  //     .then((res) => {
  //       const userDefault = {
  //         role: '',
  //         _userName: '',
  //         avatar: '',
  //         background_img: '',
  //         _userId: '',
  //         _name: '',
  //       };
  //       const { role, _userName, avatar, background_img, _userId, _name } = res.payload?.[0] || userDefault;

  //       switch (res.status) {
  //         case 200:
  //           setUser({
  //             _userId,
  //             _userName,
  //             avatar: avatar ?? defaultAvatar,
  //             background_img,
  //             role,
  //             _name,
  //           });
  //           break;
  //         case 400:
  //           RefreshToken()
  //             .then((res) => {
  //               const { role, _userName, avatar, background_img, _userId, _name } =
  //                 res.payload?.[0] || userDefault;
  //               if (res.status === 200) {
  //                 if (res.payload?.token) {
  //                   localStorage.setItem('accessToken', res.payload.token.accessToken);
  //                   localStorage.setItem('refreshToken', res.payload.token.refreshToken);
  //                 }
  //                 setUser({
  //                   _userId,
  //                   _userName,
  //                   avatar: avatar ?? defaultAvatar,
  //                   background_img: background_img ?? defaultBg,
  //                   role,
  //                   _name,
  //                 });
  //               }
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             });
  //           break;
  //         default:
  //           console.log('Internal server error');
  //           break;
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //     });
  // }, []);

  return (
    // <AuthenticationContext.Provider value={{ ...user, isLoading, setUser, handleLogOut }}>
    // </AuthenticationContext.Provider>
    { children }
  );
};

export { AuthenticationProvider };
