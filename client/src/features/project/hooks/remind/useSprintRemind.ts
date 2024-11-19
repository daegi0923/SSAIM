import { useQuery } from '@tanstack/react-query';
import { fetchSprintRemind } from '@features/project/apis/remind/fetchSprintRemind';
import { SprintRemindGetDTO } from '@features/project/types/remind/SprintRemndDTO';

interface UseSprintRemindParams {
  projectId: number;              // projectId는 필수
  projectMemberId?: number;       // projectMemberId는 선택적 (undefined일 수 있음)
  checkDate?: string;             // checkDate 선택적 (undefined일 수 있음)
  startDate?: string;             // startDate는 선택적 (undefined일 수 있음)
  endDate?: string;               // endDate는 선택적 (undefined일 수 있음)
}

export const useSprintRemind = ({
  projectId,
  projectMemberId,
  checkDate,
  startDate,
  endDate,
}: UseSprintRemindParams) => {
  // refetch를 반환값에 추가
  const queryResult = useQuery<SprintRemindGetDTO[]>({
    queryKey: ['sprintRemind', projectId, projectMemberId, checkDate, startDate, endDate].filter(Boolean),
    queryFn: () => fetchSprintRemind(projectId, projectMemberId, checkDate, startDate, endDate),
    enabled: !!projectId, // projectId가 있을 때만 쿼리 실행
  });

  // refetch를 반환값에 포함
  return { ...queryResult, refetch: queryResult.refetch };
};
