import { PostsProps, PostsReduce } from '@Types/Post/Post.type';

function MergerImageIntoPost(payload: PostsReduce[]) {
  const posts = payload.reduce<PostsProps[]>((prev, curr) => {
    const post = prev.at(-1);
    if (post?._postsId === curr._postsId) {
      post._images = [curr._images, ...(post._images ?? [])];
      return prev;
    }
    const newPost: PostsProps = {
      ...curr,
      _images: curr._images ? [curr._images] : [],
    };
    return [...prev, newPost];
  }, []);

  return posts;
}

export { MergerImageIntoPost };
