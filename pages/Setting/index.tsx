import { UserSettingOverView } from '@features/userSetting/pages/UserSettingOverView';
import LoggedPages from '@HOCs/LoggedPages';

function Setting() {
  return (
    <LoggedPages>
      <UserSettingOverView />
    </LoggedPages>
  );
}

export default Setting;
