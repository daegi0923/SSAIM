import MypageComponent from '../../features/myPage/components/MypageComponent';
import { useParams } from 'react-router-dom';
const MyPage = () => {
  const { profileOwnerId } = useParams<{ profileOwnerId: string }>();

  return (
    <>
      <MypageComponent profileOwnerId={Number(profileOwnerId)}/>
    </>
  );
};

export default MyPage;
