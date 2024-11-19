import { useQuery } from '@tanstack/react-query';
import { fetchDevelopStory } from '../apis/fetchDevelopStory';
import { DevelopStoryDTO } from '@features/remind/types/DevelopStoryDTO';

interface UseDevelopStoryParams {
  userId: number            
}

export const useDevelopStory = ({
    userId,
  }: UseDevelopStoryParams) => {
    return useQuery<DevelopStoryDTO[]>({
      queryKey: ['developStory', userId], 
      queryFn: () => fetchDevelopStory(userId), // 항상 fetchDailyRemind 호출
      enabled: !!userId, 
    });
  };
  
