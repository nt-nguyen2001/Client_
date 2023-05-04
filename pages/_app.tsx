import { MessagesBoxProvider } from '@Context/MessagesBox.Context';
import { SocketProvider } from '@Context/Socket.Context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import { DetectProvider } from '../Context/DetectElement.Context';
import ThemeProvider from '../Context/Theme.Context';
import '../styles/globals.css';
import { CookiesProvider } from 'react-cookie';
import { CallingHoc } from '@HOCs/Calling.Hocs';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 60000 * 5,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DetectProvider>
          <CookiesProvider>
            <SocketProvider>
              <MessagesBoxProvider>
                <CallingHoc>
                  <Component {...pageProps} />
                </CallingHoc>
              </MessagesBoxProvider>
            </SocketProvider>
          </CookiesProvider>
        </DetectProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
