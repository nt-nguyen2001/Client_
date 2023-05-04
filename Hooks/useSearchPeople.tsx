import { SearchUsersByName } from '@Apis/user.api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

function useSearchPeople() {
  const [key, setKey] = useState<string>();
  const { data, isFetching } = useQuery(['searchPeople', key], {
    queryFn: async () => {
      if (key) {
        const res = SearchUsersByName({ userName: key });
        return (await res).payload;
      }
      return undefined;
    },
    enabled: key ? true : false,
  });
  // const [users, setUsers] = useState<Pick<User, '_userId' | '_userName' | 'avatar' | '_name'>[]>();
  // const [isFetching, setIsFetching] = useState(false);
  const searchPeople = ({ userName }: { userName: string }) => {
    setKey(userName);
  };
  return { data, searchPeople, isFetching };
}
export { useSearchPeople };
