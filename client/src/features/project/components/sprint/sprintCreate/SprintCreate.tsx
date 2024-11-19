import React, { useMemo, useState, useEffect } from 'react';
import styles from './SprintCreate.module.css';
import { useParams } from 'react-router-dom';
import { useSprintQuery } from '@/features/project/hooks/sprint/useSprintQuery';
import { format } from 'date-fns';
import IssueCreateForm from './IssueCreateForm';
import { useSprintIssueStore } from '@/features/project/stores/useSprintIssueStore ';
import { IssueDTO } from '@/features/project/types/dashboard/WeeklyDataDTO';
import { useIssueInSprintQuery } from '@/features/project/hooks/sprint/useIssueInSprintQuery';
import useUserStore from '@/stores/useUserStore';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';
import Button from '@/components/button/Button';
import SprintCreateModal from './SprintAutoCreateModal';
import EditableIssue from './EditableIssue';
import { IssueCreateDTO } from '@/features/project/types/sprint/IssueCreateDTO';
import { generateIssueOnSprint } from '@/features/project/apis/sprint/generate/generateIssueOnSprint';
// import Loading from '@/components/loading/Loading';
import { showToast } from '@/utils/toastUtils';
import { useNavigate } from 'react-router-dom';
import useIndicatorStore from '@/stores/useIndicatorStore';

const SprintCreate: React.FC = () => {
  const navigate = useNavigate();
  // userInfo
  const { userId } = useUserStore();
  const { data: userInfo } = useUserInfoData(userId);
  const userName = userInfo?.userName;

  // projectId, sprintId
  const { projectId, sprintId } = useParams();

  // queries
  const { data: sprint } = useSprintQuery(Number(projectId), Number(sprintId));
  const { data: issueInSprint } = useIssueInSprintQuery(Number(projectId), Number(sprintId));

  // stores
  const { tempIssueList, addIssue, initializeTempIssueList } = useSprintIssueStore();
  const { startUpload, updateElapsedTime, completeUpload } = useIndicatorStore();
  // 자동 생성 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 로딩 상태 추가
  // const [isLoading, setIsLoading] = useState(false);

  const weekdays = useMemo(() => {
    if (!sprint?.startDate || !sprint?.endDate) return [];
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    const days = [];
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const day = new Date(d);
      if (day.getDay() !== 0 && day.getDay() !== 6) {
        days.push(format(day, 'yyyy-MM-dd'));
      }
    }
    return days;
  }, [sprint]);

  // 초기화: 컴포넌트가 로드될 때 tempIssueList 초기화
  useEffect(() => {
    if (weekdays.length && sprint) {
      initializeTempIssueList(new Date(sprint?.startDate), new Date(sprint?.endDate));
    }
  }, [weekdays, initializeTempIssueList, sprint]);

  const issuesByDay = useMemo(() => {
    const dayIssueMap: Record<string, Record<string, IssueDTO[]>> = {};
    weekdays.forEach((day) => {
      dayIssueMap[day] = { temp: [], issues: [] };
    });
    issueInSprint
      ?.filter((issue: IssueDTO) => {
        return issue.allocator === userName;
      })
      .forEach((issue: IssueDTO) => {
        const match = issue?.summary.match(/(\d{6})/);
        if (match) {
          const dateStr = match[0];
          const year = 2000 + parseInt(dateStr.slice(0, 2), 10);
          const month = parseInt(dateStr.slice(2, 4), 10) - 1;
          const date = parseInt(dateStr.slice(4, 6), 10);
          const dateObj = new Date(year, month, date);
          const day = format(dateObj, 'yyyy-MM-dd');
          dayIssueMap[day]?.issues.push(issue);
        }
      });
    return dayIssueMap;
  }, [issueInSprint, userName, weekdays]);

  const handleAssignIssueToSprint = async () => {
    if (!projectId || !sprintId) {
      console.error('Project ID or Sprint ID is missing.');
      return;
    }
    const tempIssueCount = tempIssueList.reduce((sum, dayIssueList) => {
      return sum + dayIssueList.tasks.length;
    }, 0);
    // showToast.info(`${tempIssueCount}`);
    if (tempIssueCount === 0) {
      showToast.warn('추가할 이슈가 없습니다. 이슈를 추가하고 저장해주세요.', { toastId: 'no-issue-error' });
      return;
    }
    // setIsLoading(true); // 로딩 시작

    const request = tempIssueList.map((day) => ({
      day: day.day,
      tasks: day.tasks.map((task) => ({
        summary: task.summary,
        description: task.description,
        issueType: task.issueType,
        storyPoint: task.storyPoint,
        epic: task.epic,
        assignee: task.assignee,
      })),
    }));

    try {
      navigate(`/project/${projectId}/sprint`);
      updateElapsedTime();
      startUpload(
        `${sprint?.name} 에 이슈 할당이 완료되었습니다.`,
        `${sprint?.name}에 이슈 할당이 실패했습니다. 다시 시도해주세요`,
        `${sprint?.id}`,
        `${sprint?.name}`
      );
      const response = await generateIssueOnSprint(Number(projectId), Number(sprintId), request);
      console.log(response);
      showToast.success('이슈가 스프린트에 성공적으로 할당되었습니다.');
      completeUpload();
    } catch (error) {
      console.error('Failed to assign issues to sprint:', error);
      showToast.error('이슈를 스프린트에 할당하는 데 실패했습니다.');
      completeUpload();
    } finally {
      // setIsLoading(false); // 로딩 종료
    }
  };
  const weekMap = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  // if (isLoading) {
  //   return (
  //     <div className={styles.loadingContainer}>
  //       <Loading />
  //     </div>
  //   );
  // }
  // console.log(tempIssueList);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{sprint?.name}</h2>
        <div className={styles.buttonContainer}>
          <div className={styles.genButton}>
            <Button
              size="small"
              colorType="blue"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              🚀AI 자동생성
            </Button>
          </div>
          <div className={styles.genButton}>
            <Button size="small" colorType="blue" onClick={handleAssignIssueToSprint}>
              저장하기
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <IssueCreateForm weekdays={weekdays} onAddIssue={addIssue} />
      <hr />
      {/* <h3>주간 계획표</h3> */}
      <div className={styles.weeklyProgressContainer}>
        <div className={styles.contentheader}>
          {weekdays.map((day) => (
            <div key={day} className={styles.dayHeader}>
              <span>{new Date(day).getDate()}</span>
              <span>{weekMap[new Date(day).getDay()]}</span>
            </div>
          ))}
        </div>

        <div className={`${styles.issueGrid} ${styles.tempIssueGrid}`}>
          {weekdays.map((day) => (
            <div key={day} className={styles.dayColumn}>
              {/* tempIssueList에서 해당 day에 대한 이슈들 */}
              {tempIssueList
                .filter((tempIssue) => tempIssue.day === day)
                .flatMap((tempIssue) =>
                  tempIssue.tasks.length > 0 ? (
                    tempIssue.tasks.map((issue: IssueCreateDTO, index: number) => (
                      <EditableIssue
                        key={`temp-${day}-${index}`}
                        day={new Date(day)}
                        issueData={issue}
                        isEditable={true}
                      />
                    ))
                  ) : (
                    <span className={styles.noData} key={`empty-${day}`}>추가한 이슈가 없습니다.</span>
                  )
                )}
              {/* 기존 issuesByDay의 이슈들 */}
            </div>
          ))}
        </div>
        
          <hr />
        <div className={styles.issueGrid}>
          {weekdays.map((day) => (
            <div key={day} className={styles.dayColumn}>
              {/* tempIssueList에서 해당 day에 대한 이슈들 */}
              {/* 기존 issuesByDay의 이슈들 */}
              {issuesByDay[day]?.issues.map((issue: IssueDTO) => (
                <EditableIssue key={issue.issueKey} day={new Date(day)} issueData={issue} isEditable={false} />
              ))}
            </div>
          ))}
        </div>

      </div>
      {isModalOpen && <SprintCreateModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default SprintCreate;
