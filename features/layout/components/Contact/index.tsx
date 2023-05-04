import { CONTACT } from '@Constant/Contact';
import { useMessageBoxesContextFunction } from '@Context/MessagesBox.Context';
import defaultAvatar from '@public/images/defaultAvatar.png';
import commonStyles from '@styles/commonStyle.module.scss';
import { useQuery } from '@tanstack/react-query';
import { OnlineStatus } from '@Types/Friends/index.type';
import Image from 'next/image';
import { memo } from 'react';
import styles from './contact.module.scss';

function Contact() {
  const { data } = useQuery<OnlineStatus[]>({
    queryKey: [CONTACT],
    queryFn: () => {
      return [];
    },
    enabled: false,
  });

  const { handleAddBox } = useMessageBoxesContextFunction();

  return (
    <div className={styles['wrapper']}>
      <div className={styles['top']}>
        <p className="font-bold pr-5">Contacts</p>
      </div>
      <div className="flex flex-col  pt-10 text-white">
        {data?.map((user) => (
          <div
            className="flex items-center gap-5 p-4 hover:bg-[#ffffff1a] rounded-md cursor-pointer transition-all duration-300"
            key={user._userId}
            onClick={() =>
              handleAddBox({
                props: {
                  ...user,
                  avatar: user.avatar ?? defaultAvatar,
                  opened: true,
                  _state: true,
                  _idConversations: user._idFriends,
                },
              })
            }
          >
            <div className="relative w-[36px] h-[36px]">
              <Image
                src={user.avatar ?? defaultAvatar}
                width="100%"
                height="100%"
                className="rounded-full"
                alt=""
              />
              <span className={commonStyles['online']}></span>
            </div>
            <p>{user._name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(Contact);
