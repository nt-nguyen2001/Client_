import Skeleton from '@Components/Skeleton';
import styles from './skeleton.module.scss';

const PostsSkeleton = () => {
  return (
    <section className={styles['main']}>
      <section className="flex items-center">
        <Skeleton type="img" width="50px" height="50px" anim={false} />
        <div className="ml-4">
          <Skeleton type="text" width="120px" height="15px" anim={false} />
          <Skeleton type="text" width="100px" height="15px" className="mt-2" anim={false} />
        </div>
      </section>
      <section className={styles['bottom']}>
        <Skeleton type="text" width="70px" height="15px" anim={false} />
        <Skeleton type="text" width="70px" height="15px" />
        <Skeleton type="text" width="70px" height="15px" />
      </section>
    </section>
  );
};
export { PostsSkeleton };
