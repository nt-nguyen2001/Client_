import { MutableRefObject, RefObject } from 'react';

function FocusInput(
  ref: MutableRefObject<HTMLDivElement> | RefObject<HTMLDivElement>,
  isSpace: boolean = true,
  content?: string | null,
  className?: string
) {
  const span = document.createElement('span');
  const range = document.createRange();
  const sel = window.getSelection();
  if (ref.current) {
    if (ref.current.childNodes[0]?.nodeName === 'SPAN') {
      ref.current.childNodes[0].textContent = content || null;
    } else {
      span.innerHTML = content || '';
      if (className) {
        span.classList.add(className);
      }
      span.contentEditable = 'false';
      if (isSpace) {
        ref.current.insertBefore(span, ref.current.childNodes[0]);
        ref.current.innerHTML += '&nbsp;';
      }
    }
    range.setStart(ref.current, ref.current?.childNodes.length);
    range.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}

export default FocusInput;
