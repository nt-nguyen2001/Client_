import Button from '@Components/Button';
import clsx from 'clsx';
import styles from '../../../userSetting.module.scss';
import stylesComp from './comp.module.scss';
import { useRef, useState } from 'react';

import useAuthentication from '@Hooks/useAuthentication';
import { IconLoading } from '@Components/icons/iconloading';
import { useChangePass } from '../Hooks/useChangePass';

const PasswordComp = () => {
  const [error, setError] = useState<string>();
  const [isInActive, setIsInActive] = useState(true);
  const pass = useRef<{
    old: string;
    newPass: string;
    retype: string;
  }>({
    old: '',
    newPass: '',
    retype: '',
  });
  const auth = useAuthentication({});
  const { changePass, isFetching, isValid } = useChangePass();

  const btnIsActive = () => {
    const { newPass, old, retype } = pass.current;
    let error = false;
    if (retype && newPass !== retype) {
      setError("Passwords don't match");
      error = true;
    } else {
      setError(undefined);
    }
    if (!newPass || !old || !retype || error) {
      setIsInActive(true);
      return;
    }
    setIsInActive(false);
  };
  const handleSubmit = () => {
    if (auth.data?._userId) {
      changePass({
        UID: auth.data._userId,
        oldPassword: pass.current.old,
        newPassword: pass.current.newPass,
      });
    }
  };

  return (
    <div className="mt-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="cursor-default"
      >
        <div className={stylesComp['container']}>
          <p>Current</p>
          <div className="mb-6 relative">
            <input
              className={clsx(styles['inp'])}
              onChange={({ target: { value } }) => {
                pass.current = { ...pass.current, old: value };
                btnIsActive();
              }}
              type="password"
            />
            {isValid?.message && (
              <p className={stylesComp[isValid.status !== 200 ? 'error' : 'success']}>{isValid.message}</p>
            )}
          </div>
          <p>New</p>
          <input
            className={clsx(styles['inp'])}
            type="password"
            onChange={({ target: { value } }) => {
              pass.current = { ...pass.current, newPass: value };
              btnIsActive();
            }}
          />
          <p>Retype new</p>
          <div className="relative">
            <input
              className={clsx(styles['inp'])}
              type="password"
              onChange={({ target: { value } }) => {
                pass.current = { ...pass.current, retype: value };
                btnIsActive();
              }}
            />
            {error && <p className={stylesComp['error']}>{error}</p>}
          </div>
        </div>
        <Button
          type="secondary"
          className={clsx(
            styles['btn_saveChanges'],
            {
              [styles['inActive']]: isInActive || isFetching,
            },
            'flex items-center'
          )}
          onClick={() => {}}
          disabled={isInActive || isFetching}
          style={{
            margin: '0',
          }}
          hover
        >
          {isFetching && <IconLoading className="mr-2" />}
          Save changes
        </Button>
      </form>
    </div>
  );
};
export { PasswordComp };
