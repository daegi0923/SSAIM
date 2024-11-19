import { useQuery } from '@tanstack/react-query';
import { fectchMeetingDetail } from '@features/project/apis/meeting/fectchMeetingDetail';
import { MeetingDetailDTO } from '@features/project/types/meeting/MeetingDTO';

interface UseMeetingParams {
  projectId: number;
  meetingId: number;
}

export const useMeeting = ({ projectId, meetingId }: UseMeetingParams) => {
  const queryResult = useQuery<MeetingDetailDTO>({
    queryKey: ['meetingDetail', projectId, meetingId], // 유니크한 queryKey 설정
    queryFn: () => fectchMeetingDetail(projectId, meetingId), // fectchMeetingDetail 호출
    enabled: !!projectId && !!meetingId, // projectId와 meetingId가 있을 때만 쿼리 실행
  });

  // refetch를 반환값에 포함
  return { ...queryResult, refetch: queryResult.refetch };
};
