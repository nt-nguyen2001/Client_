import Button from '@Components/Button';
import { Image } from '@Components/Image';
import { TextInput } from '@Components/Input/TextInput';
import useAuthentication from '@Hooks/useAuthentication';
// import AuthenticationContext from '@Context/Authentication.Context';

import defaultAvatar from '@public/images/defaultAvatar.png';
import { FCEdit, FCPost, PostsProps } from '@Types/Post/Post.type';
import { UserPage } from '@Types/User/User.type';
import FocusInput from '@utils/FocusInput';
import clsx from 'clsx';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { v4 as uuid } from 'uuid';
import ImagesComponent from './Components/Images';
import LoadContainer from './Components/Load';
import styles from './PostModal.module.scss';

// type FCEdit = (props: propsEdit) => void;
interface IPostModal {
  cb: FCPost | FCEdit;
  CloseModal: () => void;
  type: 'add' | 'update';
  title: string;
}

function PostModal({
  cb,
  CloseModal,
  title,
  type,
  _postsId = '',
  _content = '',
  _images = [],
  _userId = '',
  avatar = '',
  _name = '',
  _userName,
}: IPostModal & Partial<PostsProps> & Partial<Pick<UserPage, 'avatar' | '_name'>>) {
  const [images, setImages] = useState<(File | string)[]>(_images || []);
  const [isPost, setIsPost] = useState(false);
  const [content, setContent] = useState(_content);
  const authentication = useAuthentication({});
  const dirtyImages = useRef<string[]>([]);
  const id = useRef<string>(_postsId || uuid().toString());
  const handleImages = useCallback((files: File[]) => {
    setImages(files);
  }, []);
  const handleDeleteImage = useCallback((index: number) => {
    setImages((prev) => {
      const newFiles: (File | string)[] = prev.filter((file, oldIndex) => {
        if (oldIndex !== index) {
          return true;
        } else {
          if (typeof file === 'string') {
            dirtyImages.current.push(file);
          }
          return false;
        }
      });
      return newFiles;
    });
  }, []);
  const handlePost = () => {
    setIsPost(true);
  };
  const ref = useRef<HTMLDivElement>(null);
  const handleExit = () => {
    if (type === 'update') {
      (cb as FCEdit)({
        dirty: false,
        content,
        id: _postsId,
        newImages: [],
        dirtyImages: [],
        _userId,
      });
    } else {
      CloseModal();
    }
  };
  useEffect(() => {
    if (ref.current && content) {
      FocusInput(ref, false);
    } else {
      ref.current?.focus();
    }
  }, []);

  return (
    <div className={clsx(styles['wrapper'])}>
      {(isPost && (
        <LoadContainer
          folder={id.current}
          cb={(urls) => {
            if (type === 'update') {
              (cb as FCEdit)({
                dirty: true,
                newImages: [...(urls || [])],
                dirtyImages: dirtyImages.current,
                id: _postsId,
                content: content,
                _userId,
              });
            } else {
              const post: Omit<
                PostsProps,
                'currentComments' | 'viewer_actor' | 'type_reaction' | 'reactionId'
              > = {
                _postsId: id.current,
                _createAt: new Date().toISOString(),
                _content: content || '',
                _images: urls,
                numberOfComments: 0,
                _userName: authentication.data?._userName || '',
                numberOfReactions: 0,
                _name,
                avatar,
                _userId,
              };
              (cb as FCPost)(post);
            }
          }}
          files={
            images.filter((image) => {
              if (image instanceof File) return image;
            }) as File[]
          }
        />
      )) ||
        null}
      <div className={clsx(styles['modal'])}>
        <IoMdClose className={styles['icon-close']} onClick={handleExit} />
        <div className={styles['modal_bg']}>
          <div className={styles['modal_image']}>
            <p className={styles['title']}>{title}</p>
            <Button
              className={styles['btn']}
              padding="0"
              onClick={() => handlePost()}
              disabled={!content?.trim() && !images?.length}
            >
              Share
            </Button>
          </div>
          <div className={styles['modal_content']}>
            <ImagesComponent
              handleSetImages={handleImages}
              handleDeleteImage={handleDeleteImage}
              _images={_images}
            />
            <div className={styles['container']}>
              <div className="top flex flex-col h-full">
                <div className="flex ">
                  <div className={styles['image']}>
                    <Image
                      src={avatar || defaultAvatar}
                      alt=""
                      className="rounded-full"
                      width="28px"
                      height="28px"
                    />
                  </div>
                  <p className="lg:text-lg">{_name}</p>
                </div>
                <div className="flex-1 mt-5  max-h-full">
                  <TextInput
                    ref={ref}
                    className={styles['input']}
                    reset={false}
                    handleChange={(content) => {
                      setContent(content);
                    }}
                    placeholder="What's on your mind?"
                    submit={() => handlePost()}
                    content={_content}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed top-0 w-screen h-screen bg-[#00000078]" onClick={handleExit}></div>
    </div>
  );
}

export default memo(PostModal);
