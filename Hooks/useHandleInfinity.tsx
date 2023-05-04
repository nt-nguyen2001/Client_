import { PaginationI } from '@Types/pagination.type';
import { useRef, useEffect, useState } from 'react';

function useHandleInfinity({
  fnFetch,
  limit,
  initialsPagination,
  el,
  type = 'straight',
  //update?
  enabled = true,
}: {
  fnFetch: (pagination: PaginationI) => void;
  limit: number | 'infinity' | 'full';
  initialsPagination: { limit: number; offset: number };
  el: HTMLElement | Document | null;
  type: 'straight' | 'reverse';

  enabled?: boolean;
}) {
  const pagination = useRef<PaginationI>(initialsPagination);
  useEffect(() => {
    pagination.current = initialsPagination;
  }, [initialsPagination.offset]);
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const handleInfinityScroll = async (e: Event) => {
      const target = e.target;
      const offset = pagination.current.offset + pagination.current.limit;
      let position = (target as HTMLElement)?.scrollTop;
      let isFetch = false;
      if (target instanceof Document) {
        isFetch = Math.round(window.scrollY + window.innerHeight) >= target.body.offsetHeight - 100;
        position = target.body.scrollTop;
      } else {
        const t = target as HTMLElement;
        isFetch = Math.round(t.clientHeight + t.scrollTop) >= t.scrollHeight - 100;
      }

      setScrollPosition(position);
      if (isFetch && enabled) {
        if ((offset < limit || limit === 'infinity') && limit !== 'full') {
          pagination.current.offset = offset;
          fnFetch(pagination.current);
        }
      }
    };
    const handleReverseInfiniteScroll = async (e: Event) => {
      const offset = pagination.current.offset + pagination.current.limit;
      const target = e.target;
      let isFetch = false;
      let position = (target as HTMLElement)?.scrollTop;
      if (target instanceof Document) {
        isFetch = Math.round(window.scrollY) <= 100;
        position = target.body.scrollTop;
      } else {
        const t = target as HTMLElement;
        isFetch = Math.round(t.scrollTop) <= 100;
      }
      setScrollPosition(position);
      if (isFetch && enabled) {
        if ((offset < limit || limit === 'infinity') && limit !== 'full') {
          pagination.current.offset = offset;
          fnFetch(pagination.current);
        }
      }
    };
    if (el) {
      el.addEventListener('scroll', type === 'straight' ? handleInfinityScroll : handleReverseInfiniteScroll);
    }

    return () => {
      el?.removeEventListener(
        'scroll',
        type === 'straight' ? handleInfinityScroll : handleReverseInfiniteScroll
      );
    };
  }, [el, limit, fnFetch, enabled]);

  return { current: scrollPosition };
}

export default useHandleInfinity;
