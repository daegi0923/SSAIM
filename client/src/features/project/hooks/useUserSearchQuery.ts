import { useQuery } from '@tanstack/react-query';
import { userSearchAPI } from '../apis/useSearchAPI';

export const useUserSearchQuery = (
  input: string,
  searchBy: 'userName' | 'userEmail' | 'userNickname',
  enabled: boolean // 검색 버튼 클릭 시에만 요청이 가도록 관리
) => {
  return useQuery({
    queryKey: ['searchResults', input, searchBy],
    queryFn: async () => {
      if (!input) return [];
      return await userSearchAPI(input, searchBy);
    },
    initialData: [], // 초기 렌더링 시 사용될 더미 데이터
    enabled, // 버튼 클릭 전에는 쿼리를 비활성화
  });
};
