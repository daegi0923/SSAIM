import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import Proposal from '../../features/project/components/propasal/Proposal';
import FeatureSpec from '../../features/project/components/featureSpec/FeatureSpec';
import ApiSpec from '../../features/project/components/apiSpec/ApiSpec';
import ERD from '../../features/project/components/erd/ERD';
import styles from './ProjectOutputPage.module.css';
import { connectWebSocket, disconnectWebSocket } from '../../features/project/apis/webSocket/webSocketService';

const ProjectOutputPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [showOutput, setShowOutput] = useState<string>('proposal');
  const [isWebSocketConnected, setIsWebSocketConnected] = useState<boolean>(false);

  useEffect(() => {
    const userStorage = localStorage.getItem('user-storage');
    if (userStorage) {
      const { token } = JSON.parse(userStorage).state;
      connectWebSocket(token, () => setIsWebSocketConnected(true));
    }

    return () => {
      disconnectWebSocket();
    };
  }, [projectId]);

  return (
    <div className={styles.body}>
      <ProjectHeader projectId={projectId as string} />
      <div className={styles.outputHeader}>
        <div
          className={`${styles.outputButton} ${showOutput === 'proposal' ? styles.active : ''}`}
          onClick={() => setShowOutput('proposal')}
        >
          기획서
        </div>
        <div
          className={`${styles.outputButton} ${showOutput === 'featureSpec' ? styles.active : ''}`}
          onClick={() => setShowOutput('featureSpec')}
        >
          기능 명세서
        </div>
        <div
          className={`${styles.outputButton} ${showOutput === 'APIspec' ? styles.active : ''}`}
          onClick={() => setShowOutput('APIspec')}
        >
          API 명세서
        </div>
        <div
          className={`${styles.outputButton} ${showOutput === 'ERD' ? styles.active : ''}`}
          onClick={() => setShowOutput('ERD')}
        >
          ERD
        </div>
      </div>
      {showOutput === 'proposal' && <Proposal projectId={projectId as string} isWebSocketConnected={isWebSocketConnected} />}
      {showOutput === 'featureSpec' && <FeatureSpec projectId={projectId as string} isWebSocketConnected={isWebSocketConnected} />}
      {showOutput === 'APIspec' && <ApiSpec projectId={projectId as string} isWebSocketConnected={isWebSocketConnected} />}
      {showOutput === 'ERD' && <ERD projectId={projectId as string}/>}
    </div>
  );
};

export default ProjectOutputPage;