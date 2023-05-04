import MessagesBox from '@features/MessagesBox';
import Header from './Header';

function DefaultLayout({ children }: { children: JSX.Element }) {
  return (
    <div>
      <Header />
      {children}
      <MessagesBox />
    </div>
  );
}

export default DefaultLayout;
