import React from 'react';
import styles from './TeamSprint.module.css';
import TeamSprintCard from './TeamSprintCard';

interface Content {
  username: string;
  userImage: string;
  content: string;
}

interface TeamSprintProps {
  contents: Content[];
}

const TeamSprint: React.FC<TeamSprintProps> = ({ contents }) => {

  return (
    <div className={styles.teamReview}>

      {contents.length === 0 ? (
        <p className={styles.p}>해당 주차에 생성된 회고가 없습니다.</p>
      ) : (
        contents.map((content, index) => (
          // const [keep, problem, trySection] = content.content.split("\n\n");
          <TeamSprintCard
            key={index} // 각 카드에 고유한 키를 부여
            userName={content.username}
            userImage={content.userImage}
            // reviewText={`🟢 Keep: \n${keep}\n🟠 Problem: \n${problem}\n🔵 Try: \n${trySection}`}
            reviewText={content.content}
          />
        ))
      )}
      
    </div>
  );
};

export default TeamSprint;
