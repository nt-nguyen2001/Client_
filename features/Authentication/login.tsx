import { SearchInput } from '@Components/Input/SearchInput';
import { User } from '@Types/User/User.type';
import { toastConfig } from '@utils/toastConfig';
import { Login } from 'Apis/authentication.api';
import clsx from 'clsx';
// import { UserAuthentication } from 'Context/Authentication.Context';
import { IconSoftLoading } from '@Components/icons/iconSoftLoading';
import { useRouter } from 'next/router';
import { queryClient } from 'pages/_app';
import { useState } from 'react';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { toast, ToastContainer } from 'react-toastify';
import Button from '../../Components/Button';
import useFormValidation from '../../Hooks/useFormValidation';
import styles from './authentication.module.scss';

function LoginPage() {
  const { data, handleChange, handleSubmit, handleBlur, errors } = useFormValidation<User>({
    validations: {
      _account: {
        required: {
          value: true,
          message: 'This field is required',
        },
      },
      _password: {
        required: {
          value: true,
          message: 'This field is required',
        },
      },
    },
    initial: {
      _account: '',
      _password: '',
    },
  });
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setIsFetching(true);
    Login({
      _account: data._account,
      _password: data._password,
    })
      .then((res) => {
        setIsFetching(false);
        switch (res.status) {
          case 400:
            toast.warning('Please enter your information', toastConfig);
            break;
          case 401:
            toast.error('The username or password is incorrect', toastConfig);
            break;
          case 200:
            queryClient.setQueryData(['authentication'], res.payload?.user[0]);
            if (res.payload?.token) {
              localStorage.setItem('accessToken', res.payload?.token.accessToken);
              localStorage.setItem('refreshToken', res.payload.token.refreshToken);
            }

            break;
          default:
            toast.error('Internal Server Error. Try later!', toastConfig);
            break;
        }
      })
      .catch((err: Error) => {
        console.log(err);
      });
  };

  if (router.query.isRegister) {
    // console.log('?');
    toast.success('Registered successfully', toastConfig);
    router.query.isRegister = '';
  }
  return (
    <>
      {isFetching && (
        <div className={styles['loading_wrapper']}>
          <IconSoftLoading className={styles['loading_icon']} />
          <p className={styles['loading_content']}>Loading...</p>
        </div>
      )}
      <form
        className="flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleLogin);
        }}
      >
        <div className="mb-11">
          <div className={styles['title']}>Sign In</div>
          <div className={styles['wrapper']}>
            <div className={styles['item']}>
              <SearchInput
                className={clsx(styles['inp'])}
                placeholder="Enter email or user name"
                type="text"
                onChange={({ target: { value } }) => {
                  handleChange('_account')(value);
                }}
                onBlur={handleBlur('_account')}
              />
              {errors._account && <p className={styles['error']}>{errors._account}</p>}
            </div>
            <section className={styles['item']}>
              <SearchInput
                type="password"
                placeholder="password"
                onChange={({ target: { value } }) => {
                  handleChange('_password')(value);
                }}
                onBlur={handleBlur('_password')}
                className={styles['inp']}
              />
              {errors._password && <p className={styles['error']}>{errors._password}</p>}
            </section>
          </div>
          <div className={styles['forgot']}>Forgot password ?</div>
        </div>
        <Button disabled={Object.keys(errors).length > 0} className="w-full p-3 rounded-lg">
          Login
        </Button>
        <div className="mt-14 mb-11 text-center text-gray-400">or continue with</div>
        <div className="flex justify-center align-middle gap-4 ">
          <BsFacebook className="text-blue-500 text-3xl" />
          <FcGoogle className="text-3xl" />
        </div>
      </form>
      <ToastContainer pauseOnFocusLoss={false} />
    </>
  );
}

export default LoginPage;
