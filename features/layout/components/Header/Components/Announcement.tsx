import { useAnnouncements } from '@Hooks/useAnnouncements';

import { forwardRef, memo } from 'react';
import { BsBellFill } from 'react-icons/bs';
import AnnouncementsContainer from './AnnoucementsContainer';
import { Notifications } from './Notifications';

// CHECK RE-RENDER
function Announcement() {
  const { quantity, handleReadAnnouncements } = useAnnouncements();
  const handleShowMenu = () => {
    handleReadAnnouncements();
  };

  return (
    <>
      {
        <Notifications
          ComponentContainer={(props) => <AnnouncementsContainer {...props} />}
          cb={handleShowMenu}
          icon={<BsBellFill />}
          quantity={quantity}
        />
      }
    </>
  );
}

export default memo(Announcement);
