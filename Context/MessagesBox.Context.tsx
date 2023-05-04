import { MessagesBoxI } from '@Types/MessagesBox';
import { RefObject, useEffect } from 'react';
import { useRef } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

type Box = (props: { props: MessagesBoxI }) => void;
type MinimizeBox = (props: MessagesBoxI) => void;

interface MessagesBoxContextI {
  messageBoxes: MessagesBoxI[];
}
interface MessagesBoxFunctionContextI {
  handleAddBox: Box;
  handleCloseBox: Box;
  handleMinimizeBox: MinimizeBox;
  handleOpenBox: Box;
  ref: RefObject<HTMLDivElement>;
}

const MessagesBoxContext = createContext<MessagesBoxContextI>({} as MessagesBoxContextI);
const MessagesBoxFunctionContext = createContext<MessagesBoxFunctionContextI>(
  {} as MessagesBoxFunctionContextI
);

export const MessagesBoxProvider = ({ children }: { children: JSX.Element }) => {
  const [messageBoxes, setMessageBoxes] = useState<MessagesBoxI[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const PERCENT = 0.6;
  useEffect(() => {
    const handleResize = () => {
      setMessageBoxes((prev) => {
        let numberOfBoxes = 0;
        let isChanged = false;
        if (ref.current) {
          const node = ref.current.childNodes[0] as HTMLDivElement;
          if (node.classList.contains('boxWrapper')) {
            numberOfBoxes = Math.floor((document.body.clientWidth * PERCENT) / node.offsetWidth);
          }
        }

        prev.map((box, index) => {
          if (index >= numberOfBoxes) {
            box.opened = false;
            isChanged = true;
          } else {
            if (!box.opened) {
              box.opened = true;
              isChanged = true;
            }
          }
        });
        if (isChanged) {
          return [...prev];
        }
        return prev;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
  const MiddlewareAddedBox = (prev: MessagesBoxI[], box: MessagesBoxI) => {
    let numberOfBoxes = 0;
    if (ref.current) {
      const node = ref.current.childNodes[0] as HTMLDivElement;
      if (node.classList.contains('boxWrapper')) {
        numberOfBoxes = Math.floor((document.body.clientWidth * PERCENT) / node.offsetWidth);
      }
    }
    prev.map((box, index) => {
      if (index >= numberOfBoxes - 1) {
        box.opened = false;
      }
    });
    return [box, ...prev];
  };
  const handleAddBox: Box = ({ props }) => {
    setMessageBoxes((prev) => {
      let box: MessagesBoxI = {} as MessagesBoxI;
      const boxes = prev.filter((oldBox) => {
        if (oldBox._userId !== props._userId) {
          return box;
        }
        box = oldBox;
        return false;
      });
      if (!box?._name) {
        return MiddlewareAddedBox(prev, props);
      } else {
        if (!box.opened) {
          box.opened = true;
          return MiddlewareAddedBox(boxes, box);
        }
      }
      return prev;
    });
  };

  const handleCloseBox: Box = ({ props: { _userId } }) => {
    setMessageBoxes((prev) => prev.filter((box) => box._userId !== _userId));
  };

  const handleMinimizeBox: MinimizeBox = ({ _userId, ...props }) => {
    setMessageBoxes((prev) =>
      prev.map((box) => {
        if (box._userId === _userId) {
          return { _userId, ...props };
        }
        return box;
      })
    );
  };

  const handleOpenBox: Box = ({ props }) => {
    setMessageBoxes((prev) => {
      const newBoxes = prev.filter((box) => box._userId !== props._userId);
      return MiddlewareAddedBox(newBoxes, { ...props, opened: true });
    });
  };

  const memo = useMemo(() => ({ handleAddBox, handleMinimizeBox, handleCloseBox, handleOpenBox, ref }), []);

  return (
    <MessagesBoxContext.Provider value={{ messageBoxes }}>
      <MessagesBoxFunctionContext.Provider value={memo}>{children}</MessagesBoxFunctionContext.Provider>
    </MessagesBoxContext.Provider>
  );
};

export const useMessageBoxesContext = () => useContext(MessagesBoxContext);
export const useMessageBoxesContextFunction = () => useContext(MessagesBoxFunctionContext);
