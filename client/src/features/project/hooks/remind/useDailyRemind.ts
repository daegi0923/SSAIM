import { useQuery } from '@tanstack/react-query';
import { fetchDailyRemind } from '@features/project/apis/remind/fetchDailyRemind';
import { DailyRemindGetDTO } from '@features/project/types/remind/DailyRemindDTO';

interface UseDailyRemindParams {
  projectId: number;              // projectId는 필수
  projectMemberId?: number;       // projectMemberId는 선택적 (undefined일 수 있음)
  startDate?: string;             // startDate는 선택적 (undefined일 수 있음)
  endDate?: string;               // endDate는 선택적 (undefined일 수 있음)
}

export const useDailyRemind = ({
  projectId,
  projectMemberId,
  startDate,
  endDate,
}: UseDailyRemindParams) => {
  // useQuery의 반환값 가져오기
  const queryResult = useQuery<DailyRemindGetDTO[]>({
    queryKey: ['dailyRemind', projectId, projectMemberId, startDate, endDate].filter(Boolean), // undefined 값 제외
    queryFn: () => fetchDailyRemind(projectId, projectMemberId, startDate, endDate), // 항상 fetchDailyRemind 호출
    enabled: !!projectId, // projectId가 있을 때만 쿼리 실행
  });

  // refetch 포함해서 반환
  return { ...queryResult, refetch: queryResult.refetch };
};
  
