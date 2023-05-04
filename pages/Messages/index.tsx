import { MessagesPageOverView } from '@features/Messages/pages/messagesPage.page';
import LoggedPages from '@HOCs/LoggedPages';

export default function Messages() {
  return (
    <LoggedPages>
      <MessagesPageOverView />
    </LoggedPages>
  );
}
