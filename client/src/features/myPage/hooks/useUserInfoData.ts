import { useQuery } from '@tanstack/react-query';
import { fetchUserData } from '../apis/fetchUserData';
import {UserInfoDTO} from '@features/user/types/UserInfoDTO'
export const useUserInfoData = (userId: number | null) => {
  return useQuery<UserInfoDTO,Error>({
    queryKey: ['userInfo', userId],
    queryFn: async () => {
      console.log(userId, 'queryFn');
      return await fetchUserData(userId!); // userId가 null이 아닌 경우에만 호출되므로 확정 연산자 사용
    },
    enabled: !!userId, // userId가 존재할 때만 쿼리 실행
  });
};
