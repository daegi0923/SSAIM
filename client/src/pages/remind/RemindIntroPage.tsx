import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RemindIntroPage.module.css';
import remindBG from '../../assets/remind/remindBG.png';
import remindIntro from '../../assets/remind/remindIntro.png';
import remindCreate from '../../assets/remind/remindCreate.png';
import remindList from '../../assets/remind/remindList.png';
import useUserStore from '@/stores/useUserStore';
import { useDevelopStory } from '@/features/remind/hooks/useDevelopStory';

const RemindIntroPage = () => {
  const navigate = useNavigate();
  const { userId } = useUserStore();

  const { data, isLoading, isError } = useDevelopStory({
    userId: userId ?? 0,
  });

  // 데이터가 로딩 중일 때와 에러가 발생했을 때 처리
  useEffect(() => {
    if (isLoading) {
      console.log('Loading...');
    } else if (isError) {
      console.error('Error fetching develop story');
    } else if (data) {
      console.log('Develop story data:', data); // 데이터를 콘솔에 출력
    }
  }, [data, isLoading, isError]);

  const handleCreateClick = () => {
    navigate('/remind/all');
  };

  const handleListClick = () => {
    navigate('/remind/list');
  };

  return (
    <div>
      <img src={remindBG} alt="remindBG" className={styles.remindBG} />
      <div className={styles.container}>
        <div className={styles.remindIntroText}>
          <img src={remindIntro} alt="remindIntro" className={styles.remindIntro} />
          <div className={styles.remindIntroDesc}>
            프로젝트를 마무리하며
            <br /> 나의 개발 이야기를 생성해보세요
          </div>
        </div>
        <div className={styles.remindButton}>
          <img
            src={remindCreate}
            alt="remindCreate"
            className={styles.remindCreate}
            onClick={handleCreateClick}
            style={{ cursor: 'pointer' }}
          />
          <img
            src={remindList}
            alt="remindList"
            className={styles.remindList}
            onClick={handleListClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};

export default RemindIntroPage;
