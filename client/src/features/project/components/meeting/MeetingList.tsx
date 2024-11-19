import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './MeetingList.module.css';
import Button from '../../../../components/button/Button';
import MeetingCalendar from './MeetingCalendar';
import MeetingItem from './MeetingItem';
import MeetingModal from './MeetingModal';
import { fetchMeetingList } from '@features/project/apis/meeting/fetchMeetingList';
import { MeetingItemDTO } from '../../types/meeting/MeetingDTO';
import meetingNoImage from '@/assets/meeting/meetingImage.png';
import moment from 'moment';

const MeetingList = () => {
  const navigate = useNavigate();

  const { projectId } = useParams<{ projectId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetings, setMeetings] = useState<MeetingItemDTO[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const getMeetings = async () => {
      try {
        const data = await fetchMeetingList(Number(projectId)); // projectId를 숫자로 변환해서 API 호출
        setMeetings(data.reverse()); // meetings 상태에 데이터 저장
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    if (projectId) {
      getMeetings(); // projectId가 있을 때만 호출
    }
  }, [projectId]);

  const handleMeetingClick = (meeting: MeetingItemDTO) => {
    console.log('Selected meeting:', meeting);
    navigate(`/project/${projectId}/meeting/${meeting.meetingId}`);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date); // 선택된 날짜 상태 업데이트
  };

  const handleShowAllMeetings = () => {
    setSelectedDate(null); // 선택된 날짜 초기화
  };

  // 선택된 날짜와 동일한 회의만 필터링
  const filteredMeetings = selectedDate
    ? meetings.filter((meeting) =>
        moment(meeting.meetingCreateTime).isSame(selectedDate, 'day')
      )
    : meetings;

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.meetingList}>
          {filteredMeetings.length > 0 ? ( // 필터링된 meetings 사용
            filteredMeetings.map((meeting) => (
              <MeetingItem
                key={meeting.meetingId}
                meeting={meeting}
                onClick={handleMeetingClick}
              />
            ))
          ) : (
            <div className={styles.noMeetings}>
              <img src={meetingNoImage} alt="No Meetings" className={styles.noMeetingsImage} />
              <p>생성된 회의가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <Button size="large" colorType="green" onClick={handleOpenModal}>
          🎙️ 회의록 생성하기
        </Button>
        <p className={styles.description}>조회할 날짜를 선택해주세요</p>
        <MeetingCalendar onDateChange={handleDateChange} />
        <div className={styles.allMeeting} onClick={handleShowAllMeetings}>🌐 전체보기</div>
      </div>

      <MeetingModal isOpen={isModalOpen} onClose={handleCloseModal}></MeetingModal>
    </div>
  );
};

export default MeetingList;
