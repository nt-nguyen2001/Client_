// import { ToUser } from '@Components/Comment';
import { Image } from '@Components/Image';
import { TextInput } from '@Components/Input/TextInput';
import bg from '@public/images/defaultAvatar.png';
import decodeHtml from '@utils/decodeHTML';
import encodeHTMl from '@utils/escapeHtml';
import FocusInput from '@utils/FocusInput';
import { StaticImageData } from 'next/image';
import { forwardRef, HTMLAttributes, memo, MutableRefObject, useEffect, useRef } from 'react';
import styles from './input.module.scss';

export type TComment = { id: string; index?: number };
interface FormProps extends HTMLAttributes<HTMLFormElement> {
  avatar: string | StaticImageData;
  isSpace?: boolean;
  content?: string;
  _to: {
    _parentId: string | null;
    _toUserName: null | string;
    _toId: null | string;
    _userNameTag?: null | string;
  };
  postComment: (content: string, isTagName: boolean) => void;
}
const InputComment = forwardRef<HTMLDivElement, FormProps>(function InputComment(
  { _to, postComment, avatar, isSpace, content },
  refProp
) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    FocusInput(ref, _to?._toUserName ? true : false, _to?._toUserName, styles['tag']);
  }, [_to]);

  return (
    <div className={styles['wrapper']}>
      <div className="self-start">
        <Image src={avatar || bg} alt="" height="32px" width="32px" className="rounded-full " />
      </div>
      <div className="flex-1 ml-2">
        <TextInput
          ref={ref}
          className={styles['input']}
          placeholder="write a comment..."
          submit={(encodeContent: string) => {
            postComment(encodeContent, (ref.current?.childNodes.length ?? 0) > 1 ? true : false);
          }}
          dangerouslySetInnerHTML={{ __html: content ? decodeHtml(content) : '' }}
        />
      </div>
    </div>
  );
});

export default memo(InputComment);
