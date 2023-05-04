import LoadingPage from '@features/LoadingPage';
import useAuthentication from '@Hooks/useAuthentication';
import { useRouter } from 'next/router';

function LoggedPages({ children }: { children: JSX.Element }) {
  const { data, isLoading, isError } = useAuthentication({});

  const router = useRouter();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError || data?._userId === undefined || data?._userId === null) {
    if (typeof window !== 'undefined') {
      router.replace('/Login');
    }
    return null;
  }

  return children;
}

export default LoggedPages;
