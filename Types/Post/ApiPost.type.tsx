import { Posts } from './Post.type';

export interface ICreatePost extends Omit<Posts, '_images'> {
  _images?: string[][];
}
export interface IEditPost {
  newImages: string[][];
  dirtyImages: string[];
  id: string;
  content: string;
  _userId: string;
}
