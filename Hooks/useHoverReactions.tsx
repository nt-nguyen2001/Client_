import { useRef, useEffect } from 'react';
type HoverReactionsProps = { fnEnter: () => void; fnOut: () => void };
function useHoverReactions({ fnEnter, fnOut }: HoverReactionsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timeIn = useRef<NodeJS.Timeout | null>(null);
  const timeOut = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseEnter = () => {
      if (timeOut.current) {
        clearTimeout(timeOut.current);
      }

      timeIn.current = setTimeout(() => {
        fnEnter();
      }, 1000);
    };
    const handleMouseLeave = () => {
      timeOut.current = setTimeout(() => {
        fnOut();
      }, 500);

      if (timeIn.current) {
        clearTimeout(timeIn.current);
      }
    };
    ref.current?.addEventListener('mouseenter', handleMouseEnter);
    ref.current?.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      ref.current?.removeEventListener('mouseenter', handleMouseEnter);
      ref.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { ref };
}

export default useHoverReactions;
