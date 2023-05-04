import { IconPen } from '@Components/icons/iconPen';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import styles from '../../userSetting.module.scss';
import { PasswordComp } from './Components/Password';

type rowT = 'passwordComp';

const Security = () => {
  const [row, setRow] = useState<rowT>();

  const rows: {
    title: string;
    icon: JSX.Element;
    contentBtn: string;
    type: rowT;
    comp: JSX.Element;
  }[] = [
    {
      title: 'Change password',
      icon: (
        <IconPen
          width="13px"
          className={clsx(styles['icon'], styles['btn'])}
          style={{
            position: 'unset',
            transform: 'none',
            display: 'unset',
          }}
        />
      ),
      contentBtn: 'Edit',
      type: 'passwordComp',
      comp: <PasswordComp />,
    },
  ];

  return (
    <section className={clsx(styles['main'])}>
      <h1 className="text-xl">Security </h1>
      <section className={styles['settings-list']}>
        <div className={styles['settings-item']}>
          {rows.map((r, idx) => (
            <Fragment key={idx}>
              <div
                className={clsx(styles['settings-item-wrapper'], {
                  [styles['settings-item-active']]: r.type === row ? true : false,
                })}
                onClick={() => {
                  setRow(r.type);
                }}
              >
                <p>{r.title}</p>
                <div className="flex items-center">
                  {r.icon}
                  <p
                    className={clsx(styles['btn'], 'inline ml-2')}
                    onClick={(e) => {
                      if (row === r.type) {
                        e.stopPropagation();
                        setRow(undefined);
                      }
                    }}
                  >
                    {row === r.type ? 'Close' : r.contentBtn}
                  </p>
                </div>
              </div>
              {row === r.type && r.comp}
            </Fragment>
          ))}
        </div>
      </section>
    </section>
  );
};
export { Security };
