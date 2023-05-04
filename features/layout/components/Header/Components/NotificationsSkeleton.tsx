import Skeleton from '@Components/Skeleton';

const NotificationsSkeleton = () => {
  return (
    <div className="mb-2 flex items-center">
      <Skeleton type="img" height="50px" width="50px" />
      <div className="ml-2">
        <Skeleton type="text" height="20px" width="250px" />
        <Skeleton type="text" height="15px" width="100px" className="mt-2" />
      </div>
    </div>
  );
};
export { NotificationsSkeleton };
