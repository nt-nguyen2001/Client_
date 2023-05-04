import Loading from '@Components/Loading';
import { AlertModal } from '@Components/Modal/AlertModal';
// import AuthenticationContext from '@Context/Authentication.Context';
import { ClosedTabSocket } from '@Class/ClosedTab';
import { FullPageLoading } from '@Components/Loading/FullPageLoading';
import useUpload from '@Hooks/useUpload';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';

function LoadContainer({
  files,
  cb,
  folder,
}: {
  files?: File[];
  cb: (urls: string[]) => void;
  folder?: string;
}) {
  const { percent, urls, Upload } = useUpload();
  const [loaded, setLoaded] = useState(0);
  const router = useRouter();
  const prevPath = useRef<string>();
  const currentURLs = useRef<string[]>([]);
  const [isShowAlertModal, setIsShowAlertModal] = useState(false);
  ClosedTabSocket.getInstance();

  useEffect(() => {
    if (files?.length !== 0 && urls.length === files?.length) {
      ClosedTabSocket.sendURLImages({ urls, max: files.length });
      cb(urls);
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
    // setLoaded(Math.floor((total * 100) / percent.total));
    setLoaded(Math.floor((percent.loaded * 100) / percent.total));
  }, [percent.loaded]);

  useEffect(() => {
    if (files?.length) {
      ClosedTabSocket.sendURLImages({ urls: [], max: files?.length || 0 });
      Upload(files, { folder });
    } else {
      cb([]);
    }
  }, [files]);

  useEffect(() => {
    if (urls.length) {
      currentURLs.current = [...urls];
    }
  }, [urls.length]);

  useEffect(() => {
    router.beforePopState(({ as }) => {
      prevPath.current = as;
      if (as !== router.asPath && currentURLs.current.length < (files?.length || 0)) {
        setIsShowAlertModal(true);
        return false;
      }
      return true;
    });

    return () => {
      ClosedTabSocket.disconnectSocket();
      router.beforePopState(() => true);
    };
  }, []);

  return (
    <>
      <ToastContainer pauseOnFocusLoss={false} />
      {(loaded && (
        <>
          <Loading width={loaded} />
          <FullPageLoading />
        </>
      )) ||
        null}
      {isShowAlertModal && (
        <AlertModal
          selector="#alertPortal"
          cbAccept={() => {
            setIsShowAlertModal(false);
            // currentURLs.current = ['asda'];
            ClosedTabSocket.Leave({ urls, max: files?.length || 0 });
            router.push(prevPath.current || '/');
          }}
          cbCancel={() => {
            setIsShowAlertModal(false);
            history.forward();
          }}
          content="You have unsaved changes that will be lost if you leave the page."
          btnCancel="Continue editing"
          btnAccept="Leave"
        />
      )}
    </>
  );
}

export default LoadContainer;
