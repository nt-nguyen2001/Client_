import { createContext, useEffect, useState, useCallback, useRef, MutableRefObject, RefObject } from 'react';
interface IDetect {
  element: Node | undefined | null;
  handleSetElement: (el?: Node | null) => void;
  handleRemoveEvent: () => void;
}
const DetectContext = createContext<IDetect>({} as IDetect);

export const DetectProvider = ({ children }: { children: JSX.Element }) => {
  const [element, setElement] = useState<{ target: Node | undefined | null }>({
    target: undefined,
  });
  const handleSetElement = (el?: Node | null) => {
    setElement((prev) => {
      return {
        target: el,
      };
    });
  };
  const detect = useCallback((e: Event) => {
    e.stopPropagation();
    const target = e.target as Node;
    setElement({
      target,
    });
  }, []);
  const handleRemoveEvent = () => {
    document.removeEventListener('click', detect);
  };
  useEffect(() => {
    document.addEventListener('click', detect);
    return () => document.removeEventListener('click', detect);
  }, []);

  return (
    <DetectContext.Provider value={{ element: element?.target, handleSetElement, handleRemoveEvent }}>
      {children}
    </DetectContext.Provider>
  );
};

export default DetectContext;
