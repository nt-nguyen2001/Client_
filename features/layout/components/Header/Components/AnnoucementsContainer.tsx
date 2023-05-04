import { Image } from '@Components/Image';
// import AnnouncementContext, { AnnouncementData } from '@Context/Announcement.Context';
import DetectContext from '@Context/DetectElement.Context';
import { useDetailedAnnouncements } from '@Hooks/useDetailedAnnouncements';
import defaultAvatar from '@public/images/defaultAvatar.png';
import { AnnouncementProps, TypeLink } from '@Types/Announcements';
import clsx from 'clsx';
import moment from 'moment';
import Link from 'next/link';
import { Dispatch, memo, SetStateAction, useCallback, useContext, useEffect, useRef, useState } from 'react';
import styles from '../header.module.scss';
import { NotificationsSkeleton } from './NotificationsSkeleton';

function AnnouncementsContainer({ setIsOpen }: { setIsOpen: Dispatch<SetStateAction<boolean>> }) {
  const { isError, isFetching, data, ReadAnnouncements } = useDetailedAnnouncements();
  const { element } = useContext(DetectContext);
  const [heightScrollBar, setHeightScrollBar] = useState({
    scrollBar: 0,
    background: 0,
  });
  const [percentScrollBar, setPercentScrollBar] = useState(0);
  const arrSkeleton = [1, 2, 3, 4, 5];
  const refMenu = useRef<HTMLDivElement | null>(null);
  const positionMouseDown = useRef<number>(0);
  const prevPosition = useRef<{
    position: number;
    drag: boolean;
    scrollHeight: number;
    heightScrollBar: number;
    scrollPercent: number;
  }>({
    position: 0,
    drag: false,
    scrollHeight: 0,
    heightScrollBar: 0,
    scrollPercent: 0,
  });

  const dragMove = useCallback((e: any) => {
    const x = refMenu.current!.getBoundingClientRect().x;

    const scrollBarPosition = prevPosition.current.position + e.clientY - positionMouseDown.current;

    prevPosition.current.drag = true;

    const scrollPercent = (scrollBarPosition * refMenu.current!.scrollHeight) / refMenu.current!.offsetHeight;

    prevPosition.current.scrollPercent = scrollBarPosition;

    const percent = prevPosition.current!.scrollHeight - refMenu.current!.offsetHeight;

    if (scrollPercent <= percent && scrollPercent >= 0) {
      setPercentScrollBar((prev) => {
        refMenu.current?.scrollTo(x, scrollPercent);
        return scrollBarPosition + scrollPercent;
      });
    }
  }, []);
  const dragEnd = useCallback((e: any) => {
    prevPosition.current.drag = false;
    prevPosition.current.position = prevPosition.current.scrollPercent;
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
  }, []);

  useEffect(() => {
    if (element) {
      if (
        element.nextSibling !== refMenu.current &&
        element !== refMenu.current &&
        !refMenu.current?.contains(element)
      ) {
        setIsOpen(false);
      }
    }
  }, [element]);

  useEffect(() => {
    if (refMenu.current) {
      const height =
        refMenu.current.clientHeight / (refMenu.current.scrollHeight / refMenu.current.clientHeight);
      setHeightScrollBar({
        scrollBar: height,
        background: refMenu.current.scrollHeight,
      });
      prevPosition.current.heightScrollBar = height;
      refMenu.current.addEventListener('scroll', (e) => {
        if (prevPosition.current.drag === false) {
          const ev = e.target as HTMLDivElement;
          const percent = (ev.scrollTop * refMenu.current!.offsetHeight) / refMenu.current!.scrollHeight;
          prevPosition.current.position = percent;
          setPercentScrollBar(percent + ev.scrollTop);
        }
      });
      prevPosition.current.scrollHeight = refMenu.current.scrollHeight;
    }
  }, []);

  function GenerateLink(item: AnnouncementProps) {
    let link = '#';
    switch (Number(item._typeLink)) {
      case TypeLink.Post:
        link = `/Post/${item._idLink}`;
        break;
      case TypeLink.User:
        link = `${item._idLink}`;
        break;
    }
    return link;
  }

  return (
    <section className={styles['notifications_wrapper']} draggable="false" ref={refMenu}>
      <h1 className={styles['h1']}>Notifications</h1>
      <section className={styles['notifications']}>
        {isFetching
          ? arrSkeleton.map((item, idx) => <NotificationsSkeleton key={idx} />)
          : data?.map((item, index) => (
              <Link href={GenerateLink(item)} key={item._idAnnouncement}>
                <a
                  onClick={() => {
                    ReadAnnouncements(item._idAnnouncement);
                  }}
                >
                  <div
                    className={clsx(styles['item'], {
                      [styles['unread']]: !Number(item.state),
                    })}
                  >
                    <div className={styles['image']}>
                      <Image
                        src={item?.avatar ?? defaultAvatar}
                        alt=""
                        width="73px"
                        height="73px"
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="flex">
                        <p className={styles['content']}>
                          <span className={styles['name']}>{item._name} </span>
                          {item._type}
                        </p>
                      </div>
                      <p className={clsx(styles['time'])}>
                        {moment(
                          moment(item._createAt).format('YYYYMMDD hh:mm:ss a'),
                          'YYYYMMDD HH:mm:ss a'
                        ).fromNow()}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
      </section>
      {heightScrollBar.scrollBar !== heightScrollBar.background ? (
        <>
          <div
            className={styles['scrollBar-wrapper']}
            style={{
              height: `${heightScrollBar.background}px`,
            }}
          ></div>
          <div
            className={clsx(styles['scrollBar'])}
            onMouseDown={(e) => {
              e.preventDefault();
              positionMouseDown.current = e.clientY;
              document.addEventListener('mousemove', dragMove);
              document.addEventListener('mouseup', dragEnd);
            }}
            style={{
              height: `${heightScrollBar.scrollBar}px`,
              transform: `translateY(${percentScrollBar}px)`,
            }}
          ></div>
        </>
      ) : null}
    </section>
  );
}

export default memo(AnnouncementsContainer);
