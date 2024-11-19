import React, { useState, useEffect, useRef } from 'react';
import styles from './FeatureSpec.module.css';
import { MdDelete } from "react-icons/md";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getFeatureSpec, getAutoFeatureSpec } from '@features/project/apis/webSocket/featureSpec';
import CommonModal from '@components/modal/Modal';
import Button from '@components/button/Button';
import Loading from '@/components/loading/Loading';
import { showToast } from '@/utils/toastUtils';
import { getProposal } from '../../apis/webSocket/proposal';
import { useProjectInfo } from '../../hooks/useProjectInfo';
import Tag from '@/features/teamBuilding/components/tag/Tag';
import useUserStore from '@/stores/useUserStore';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';

interface FeatureSpecData {
  category: string[];
  functionName: string[];
  description: string[];
  owner: string[];
  priority: string[];
  participant: { [username: string]: string[] };
}

interface FeatureSpecTableProps {
  projectId: string;
  isWebSocketConnected: boolean;
}

const FeatureSpecTable: React.FC<FeatureSpecTableProps> = ({ projectId, isWebSocketConnected }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTextareaValue, setModalTextareaValue] = useState<string>('');
  const [data, setData] = useState<FeatureSpecData>({
    category: [],
    functionName: [],
    description: [],
    owner: [],
    priority: [],
    participant: {},
  });

  const [isEditing, setIsEditing] = useState<{ [index: number]: { [field: string]: boolean } }>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const stompClientRef = useRef<any>(null);
  const { data: projectInfo } = useProjectInfo(parseInt(projectId));
  const { userId } = useUserStore();
  const { data: userInfo } = useUserInfoData(userId);

  useEffect(() => {
    const fetchFeatureSpec = async () => {
      try {
        const fetchedData = await getFeatureSpec(projectId);
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching feature spec:', error);
      }
    };

    fetchFeatureSpec();
  }, [projectId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (stompClientRef.current?.connected && userInfo?.userName) {
        // 현재 편집 정보를 초기화
        const updatedParticipant = { ...data.participant };
  
        // 현재 사용자의 편집 정보를 제거
        delete updatedParticipant[userInfo.userName];
  
        // WebSocket을 통해 초기화된 데이터를 전송
        stompClientRef.current.send(
          `/app/edit/api/v1/projects/${projectId}/function-description`,
          {},
          JSON.stringify({ ...data, participant: updatedParticipant })
        );
  
        console.log("Participant cleared before unload:", updatedParticipant);
      }
    };
  
    // `beforeunload` 이벤트 등록
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    // 정리(cleanup) 작업
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [data, projectId, userInfo]);

  useEffect(() => {
    if (isWebSocketConnected) {
      const socket = new SockJS('https://k11e203.p.ssafy.io:8080/ws');
      const stompClient = Stomp.over(socket);
      stompClientRef.current = stompClient;

      stompClient.connect({}, () => {
        const subscriptionPath = `/topic/api/v1/projects/${projectId}/function-description`;

        stompClient.subscribe(subscriptionPath, (message) => {
          try {
            const updatedData = JSON.parse(message.body);
            setData(updatedData);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });
      });

      return () => {
        if (stompClientRef.current?.connected) {
          const updatedParticipant = { ...data.participant };
      
          if (userInfo?.userName && updatedParticipant[userInfo.userName]) {
            // 사용자 ID 제거
            delete updatedParticipant[userInfo.userName];
      
            // 로컬 데이터 업데이트
            setData((prevData) => ({
              ...prevData,
              participant: updatedParticipant,
            }));
      
            // 서버로 업데이트된 participant 전송
            stompClientRef.current.send(
              `/app/edit/api/v1/projects/${projectId}/function-description`,
              {},
              JSON.stringify({ ...data, participant: updatedParticipant })
            );
            console.log('Participant updated on disconnect:', updatedParticipant);
          }
      
          // WebSocket 연결 종료
          stompClientRef.current.disconnect(() => {
            console.log('WebSocket disconnected for FeatureSpecTable');
          });
        }
      };
    }
  }, [isWebSocketConnected, projectId]);

  const addNewRow = () => {
    // 열(column) 기반 데이터에 새로운 행 추가
    const updatedData = {
      category: [...data.category, ''],
      functionName: [...data.functionName, ''],
      description: [...data.description, ''],
      owner: [...data.owner, ''],
      priority: [...data.priority, '하'],
      participant: { ...data.participant },
    };

    setData(updatedData);

    // WebSocket으로 새로운 데이터 전송
    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/function-description`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const handleDeleteRow = (index: number) => {
    // 각 컬럼 배열에서 특정 인덱스의 값 제거
    const updatedData = {
      category: data.category.filter((_, i) => i !== index),
      functionName: data.functionName.filter((_, i) => i !== index),
      description: data.description.filter((_, i) => i !== index),
      owner: data.owner.filter((_, i) => i !== index),
      priority: data.priority.filter((_, i) => i !== index),
      participant: { ...data.participant },
    };

    setData(updatedData);

    // WebSocket으로 업데이트된 데이터 전송
    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/function-description`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const updateParticipant = (
    username: string,
    rowIndex: number,
    column: keyof FeatureSpecData,
    isEditing: boolean
  ) => {
    setData((prevData) => {
      const participant = prevData.participant || {};
      const currentTasks = participant[username] || [];
      const context = `Row ${rowIndex}, Column ${column}`; // 작업 중인 셀 정보
  
      let updatedTasks;
  
      if (isEditing) {
        // 기존 작업 제거하고 새로운 작업 추가 (중복 방지)
        updatedTasks = [context];
      } else {
        // 작업 제거 (편집 종료 시)
        updatedTasks = currentTasks.filter((task) => task !== context);
      }
  
      const updatedData = {
        ...prevData,
        participant: {
          ...participant,
          [username]: updatedTasks,
        },
      };
  
      // WebSocket 전송
      if (stompClientRef.current?.connected) {
        try {
          stompClientRef.current.send(
            `/app/edit/api/v1/projects/${projectId}/function-description`,
            {},
            JSON.stringify(updatedData)
          );
        } catch (error) {
          console.error('WebSocket 전송 실패:', error);
        }
      }
  
      return updatedData;
    });
  };

  const handleInputChange = (column: keyof FeatureSpecData, rowIndex: number, value: string) => {
    if (column === 'participant') {
      return;
    }

    const updatedColumn = [...data[column]];
    updatedColumn[rowIndex] = value;

    const updatedData = { ...data, [column]: updatedColumn };
    setData(updatedData);

    // WebSocket으로 업데이트된 데이터 전송
    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/function-description`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const handleEditClick = (rowIndex: number, column: keyof FeatureSpecData) => {
    setIsEditing({ [rowIndex]: { [column]: true } });
  };

  const handleBlur = (username: string, rowIndex: number, column: keyof FeatureSpecData) => {
    setIsEditing({});
    if (username) {
      updateParticipant(username, rowIndex, column, false); // 편집 종료 시 작업 제거
    }
  };

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    rowIndex: number,
    column: keyof FeatureSpecData
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (userInfo) {
        handleBlur(userInfo?.userName, rowIndex, column);
      }
    }
  };

  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      autoResize(textarea as HTMLTextAreaElement);
    });
  }, [data]);
  
  const maxCharCount = 200;

  const handleModalTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxCharCount) {
      setModalTextareaValue(e.target.value);
    }
  };

  const parseBacktickJson = (data: string) => {
    // 백틱과 "```json" 태그 제거
    const cleanedData = data.replace(/```json|```/g, "").trim();
    
    try {
      // JSON 문자열을 객체로 변환
      const parsedData = JSON.parse(cleanedData);
      return parsedData;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return data; // 파싱 실패 시 null 반환
    }
  };

  const handleModalSubmit = async () => {
    try {
      setIsGenerating(true);
      let response;
      try {
        response = await getAutoFeatureSpec(projectId, modalTextareaValue);
      } catch (fetchError) {
        showToast.error('자동 생성에 실패했습니다. 다시 시도해 주세요.');
        return;
      }
  
      let parsedData;
  
      // response가 문자열인지 확인
      if (typeof response === 'string') {
        console.log('Response is a string. Attempting to parse with parseBacktickJson.');
        parsedData = parseBacktickJson(response); // 백틱 JSON 처리
      } else if (typeof response === 'object') {
        console.log('Response is an object. Using it directly.');
        parsedData = response; // 객체 그대로 사용
      } else {
        console.error('Unexpected response type:', typeof response);
        parsedData = null;
      }
  
      // 파싱된 데이터를 상태에 반영
      if (parsedData) {
        const maxLength = Math.max(
          ...Object.values(parsedData).map((value) => Array.isArray(value) ? value.length : 0)
        );

        Object.keys(parsedData).forEach((key) => {
          if (Array.isArray(parsedData[key])) {
            while (parsedData[key].length < maxLength) {
              parsedData[key].push('');
            }
          }
        });

        parsedData.owner = Array(maxLength).fill(''),
        setData(parsedData);
  
        // WebSocket을 통해 실시간 반영
        if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.send(
            `/app/edit/api/v1/projects/${projectId}/function-description`, // WebSocket 경로
            {}, // 헤더
            JSON.stringify(parsedData) // WebSocket으로 데이터 전송
          );
          console.log('WebSocket message sent:', parsedData);
        } else {
          console.warn('WebSocket is not connected. Cannot send message.');
        }
      } else {
        console.error('Parsed data is null or undefined.');
      }
  
      setIsModalOpen(false); // 모달 닫기
    } catch (error) {
      showToast.error('AI가 요청을 이해하지 못했습니다. 요청을 확인해주세요.')
    } finally {
      setIsGenerating(false);
    }
  };

  const openModal = async() => {
    try {
      const response = await getProposal(projectId);

      const requiredFields = ['title', 'description', 'background', 'feature', 'effect'];

      const allFieldsFilled = requiredFields.every(field =>
        response[field] &&
        response[field].toString().trim() !== '' &&
        !(typeof response[field] === 'object' && Object.keys(response[field]).length === 0) // 비어있는 객체가 아님
      );

      if (!allFieldsFilled) {
        showToast.error('기획서를 먼저 완성해주세요.');
        return;
      }
    } catch (error) {
      console.error('API 호출 실패:', error);
      showToast.error('기획서 정보를 불러오는 데 실패했습니다. 다시 시도해 주세요.');
      return;
    }

    setModalTextareaValue('')
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getColorFromName = (name: string): string => {
    const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };
  
  const getCellStyle = (rowIndex: number, column: keyof FeatureSpecData): React.CSSProperties => {
    const participants = Object.entries(data.participant || {})
      .filter(([_, tasks]) => tasks.includes(`Row ${rowIndex}, Column ${column}`))
      .map(([username]) => username);
  
    // userName과 일치하는 참여자가 있는지 확인
    const currentUserName = userInfo?.userName;
    const userBorderColor = currentUserName && participants.includes(currentUserName) 
      ? getColorFromName(currentUserName) 
      : null;

    // 테두리 색상 결정: userName과 일치하는 사용자가 있으면 그 색상을 사용, 없으면 첫 번째 참여자의 색상
    const borderColor = userBorderColor || (participants.length > 0 ? getColorFromName(participants[0]) : '#4A90E2');
  
    return participants.length > 0
      ? {
          border: `2px solid ${borderColor}`,
          position: 'relative',
          padding: '8px',
        }
      : {};
  };

  const getParticipantNames = (rowIndex: number, column: keyof FeatureSpecData): string[] => {
    return Object.entries(data.participant || {}) // participant가 없으면 빈 객체로 처리
      .filter(([_, tasks]) => tasks.includes(`Row ${rowIndex}, Column ${column}`))
      .map(([username]) => username);
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.sectionTitle}>
        기능 명세서
        <div className={styles.aiButton}>
          <Button size='custom' colorType='purple' onClick={openModal}>AI 자동생성</Button>
        </div>
      </h2>
      <CommonModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        title= '기능 명세서 자동 생성'
        content={
          <>
            {isGenerating && <Loading />}
            <textarea
              className={styles.modalTextarea}
              value={modalTextareaValue}
              onChange={handleModalTextareaChange}
            ></textarea>
            <div className={styles.charCounter}>
              {modalTextareaValue.length} / {maxCharCount}
            </div>
          </>
        }
        footer={
          <Button size='custom' colorType='blue' onClick={handleModalSubmit}>
            AI 자동생성
          </Button>
        }
        width={800}
        height={400}
        isOutsideClick={false}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th>구분</th>
            <th>기능명</th>
            <th>내용</th>
            <th>담당자</th>
            <th>우선순위</th>
            <th className={styles.actionColumn}></th>
          </tr>
        </thead>
        <tbody>
          {data.category.map((_, index) => (
            <tr key={index}>
              {(['category', 'functionName', 'description', 'owner', 'priority'] as const).map((column) => (
                <td
                  key={column}
                  onClick={() => handleEditClick(index, column)}
                  style={getCellStyle(index, column)}
                  className={styles.tableCell}
                >
                {column === 'owner' ? (
                  <>
                    <div className={styles.tagWrapper}>
                      {data[column][index]}
                    </div>
                    {isEditing[index]?.[column] && (
                      <div className={styles.tagOptions} onClick={(e) => e.stopPropagation()}>
                        {projectInfo?.projectMembers.map((member) => (
                          <div
                            key={member.pmId}
                            onFocus={() =>
                              userInfo
                                ? updateParticipant(userInfo.userName, index, column, true)
                                : null
                            }
                            onClick={() => {
                              handleInputChange(column, index, member.name);
                              if (userInfo) {
                                handleBlur(userInfo?.userName, index, column);
                              }
                            }}
                            className={styles.tagOptionWrapper}
                          >
                            {member.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : column === 'priority' ? ( 
                  <>
                    <div className={styles.tagWrapper}>
                      <Tag text={data[column][index]} />
                    </div>
                    {isEditing[index]?.[column] && (
                      <div
                        className={styles.tagOptions}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {['상', '중', '하'].map((value) => (
                          <div
                            key={value}
                            onFocus={() =>
                              userInfo
                                ? updateParticipant(userInfo.userName, index, column, true)
                                : null
                            }
                            onClick={() => {
                              handleInputChange(column, index, value);
                              if (userInfo) {
                                handleBlur(userInfo?.userName, index, column);
                              }
                            }}
                            className={styles.tagOptionWrapper}
                          >
                            <Tag text={value} />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : isEditing[index]?.[column] ? (
                    <>
                      <textarea
                        value={data[column][index]}
                        onChange={(e) => handleInputChange(column, index, e.target.value)}
                        onFocus={() =>
                          userInfo
                            ? updateParticipant(userInfo.userName, index, column, true)
                            : null
                        }
                        onKeyDown={(e) => handleKeyPress(e, index, column)}
                        onBlur={() => 
                          userInfo
                            ? handleBlur(userInfo.userName, index, column)
                            : null
                        }
                        autoFocus
                        ref={(el) => el && autoResize(el)} // 크기 자동 조정
                      />
                    </>
                  ) : (
                    data[column][index]?.length > (column === "category" ? 50 : 250) ? (
                      <span title={data[column][index]}>
                        {data[column][index].slice(0, column === "category" ? 50 : 250)}...
                      </span>
                    ) : (
                      data[column][index]
                    )
                  )}
                  <div className={styles.participantNames}>
                    {getParticipantNames(index, column).map((name) => (
                      <span
                        key={name}
                        style={{backgroundColor: getColorFromName(name)}}
                        className={styles.participantName}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
              <td>
                <MdDelete onClick={() => handleDeleteRow(index)} />
              </td>
            </tr>
          ))}
          <tr className={styles.addRow} onClick={addNewRow}>
            <td colSpan={6} className={styles.addRowText}>
              + Add New Row
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FeatureSpecTable;
