import { CheckExistedUserName, UpdateInfoUser } from '@Apis/user.api';
import Button from '@Components/Button';
import Skeleton from '@Components/Skeleton';
import { IconPen } from '@Components/icons/iconPen';
import useAuthentication from '@Hooks/useAuthentication';
import { useDebounce } from '@Hooks/useDebounce';
import { FetchResponse } from '@Types/Comments';
import { UserAuthentication } from '@Types/User/User.api';
import { UserData } from '@Types/User/User.type';
import clsx from 'clsx';
import moment from 'moment';
import { queryClient } from 'pages/_app';
import { useState } from 'react';
import styles from '../userSetting.module.scss';
import stylesGeneral from './general.module.scss';

type SettingT = {
  key: keyof UserData;
  data?: string;
  isChecked?: boolean;
};

type SettingList = {
  content: string;
  isNotEditable?: boolean;
  isRequired?: boolean;
  pattern?: RegExp;
  example?: string;
  length?: number;
} & SettingT;

const General = () => {
  const [currentItem, setCurrentItem] = useState<Partial<SettingT & { isCallAPi: boolean }>>({
    data: undefined,
    key: undefined,
    isCallAPi: undefined,
    isChecked: undefined,
  });
  const [error, setError] = useState<string>();
  const auth = useAuthentication({});
  const { debounce, ClearTimeOut } = useDebounce();

  const [settings, setSettings] = useState<SettingList[]>([
    {
      key: '_name',
      content: 'Name',
      data: auth.data?._name || '',
      isRequired: true,
      pattern: /[^a-zA-Z0-9_^\s]|^\W|\w(?=\s{2,})|[_]$|\w(?=[_]{2,})/g,
      example: 'Nguyen Van A, Nguyen_Van_A',
      length: 50,
    },
    {
      key: '_userName',
      content: 'Username',
      data: auth.data?._userName,
      isRequired: true,
      pattern: /[^a-zA-Z0-9.-]|^\W|[.]$|[-]$|[-]{2,}|[.]{2,}/g,
      example: 'nguyen.van.a',
      length: 36,
      isChecked: true,
    },
    {
      key: '_account',
      content: 'Email',
      data: auth.data?._account,
      isNotEditable: true,
    },
    { key: '_createAt', content: 'Joining date', data: auth.data?._createAt || '', isNotEditable: true },
    {
      key: '_phoneNumber',
      content: 'Phone number',
      data: auth.data?._phoneNumber,
      example: '0123456789',
      isRequired: true,
      pattern: /\D+/g,
      length: 10,
    },
  ]);

  const handleSubmit = (props: SettingList) => {
    if (props?.isRequired && !props.data?.trim()) {
      setError(`Please fill in your full ${props.content}`);
      return;
    }
    if (props.length && props.data && props.data.length > props.length) {
      setError(`${props.content} length is exceeds ${props.length} characters.`);
      return;
    }

    if (props.pattern && props.data && props.data!.trim().match(props.pattern)?.length) {
      setError(`Please fill correctly your ${props.content}.E.g: ${props.example}`);
      return;
    }
    if (!currentItem.isCallAPi) {
      return;
    }

    setSettings((prev) => {
      prev.map((setting) => {
        if (setting.key === props.key) {
          if (setting.data !== props.data) {
            UpdateInfoUser({
              [props.key]: props.data,
              _userId: auth.data?._userId,
            });
            queryClient.setQueryData<FetchResponse<UserAuthentication[]>>(['authentication'], (prev) => {
              prev?.payload?.map((auth) => {
                if (props.data) {
                  auth[props.key] = props.data;
                }
              });
              return prev;
            });
          }
          setting.data = props.data?.trim();
        }
      });
      return prev;
    });

    setCurrentItem({});
    setError(undefined);
  };

  const handleChange = (props: SettingList) => {
    setCurrentItem({ data: props.data, key: props.key });
    if (props.key === '_userName') {
      const setting = settings.find((setting) => setting.key === '_userName');
      if (props.data && props.data === setting?.data) {
        ClearTimeOut();
        setError(undefined);
        setCurrentItem((prev) => {
          return { ...prev, isCallAPi: false, isChecked: setting?.isChecked };
        });
        return;
      }
      debounce(async () => {
        if (props.data) {
          const res = await CheckExistedUserName({ _userName: props.data });
          if (res.status !== 200) {
            setError(res.message);
            setCurrentItem((prev) => {
              return { ...prev, isCallAPi: false, isChecked: setting?.isChecked };
            });
          } else {
            setError(undefined);
            setCurrentItem((prev) => {
              return { ...prev, isCallAPi: true, isChecked: setting?.isChecked };
            });
          }
        }
      }, 500);
    }
  };
  return (
    <section className={clsx(styles['main'])}>
      <h1 className="text-xl">General Account Settings</h1>
      <section className={styles['settings-list']}>
        {settings.map((item, index) => (
          <div
            key={item.key}
            className={styles['settings-item']}
            onClick={() => {
              if (!item.isNotEditable && currentItem.key !== item.key) {
                setCurrentItem({ data: item.data, key: item.key, isChecked: item.isChecked });
                setError(undefined);
              }
            }}
          >
            <div
              className={clsx(styles['settings-item-wrapper'], {
                [styles['settings-item-active']]: currentItem.key === item.key,
              })}
            >
              <p>{item.content}</p>
              {item.data !== undefined ? (
                <>
                  {currentItem.key === item.key ? (
                    <div>
                      <form
                        className={stylesGeneral['container']}
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit({ ...item, data: currentItem.data });
                        }}
                      >
                        <input
                          className={clsx(styles['inp'])}
                          defaultValue={currentItem.data}
                          autoFocus
                          onChange={(e) => {
                            handleChange({ ...item, data: e.target.value });
                          }}
                        />
                        <div className={stylesGeneral['btn']}>
                          <Button
                            type="secondary"
                            className={clsx(styles['btn_saveChanges'], {
                              [styles['inActive']]: currentItem.isChecked
                                ? !currentItem.isCallAPi
                                  ? true
                                  : false
                                : false,
                            })}
                            hover
                          >
                            Save changes
                          </Button>
                          <p
                            className={stylesGeneral['btn_close']}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentItem({});
                              setError(undefined);
                            }}
                          >
                            close
                          </p>
                        </div>
                      </form>
                      {error && <p className="pt-3 text-red-500 text-sm">{error}</p>}
                    </div>
                  ) : (
                    <p>{item.key === '_createAt' ? moment(item.data).format('DD/MM/YYYY') : item.data}</p>
                  )}
                </>
              ) : (
                <Skeleton type="text" width="200px" height="30px" />
              )}

              {!item.isNotEditable && (
                <p className={clsx(styles['btn'])}>
                  <IconPen width="13px" className={styles['icon']} /> Edit
                </p>
              )}
            </div>
          </div>
        ))}
      </section>
    </section>
  );
};
export { General };
