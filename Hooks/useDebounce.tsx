import { useRef } from 'react';

function useDebounce() {
  const typingTimeout = useRef<any>();
  function debounce(fn: Function, wait: number) {
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => fn(), wait);
  }
  function ClearTimeOut() {
    clearTimeout(typingTimeout.current);
  }
  return { debounce, ClearTimeOut };
}

export { useDebounce };
