import { GetPostByPostId } from '@Apis/posts.api';
import Post from '@Components/Post';
import useAuthentication from '@Hooks/useAuthentication';
import { FCEdit } from '@Types/Post/Post.type';
import { useQuery } from '@tanstack/react-query';
import { MergerImageIntoPost } from '@utils/Post/MergeImagesIntoPost';
import { usePostsMutation } from '@utils/Post/usePostsMutation';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import styles from './postPage.module.scss';
import clsx from 'clsx';

const POST = 'post';

function PostPage() {
  const router = useRouter();
  const _postsId = router.query.id as string;

  const authentication = useAuthentication({});

  const { data, isFetching } = useQuery({
    queryKey: [POST, router.query.id || ''],
    queryFn: async () => {
      const res = await GetPostByPostId({
        _postsId,
        viewer_actor: authentication.data?._userId || '',
      });
      if (res.status !== 200) {
        throw new Error(res.message);
      }
      const posts = MergerImageIntoPost(res?.payload || []);

      return { posts };
    },
    refetchOnMount: 'always',
    keepPreviousData: true,
    enabled: _postsId && authentication?.data?._userId ? true : false,
  });

  const { DeletePost, EditPost } = usePostsMutation();

  const handleDelete = (id: string) => {
    DeletePost({ id, keys: [POST, (router.query.id as string) || ''] });
    router.push('/');
  };

  const handleEdit: FCEdit = useCallback((props) => {
    EditPost(props, [POST, (router.query.id as string) || '']);
  }, []);

  if (!data?.posts.length && !isFetching) {
    return (
      <main className={clsx(styles['main'], 'h-screen flex items-center justify-center')}>
        {
          // eslint-disable-next-line react/no-unescaped-entities
          <div className="pt-16 text-white ">This content isn't available at the moment</div>
        }
      </main>
    );
  }
  return (
    <main className={styles['main']}>
      <div className="max-w-[590px] m-auto">
        {data ? <Post {...data.posts[0]} handleDelete={handleDelete} handleEdit={handleEdit} /> : null}
      </div>
    </main>
  );
}

export default PostPage;
