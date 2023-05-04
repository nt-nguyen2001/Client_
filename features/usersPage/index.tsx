import { Image } from '@Components/Image';
import { TextInput } from '@Components/Input/TextInput';
import PostModal from '@Components/Modal/PostModal';
import Post from '@Components/Post';
import { IconLoading } from '@Components/icons/iconloading';
import useAuthentication from '@Hooks/useAuthentication';
import useGetPosts from '@Hooks/useGetPosts';
import useHandleInfinity from '@Hooks/useHandleInfinity';
import useUser from '@Hooks/useUser';
import { FetchResponse } from '@Types/Comments/index';
import { FCDelete, FCEdit, FCPost, PostsProps } from '@Types/Post/Post.type';
import { User, UserPage } from '@Types/User/User.type';
import { PaginationI } from '@Types/pagination.type';
import { PostsSkeleton } from '@features/homePage/Components/skeleton';
import { useMutation } from '@tanstack/react-query';
import { usePostsMutation } from '@utils/Post/usePostsMutation';
import { CreatePosts, GetPostsByUserId } from 'Apis/posts.api';
import { useRouter } from 'next/router';
import { queryClient } from 'pages/_app';
import { createContext, useCallback, useMemo, useState } from 'react';
import { FriendsContainer } from './Components/Friends/FriendsContainer';
import TopPage from './Top';
import styles from './usersPage.module.scss';
import { TypeReactions } from '@Types/Reactions';
import clsx from 'clsx';

interface IUsersContext {
  handlePost: FCPost;
  handleDelete: FCDelete;
  handleEdit: FCEdit;
}

export const UsersPageContext = createContext<IUsersContext>({} as IUsersContext);

function UsersPage() {
  // React-query makes re-render multiple
  // https://stackoverflow.com/questions/72834988/react-query-makes-component-to-rerender-multiple-times

  const router = useRouter();

  const initialsPagination = { limit: 15, offset: 0 };

  const AuthenticationQuery = useAuthentication({});
  const { DeletePost, EditPost } = usePostsMutation();
  const userName = router.query.userName as string | undefined;
  const userQuery = useUser(userName || '');
  const userPost = useGetPosts(
    userName || '',
    { _userId: AuthenticationQuery.data?._userId || '' },
    initialsPagination
  );

  const FetchPostsMutation = useMutation<
    FetchResponse<{
      posts: PostsProps[];
      _numberOfPosts: number;
    }>,
    unknown,
    Pick<User, '_userName' | '_userId'> & PaginationI
  >({
    mutationFn: (props) => {
      return GetPostsByUserId(props._userName, props._userId, { limit: props.limit, offset: props.offset });
    },
    onSettled: (res) => {
      if (res?.status !== 200) {
        throw new Error(res?.message);
      }
      const { payload } = res;

      queryClient.setQueryData<{
        posts: PostsProps[];
        _numberOfPosts: number;
      }>(['userPosts', userName], (prev) => {
        return {
          _numberOfPosts: payload?._numberOfPosts || prev?._numberOfPosts || 0,
          posts: [...(prev?.posts ?? []), ...(payload?.posts || [])],
        };
      });
    },
  });

  const handleFetchPosts = async (pagination: PaginationI) => {
    FetchPostsMutation.mutate({
      _userId: AuthenticationQuery.data?._userId || '',
      _userName: userName || '',
      ...pagination,
    });
  };

  const infinity = useHandleInfinity({
    fnFetch: (pagination) => {
      handleFetchPosts(pagination);
    },
    initialsPagination,
    limit: userPost.data?._numberOfPosts || 0,
    type: 'straight',
    el: document,
    enabled: !FetchPostsMutation.isLoading,
  });
  const [isModal, setIsModal] = useState(false);

  const isYou = useMemo(
    () => AuthenticationQuery.data?._userName === router.query.userName,
    [router.query.userName, AuthenticationQuery.data?._userName]
  );

  const CreatePostMutation = useMutation<
    FetchResponse<UserPage[]>,
    unknown,
    Required<Omit<PostsProps, 'currentComments' | 'type_reaction' | 'viewer_actor' | 'reactionId'>>
  >({
    mutationFn: (payload) => {
      queryClient.setQueryData<{
        posts: PostsProps[];
        _numberOfPosts: number;
      }>(['userPosts', userName], (prev) => {
        const post: PostsProps = {
          ...payload,
          currentComments: 0,
          type_reaction: 0 as TypeReactions, // @@ bug
          viewer_actor: { _userId: '' },
          reactionId: '',
        };

        return {
          _numberOfPosts: prev?._numberOfPosts ?? 0,
          posts: [post, ...(prev?.posts ?? [])],
        };
      });

      handleShowModal();
      return CreatePosts(payload);
    },
    onSuccess: (data) => {
      if (data.status !== 200) {
        throw new Error(data.message);
      }
    },
  });

  const handleShowModal = useCallback(() => {
    setIsModal((prev) => !prev);
  }, []);

  const handlePost: FCPost = useCallback((payload) => {
    CreatePostMutation.mutate(payload);
  }, []);

  const handleEdit: FCEdit = useCallback(
    (props) => {
      EditPost(props, ['userPosts', userName || '']);
    },
    [userName]
  );

  const handleDelete = useCallback(
    (id: string) => {
      DeletePost({ id, keys: ['userPosts', userName || ''] });
    },
    [userName]
  );
  if (!userQuery.data && !userQuery.isFetching) {
    return (
      <main className={clsx(styles['wrapper'], 'h-screen flex items-center justify-center')}>
        {
          // eslint-disable-next-line react/no-unescaped-entities
          <div className="pt-16 text-white ">This content isn't available at the moment</div>
        }
      </main>
    );
  }
  return (
    <>
      {(isModal && (
        <PostModal
          _userId={AuthenticationQuery.data?._userId ?? ''}
          cb={handlePost}
          CloseModal={handleShowModal}
          title="Create post"
          type="add"
          _name={userQuery.data?._name || ''}
          avatar={userQuery.data?.avatar || ''}
        />
      )) ||
        null}
      <main className={styles['wrapper']}>
        <TopPage
          _name={userQuery.data?._name}
          _userId={userQuery.data?._userId}
          _toUserName={userQuery.data?._userName || ''}
          avatar={userQuery.data?.avatar}
          background_img={userQuery.data?.background_img}
          disabled={isYou ? false : true}
        />
        <div className="flex flex-col gap-5 lg:flex-row justify-center">
          <div className={styles['main']}>
            <FriendsContainer _userId={userQuery.data?._userId || ''} />
            {/* <div className="py-2 px-4 mt-8 border-y-2 border-[#65676b]">
              <p>Photos</p>
            </div> */}
          </div>

          <div className="bottom items-center flex flex-col justify-start lg:pt-0">
            {isYou ? (
              <div className={styles['wrapper-post']}>
                {userQuery.data?.avatar ? (
                  <Image
                    src={userQuery.data.avatar}
                    alt=""
                    width="40px"
                    height="40px"
                    className="rounded-full "
                  />
                ) : null}
                <TextInput
                  editable={false}
                  submit={() => {}}
                  onClick={handleShowModal}
                  className={styles['post-inp']}
                  placeholder="What's on your mind?"
                />
              </div>
            ) : null}
            {/*Post Skeleton */}
            <div className="w-full  flex flex-col gap-5 pb-3 md:w-[600px]">
              {userPost.data?.posts ? (
                <>
                  {userPost.data?.posts?.map((props) => (
                    <Post
                      {...props}
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                      key={props._postsId}
                    />
                  ))}
                  {FetchPostsMutation.isLoading && (
                    <IconLoading width="40px" height="40px" className="m-auto" />
                  )}
                </>
              ) : (
                <>
                  <PostsSkeleton />
                  <PostsSkeleton />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default UsersPage;
