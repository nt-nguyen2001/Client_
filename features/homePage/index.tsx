import { GetPosts } from '@Apis/posts.api';
import { IconLoading } from '@Components/icons/iconloading';
import Post from '@Components/Post';
import Skeleton from '@Components/Skeleton';
import useAuthentication from '@Hooks/useAuthentication';
import useHandleInfinity from '@Hooks/useHandleInfinity';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FetchResponse } from '@Types/Comments';
import { PaginationI } from '@Types/pagination.type';
import { FCEdit, PostsProps } from '@Types/Post/Post.type';
import { User } from '@Types/User/User.type';
import { MergerImageIntoPost } from '@utils/Post/MergeImagesIntoPost';
import { usePostsMutation } from '@utils/Post/usePostsMutation';
import { queryClient } from 'pages/_app';
import { useCallback, useState, useEffect, useRef } from 'react';
import Contact from '../layout/components/Contact';
import SideBar from '../layout/components/Sidebar';
import { PostsSkeleton } from './Components/skeleton';
import styles from './homePage.module.scss';

const POSTS = 'posts';

function HomePage() {
  const authentication = useAuthentication({});

  const initialsPagination = { limit: 15, offset: 0 };

  const { data } = useQuery({
    queryKey: [POSTS],
    queryFn: async () => {
      const response = await GetPosts({ _userId: authentication.data?._userId || '', ...initialsPagination });
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      const { payload } = response;
      return { posts: payload?.posts, _numberOfPosts: payload?._numberOfPosts };
    },
  });

  const FetchPostsMutation = useMutation<
    FetchResponse<{
      posts: PostsProps[];
      _numberOfPosts: number;
    }>,
    unknown,
    Pick<User, '_userId'> & PaginationI
  >({
    mutationFn: (props) => {
      return GetPosts(props);
    },
    onSettled: (res) => {
      if (res?.status !== 200) {
        throw new Error(res?.message);
      }

      queryClient.setQueryData<{
        posts: PostsProps[];
        _numberOfPosts: number;
      }>([POSTS], (prev) => {
        return {
          _numberOfPosts: res.payload?._numberOfPosts || prev?._numberOfPosts || 0,
          posts: [...(prev?.posts ?? []), ...(res.payload?.posts || [])],
        };
      });
    },
  });

  const pagination = useHandleInfinity({
    fnFetch: (pagination) => {
      handleFetchPosts(pagination);
    },
    limit: data?._numberOfPosts || 0,
    initialsPagination,
    el: document,
    type: 'straight',
    enabled: !FetchPostsMutation.isLoading,
  });

  const { DeletePost, EditPost } = usePostsMutation();

  const handleFetchPosts = async (pagination: PaginationI) => {
    FetchPostsMutation.mutate({ _userId: authentication.data?._userId || '', ...pagination });
  };

  const handleDelete = useCallback((id: string) => {
    DeletePost({ id, keys: [POSTS] });
  }, []);

  const handleEdit: FCEdit = useCallback((props) => {
    EditPost(props, [POSTS]);
  }, []);

  return (
    <div className={styles['main']}>
      <SideBar />
      <Contact />
      <main className={styles['wrapper']}>
        <div className="w-full flex flex-col gap-5 pb-3 max-w-[600px]">
          {data ? (
            <>
              {data?.posts?.map((post) => (
                <Post
                  {...post}
                  key={post._postsId}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  isYouProp={post._userName}
                />
              ))}
              {FetchPostsMutation.isLoading && <IconLoading width="40px" height="40px" className="m-auto" />}
            </>
          ) : (
            <>
              <PostsSkeleton />
              <PostsSkeleton />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
