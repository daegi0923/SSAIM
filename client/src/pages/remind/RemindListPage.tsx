import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RemindListPage.module.css';
import bookList from '../../assets/remind/bookList.png';
import book from '../../assets/remind/book.png';
import useUserStore from '@/stores/useUserStore';
import { useDevelopStory } from '@/features/remind/hooks/useDevelopStory';
import { DevelopStoryDTO } from '@features/remind/types/DevelopStoryDTO';

const RemindListPage = () => {
  const navigate = useNavigate();
  const { userId } = useUserStore();
  const { data = [], isLoading, isError } = useDevelopStory({
    userId: userId ?? 0,
  });

  // 로딩 중일 때 및 에러 발생 시 메시지 출력
  useEffect(() => {
    if (isLoading) {
      console.log('Loading...');
    } else if (isError) {
      console.error('Error fetching develop story');
    } else if (data.length > 0) {
      console.log('Develop story data:', data);
    }
  }, [data, isLoading, isError]);

  const handleBookClick = (project: DevelopStoryDTO) => {
    navigate(`/remind/${project.projectId}`, { state: project });
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <img src={bookList} alt="bookList" className={styles.bookList} />
          <div className={styles.container}>
            {/* Row별로 나눠서 렌더링 */}
            {Array.from({ length: Math.ceil(data.length / 5) }).map((_, rowIndex) => (
              <div key={rowIndex} className={styles.Row}>
                {data.slice(rowIndex * 5, rowIndex * 5 + 5).map((project) => (
                  <div key={project.projectId} className={styles.projectItem}>
                    <div className={styles.projectName}>{project.projectName}</div>
                    <img
                      src={book}
                      alt="book"
                      className={styles.book}
                      onClick={() => handleBookClick(project)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RemindListPage;
