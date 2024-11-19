import useTeamStore from '../../../stores/useTeamStore';
import styles from './SearchResultItem.module.css';
import { TeamMemberDTO } from '@features/project/types/TeamMemberDTO';
import classNames from 'classnames';

interface SearchResultItemProps {
  member: TeamMemberDTO;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ member }) => {
  const { members, addMember } = useTeamStore();
  console.log(member);
  const isMemberInTeam = members.find((e) => {
    console.log(e);
    return e.userId === member.userId;
  });
  const handleAddMember = () => {
    if (isMemberInTeam) {
      return;
    } else {
      addMember(member);
    }
  };
  const buttonClass = classNames(styles.button, {
    [styles.buttonDisabled]: isMemberInTeam,
  });
  return (
    <div className={styles.resultItem}>
      <img src={member.userProfileImage} alt={`${member.userName}의 프로필`} className={styles.profileImage} />
      <div className={styles.memberInfo}>
        <div>{member.userName}</div>
        <div className={styles.email}>{member.userEmail}</div>
      </div>
      <button onClick={handleAddMember} className={buttonClass}>
        +
      </button>
    </div>
  );
};

export default SearchResultItem;
