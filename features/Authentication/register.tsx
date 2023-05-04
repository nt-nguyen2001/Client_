import { SearchInput } from '@Components/Input/SearchInput';
import { User } from '@Types/User/User.type';
import { toastConfig } from '@utils/toastConfig';
import { Register } from 'Apis/authentication.api';
import { mailRegister } from 'Apis/mail.api';
import Router from 'next/router';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { CheckUserExists } from '../../Apis/user.api';
import Button from '../../Components/Button';
import useFormValidation from '../../Hooks/useFormValidation';
import styles from './authentication.module.scss';
import { IconSoftLoading } from '@Components/icons/iconSoftLoading';

interface Input {
  type: string;
  placeholder: string;
  key: any;
}
const inputArray: { type: string; placeholder: string; key: keyof UserRegister }[] = [
  {
    type: 'text',
    placeholder: 'Enter email or user name',
    key: '_account',
  },
  {
    type: 'text',
    placeholder: 'Create User Name',
    key: '_name',
  },
  {
    type: 'text',
    placeholder: 'Contact Number',
    key: '_phoneNumber',
  },
  {
    type: 'password',
    placeholder: 'Password',
    key: '_password',
  },
];
interface UserRegister extends Omit<User, 'role' | 'avatar' | 'background_img'> {
  otp: string;
}
function RegisterPage() {
  const { data, handleChange, handleSubmit, handleBlur, errors, setErrors } = useFormValidation<UserRegister>(
    {
      validations: {
        _account: {
          pattern: {
            value:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "That email address doesn't look right!",
          },
          required: {
            value: true,
            message: 'Choose a Gmail address',
          },
        },
        _name: {
          required: {
            value: true,
            message: 'Enter a user name',
          },
        },
        _phoneNumber: {
          required: {
            value: true,
            message: 'Enter a phone number',
          },
          pattern: {
            value: /^\d*$/,
            message: 'Only number',
          },
          custom: {
            isValid(value) {
              return value.length === 10;
            },
            message: 'Password only has 10 digits',
          },
        },
        _password: {
          required: {
            value: true,
            message: 'Enter a password',
          },
          custom: {
            isValid(value) {
              return value.length >= 6;
            },
            message: 'Password has at least 6 digits',
          },
        },
        otp: {
          required: {
            value: true,
            message: 'Enter a OTP',
          },
          custom: {
            isValid(value) {
              return value.length === 6;
            },
            message: 'OTP only has 6 digits',
          },
        },
      },
      initial: {
        _name: '',
        _password: '',
        _account: '',
        _phoneNumber: '',
        otp: '',
      },
    }
  );
  const [isFetching, setIsFetching] = useState(false);
  const [countDown, setCountDown] = useState(120);

  const handleUserExists = (params: string = '') => {
    CheckUserExists<User[]>(params)
      .then((res) => {
        if (res.status === 400) {
          setErrors({
            ...errors,
            _account: 'User exists already!',
          });
        }
      })
      .catch((err) => {
        console.log('🚀 ~ file: Register.tsx ~ .then ~ err', err);
      });
  };
  let stateSendMail = false;
  for (const key in errors) {
    if (!data[key as keyof UserRegister] && key !== 'otp') {
      break;
    }
  }
  for (const key in data) {
    if (!data[key as keyof UserRegister] && key !== 'otp') {
      stateSendMail = true;
      break;
    }
    stateSendMail = false;
  }
  const handleSendMail = () => {
    if (!stateSendMail) {
      mailRegister(data._account);
      setCountDown((prev) => prev - 1);
      let timeOut = setInterval(() => {
        setCountDown((prev) => {
          if (prev === 0) {
            clearInterval(timeOut);
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  const handleRegister = () => {
    Register(data)
      .then((res) => {
        switch (res.status) {
          case 400:
            toast.warning('Please enter your information', toastConfig);
            break;
          case 408:
            toast.error(res.message, toastConfig);
            break;
          case 200:
            Router.push(
              {
                pathname: '/Login',
                query: {
                  isRegister: true,
                },
              },
              '/Login'
            );
            break;
          default:
            toast.error('Internal Server Error. Try later!', toastConfig);
            break;
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Internal Server Error. Try later!', toastConfig);
      });
  };
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
          handleSubmit(handleRegister);
        }}
      >
        <div className="mb-11">
          <div className={styles['title']}>Sign Up</div>
          <div className={styles['wrapper']}>
            {inputArray.map(
              (value): JSX.Element => (
                <div className={styles['item']} key={value.key}>
                  <SearchInput
                    {...value}
                    onChange={({ target }) => {
                      handleChange(
                        value.key,
                        value.key === '_account' ? handleUserExists : undefined
                      )(target.value);
                    }}
                    onBlur={handleBlur(value.key)}
                    className={styles['inp']}
                  />
                  {errors[value.key as keyof UserRegister] && (
                    <p className={styles['error']}>{errors[value.key as keyof UserRegister]}</p>
                  )}
                </div>
              )
            )}
            <div className="relative mt-[20px]">
              <SearchInput
                onChange={({ target: { value } }) => {
                  handleChange('otp')(value);
                }}
                onBlur={handleBlur('otp')}
                className={styles['inp']}
                placeholder="OTP"
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleSendMail();
                }}
                className="absolute p-3  right-0 top-0 h-full rounded-r-md  w-[150px]"
                disabled={stateSendMail || countDown !== 120}
              >
                {countDown === 120 ? 'Send Mail' : countDown}
              </Button>
              {errors['otp'] && <p className="absolute -bottom-7 text-sm text-red-500">{errors['otp']}</p>}
            </div>
          </div>
          <div className={styles['forgot']}>Forgor password ?</div>
        </div>
        <Button disabled={Object.keys(errors).length > 0} className="w-full p-3 rounded-lg">
          Register
        </Button>
      </form>
      <ToastContainer pauseOnFocusLoss={false} />
    </>
  );
}

export default RegisterPage;
