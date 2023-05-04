import { DeletePosts, UpdatePost } from '@Apis/posts.api';
import { useMutation } from '@tanstack/react-query';
import { FetchResponse } from '@Types/Comments';
import { IEditPost } from '@Types/Post/ApiPost.type';
import { EditProps, FCEdit, PostsProps, UserPostPayload } from '@Types/Post/Post.type';
import { queryClient } from 'pages/_app';

type DeletedPostProps = {
  keys: string[];
  id: string;
};

type EditedPostProps = {
  keys: string[];
  props: IEditPost & { images: string[] };
};

function usePostsMutation() {
  const DeletePostMutation = useMutation<FetchResponse<{ id: string }>, unknown, DeletedPostProps>({
    mutationFn: ({ id, keys }) => {
      queryClient.setQueryData<{
        posts: PostsProps[];
        _numberOfPosts: number;
      }>(keys, (prev) => {
        const newPosts = prev?.posts?.filter((post) => post._postsId !== id) || [];

        return {
          _numberOfPosts: prev?._numberOfPosts || 0,
          posts: newPosts,
        };
      });

      return DeletePosts(id);
    },

    onSuccess: (data) => {
      if (data.status !== 200) {
        throw new Error(data.message);
      }
    },
  });

  const EditPostMutation = useMutation<FetchResponse<unknown>, unknown, EditedPostProps>({
    mutationFn: ({ keys, props }) => {
      queryClient.setQueryData<{
        posts: PostsProps[];
        _numberOfPosts: number;
      }>(keys, (oldPosts) => {
        if (oldPosts?.posts) {
          const newPosts = oldPosts.posts.map((post) => {
            if (post._postsId === props.id) {
              let currImages = props.images;
              if (props.dirtyImages.length) {
                currImages = [
                  ...currImages,
                  ...post._images.filter((value) => {
                    if (!props.dirtyImages.includes(value)) {
                      return value;
                    }
                    return false;
                  }),
                ];
              } else {
                currImages = [...post._images, ...currImages];
              }
              const newPost: PostsProps = {
                ...post,
                _content: props.content,
                _images: currImages,
              };
              return newPost;
            }
            return post;
          });
          return {
            _numberOfPosts: oldPosts._numberOfPosts,
            posts: newPosts,
          };
        }
        return oldPosts;
      });

      return UpdatePost(props);
    },
    onSuccess: (data) => {
      if (data.status !== 200) {
        throw new Error(data.message);
      }
    },
  });

  function DeletePost(props: DeletedPostProps) {
    DeletePostMutation.mutate(props);
  }

  const EditPost = (
    { dirty, content, id, newImages, dirtyImages, _userId }: Required<EditProps>,
    keys: string[]
  ) => {
    const images = newImages.map((image) => [id, image]);
    console.log(newImages, dirtyImages, images);
    if (dirty) {
      EditPostMutation.mutate({
        keys,
        props: { newImages: images, dirtyImages, id, content, _userId, images: newImages },
      });
    }
  };

  return { DeletePost, EditPost };
}

export { usePostsMutation };
