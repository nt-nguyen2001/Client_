import { CallPageOverView } from '@features/CallPage/pages/callPage.page';
import LoggedPages from '@HOCs/LoggedPages';

export default function Call() {
  return (
    <LoggedPages>
      <CallPageOverView />
    </LoggedPages>
  );
}
