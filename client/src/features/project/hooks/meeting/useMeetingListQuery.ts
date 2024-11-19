import { useQuery } from '@tanstack/react-query';
import { MeetingItemDTO } from '../../types/meeting/MeetingDTO';
import { fetchMeetingList } from '../../apis/meeting/fetchMeetingList';

export const useMeetingListQuery = (projectId: number | null) => {
  return useQuery<MeetingItemDTO[], Error>({
    queryKey: ['meetingList', projectId],
    queryFn: async () => {
      if (projectId === null) return []; // projectId가 null인 경우 빈 배열 반환
      const data = await fetchMeetingList(projectId);
      return data || []; // undefined일 경우 빈 배열을 반환
    },
    enabled: projectId !== null, // projectId가 있을 때만 쿼리 실행
  });
};
