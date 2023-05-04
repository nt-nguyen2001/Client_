import { ChangePass } from '@Apis/user.api';
import { useState } from 'react';

interface ChangePassI {
  UID: string;
  oldPassword: string;
  newPassword: string;
}

const useChangePass = () => {
  const [isValid, setIsValid] = useState<{ status: number; message: string }>();
  const [isFetching, setIsFetching] = useState(false);
  const changePass = ({ UID, newPassword, oldPassword }: ChangePassI) => {
    setIsFetching(true);
    setIsValid(undefined);
    ChangePass({ UID, oldPassword, newPassword }).then((res) => {
      setIsFetching(false);
      const { message, status } = res;
      setIsValid({
        message,
        status,
      });
    });
  };
  return { isValid, isFetching, changePass };
};
export { useChangePass };
