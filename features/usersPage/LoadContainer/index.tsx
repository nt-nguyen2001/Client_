import Loading from '@Components/Loading';
import useAuthentication from '@Hooks/useAuthentication';
// import AuthenticationContext from '@Context/Authentication.Context';
import useUpload from '@Hooks/useUpload';
import { useMutation } from '@tanstack/react-query';
import { FetchResponse } from '@Types/Comments/index';
import { UserData } from '@Types/User/User.type';
import { UpdateUser } from 'Apis/user.api';
import { useRouter } from 'next/router';
import { queryClient } from 'pages/_app';
import { useEffect, useState } from 'react';

function LoadContainer({ files, type }: { files?: File[]; type: 'avatar' | 'background_img' }) {
  const { percent, urls, Upload } = useUpload();

  const [loaded, setLoaded] = useState(0);

  const router = useRouter();
  const authentication = useAuthentication({});
  const userName = router.query.userName as string;

  const UploadMutation = useMutation<FetchResponse<UserData[]>, unknown, string>({
    mutationFn: (image) => UpdateUser(authentication.data?._userId || '', { [type]: image }),
    onSuccess: (data) => {
      if (data.status !== 200) {
        throw new Error(data.message);
      }
      queryClient.setQueryData(['authentication'], data.payload?.[0]);

      // if (userName === authentication.data?._userName) {
      //   queryClient.invalidateQueries(['user', userName]);
      // }
    },
  });
  // solve users close window browser while upload Images
  useEffect(() => {
    if (urls.length === files?.length) {
      const image = urls[0];
      UploadMutation.mutate(image);

      setLoaded(0);
    }
  }, [urls]);
  useEffect(() => {
    // if (typeof percent.loaded === 'object') {
    //   const loaded = Object.values(percent.loaded);
    //   if (loaded.length) {
    //     const total = loaded.reduce((prev, curr) => {
    //       return prev + curr;
    //     }, 0);
    //   }
    // }
    setLoaded(Math.floor((percent.loaded * 100) / percent.total));
  }, [percent.loaded]);
  useEffect(() => {
    if (files) {
      Upload(files, {});
    }
  }, [files]);
  return <>{(loaded && <Loading width={loaded} />) || null}</>;
}

export { LoadContainer };
