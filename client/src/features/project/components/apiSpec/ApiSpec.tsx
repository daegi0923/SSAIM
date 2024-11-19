import React, { useState, useEffect, useRef } from 'react';
import styles from './ApiSpec.module.css';
import { MdDelete } from "react-icons/md";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getApiSpec, getAutoApiSpec } from '@features/project/apis/webSocket/apiSpec';
import ApiDetailModal from './apiDetailModal/ApiDetailModal';
import CommonModal from '@components/modal/Modal';
import Button from '@components/button/Button';
import Tag from '@/features/teamBuilding/components/tag/Tag';
import { getApiStatusLabel } from '../../../../utils/labelUtils'
import { MdOpenInNew } from "react-icons/md";
import Loading from '@/components/loading/Loading';
import { showToast } from '@/utils/toastUtils';
import { getProposal } from '../../apis/webSocket/proposal';
import { getFeatureSpec } from '../../apis/webSocket/featureSpec';
import { useProjectInfo } from '../../hooks/useProjectInfo';
import useUserStore from '@/stores/useUserStore';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';

interface ApiSpecData {
  category: string[];
  functionName: string[];
  uri: string[];
  method: string[];
  frontOwner: string[];
  backOwner: string[];
  frontState: string[];
  backState: string[];
  priority: string[];
  description: string[];
  requestHeader: string[];
  responseHeader: string[];
  requestBody: string[];
  responseBody: string[];
  participant: { [username: string]: string[] };
}

interface ApiSpecTableProps {
  projectId: string;
  isWebSocketConnected: boolean;
}

const ApiSpecTable: React.FC<ApiSpecTableProps> = ({ projectId, isWebSocketConnected }) => {
  const [data, setData] = useState<ApiSpecData>({
    category: [],
    functionName: [],
    uri: [],
    method: [],
    frontOwner: [],
    backOwner: [],
    frontState: [],
    backState: [],
    priority: [],
    description: [],
    requestHeader: [],
    responseHeader: [],
    requestBody: [],
    responseBody: [],
    participant: {},
  });
  const tableRef = useRef<HTMLDivElement | null>(null);
  const stompClientRef = useRef<any>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [modalTextareaValue, setModalTextareaValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<{ [rowIndex: number]: { [column: string]: boolean } }>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { data: projectInfo } = useProjectInfo(parseInt(projectId));
  const { userId } = useUserStore();
  const { data: userInfo } = useUserInfoData(userId);

  const openModal = (rowIndex: number) => {
    setSelectedRowIndex(rowIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRowIndex(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchApiSpec = async () => {
      try {
        const fetchedData = await getApiSpec(projectId);
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching api spec:', error);
      }
    };

    fetchApiSpec();
  }, [projectId]);

  useEffect(() => {
    if (isWebSocketConnected) {
      const socket = new SockJS('https://k11e203.p.ssafy.io:8080/ws');
      const stompClient = Stomp.over(socket);
      stompClientRef.current = stompClient;

      stompClient.connect({}, () => {
        const subscriptionPath = `/topic/api/v1/projects/${projectId}/api-docs`;

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
        if (stompClient.connected) {
          stompClient.disconnect(() => {
            console.log('WebSocket disconnected for ApiSpecTable');
          });
        }
      };
    }
  }, [isWebSocketConnected, projectId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (stompClientRef.current?.connected && userInfo?.userName) {
        // 현재 편집 정보를 초기화
        const updatedParticipant = { ...data.participant };
  
        // 현재 사용자의 편집 정보를 제거
        delete updatedParticipant[userInfo.userName];
  
        // WebSocket을 통해 초기화된 데이터를 전송
        stompClientRef.current.send(
          `/app/edit/api/v1/projects/${projectId}/api-docs`,
          {},
          JSON.stringify({ ...data, participant: updatedParticipant })
        );
      }
    };
  
    // `beforeunload` 이벤트 등록
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    // 정리(cleanup) 작업
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [data, projectId, userInfo]);

  const addNewRow = () => {
    const updatedData = {
      ...data,
      category: [...data.category, ''],
      functionName: [...data.functionName, ''],
      uri: [...data.uri, ''],
      method: [...data.method, 'GET'],
      frontOwner: [...data.frontOwner, ''],
      backOwner: [...data.backOwner, ''],
      frontState: [...data.frontState, '0'],
      backState: [...data.backState, '0'],
      priority: [...data.priority, '하'],
      description: [...data.description, ''],
      requestHeader: [...data.requestHeader, ''],
      responseHeader: [...data.responseHeader, ''],
      requestBody: [...data.requestBody, ''],
      responseBody: [...data.responseBody, ''],
      participant: { ...data.participant },
    };

    setData(updatedData);

    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/api-docs`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const handleDeleteRow = (index: number) => {
    const updatedData = {
      category: data.category.filter((_, i) => i !== index),
      functionName: data.functionName.filter((_, i) => i !== index),
      uri: data.uri.filter((_, i) => i !== index),
      method: data.method.filter((_, i) => i !== index),
      frontOwner: data.frontOwner.filter((_, i) => i !== index),
      backOwner: data.backOwner.filter((_, i) => i !== index),
      frontState: data.frontState.filter((_, i) => i !== index),
      backState: data.backState.filter((_, i) => i !== index),
      priority: data.priority.filter((_, i) => i !== index),
      description: data.description.filter((_, i) => i !== index),
      requestHeader: data.requestHeader.filter((_, i) => i !== index),
      responseHeader: data.responseHeader.filter((_, i) => i !== index),
      requestBody: data.requestBody.filter((_, i) => i !== index),
      responseBody: data.responseBody.filter((_, i) => i !== index),
      participant: { ...data.participant },
    };

    setData(updatedData);

    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/api-docs`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const updateParticipant = (
    username: string,
    rowIndex: number,
    column: keyof ApiSpecData,
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
            `/app/edit/api/v1/projects/${projectId}/api-docs`,
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
        response = await getAutoApiSpec(projectId, modalTextareaValue);
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

        parsedData.frontOwner = Array(maxLength).fill(''),
        parsedData.backOwner = Array(maxLength).fill(''),
        parsedData.frontState = Array(maxLength).fill('0'),
        parsedData.backState = Array(maxLength).fill('0'),
        parsedData.requestHeader = Array(maxLength).fill(''),
        parsedData.responseHeader = Array(maxLength).fill(''),
        parsedData.requestBody = Array(maxLength).fill(''),
        parsedData.responseBody = Array(maxLength).fill(''),
        setData(parsedData);
  
        // WebSocket을 통해 실시간 반영
        if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.send(
            `/app/edit/api/v1/projects/${projectId}/api-docs`, // WebSocket 경로
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
  
      setIsAiModalOpen(false); // 모달 닫기
    } catch (error) {
      showToast.error('AI가 요청을 이해하지 못했습니다. 요청을 확인해주세요.')
    } finally {
      setIsGenerating(false); // 로딩 종료
    }
  };

  const openAiModal = async() => {
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
      showToast.error('데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.');
      return;
    }

    try {
      const response = await getFeatureSpec(projectId);

      const requiredFields = ['category', 'functionName', 'description'];

      const invalidFields = requiredFields.filter(field =>
        !Array.isArray(response[field]) ||
        !response[field].some((value: any) => typeof value === 'string' && value.trim() !== '')
      );
    
      if (invalidFields.length > 0) {
        showToast.error('기능 명세서를 먼저 완성해주세요.');
        return;
      }
    } catch (error) {
      console.error('API 호출 실패:', error);
      showToast.error('데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.');
      return;
    }
    
    setModalTextareaValue('')
    setIsAiModalOpen(true);
  };

  const closeAiModal = () => {
    setIsAiModalOpen(false);
  };

  const handleEditClick = (rowIndex: number, column: keyof ApiSpecData) => {
    setIsEditing({ [rowIndex]: { [column]: true } });
  };

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleInputChange = (column: keyof ApiSpecData, rowIndex: number, value: string) => {
    if (column === 'participant') {
      return;
    }

    const updatedColumn = [...data[column]];
    updatedColumn[rowIndex] = value;
  
    const updatedData = { ...data, [column]: updatedColumn };
    setData(updatedData);
  
    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/api-docs`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const handleBlur = (username: string, rowIndex: number, column: keyof ApiSpecData) => {
    setIsEditing({});
    if (username) {
      updateParticipant(username, rowIndex, column, false); // 편집 종료 시 작업 제거
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    rowIndex: number,
    column: keyof ApiSpecData
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (userInfo) {
        handleBlur(userInfo?.userName, rowIndex, column);
      }
    }
  };

  const getColorFromName = (name: string): string => {
    const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };
  
  const getCellStyle = (rowIndex: number, column: keyof ApiSpecData): React.CSSProperties => {
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

  const getParticipantNames = (rowIndex: number, column: keyof ApiSpecData): string[] => {
    return Object.entries(data.participant || {}) // participant가 없으면 빈 객체로 처리
      .filter(([_, tasks]) => tasks.includes(`Row ${rowIndex}, Column ${column}`))
      .map(([username]) => username);
  };

  return (
    <div className={styles.tableContainer} ref={tableRef}>
      <h2 className={styles.sectionTitle}>
        API 명세서
        <div className={styles.aiButton}>
          <Button size='custom' colorType='purple' onClick={openAiModal}>AI 자동생성</Button>
        </div>
      </h2>
      <CommonModal 
        isOpen={isAiModalOpen}
        onClose={closeAiModal}
        title= ' API 명세서 자동 생성'
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
            <th className={styles.actionColumn}></th>
            <th>분류</th>
            <th>API 이름</th>
            <th>URI</th>
            <th>메소드</th>
            <th>FE 담당</th>
            <th>BE 담당</th>
            <th>FE 상태</th>
            <th>BE 상태</th>
            <th>우선순위</th>
            <th className={styles.actionColumn}></th>
          </tr>
        </thead>
        <tbody>
          {data.category.map((_, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className={styles.actionCell}>
                  <MdOpenInNew
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(index);
                    }}
                    className={styles.actionButton}
                  />
                </td>
                {(['category', 'functionName', 'uri', 'method', 'frontOwner', 'backOwner', 'frontState', 'backState', 'priority'] as const).map((column) => (
                  <td
                    key={column}
                    onClick={() => handleEditClick(index, column)}
                    style={getCellStyle(index, column)}
                    className={styles.tableCell}
                  >
                    {column === 'frontState' || column === 'backState' ? (
                      <>
                        <div className={styles.tagWrapper}>
                          <Tag text={getApiStatusLabel(parseInt(data[column][index]))} />
                        </div>

                        {isEditing[index]?.[column] && (
                          <div
                            className={styles.tagOptions}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {[0, 1, 2].map((value) => (
                              <div
                                key={value}
                                onFocus={() =>
                                  userInfo
                                    ? updateParticipant(userInfo.userName, index, column, true)
                                    : null
                                }
                                onClick={() => {
                                  handleInputChange(column, index, value.toString());
                                  if (userInfo) {
                                    handleBlur(userInfo?.userName, index, column);
                                  }
                                }}
                                className={styles.tagOptionWrapper}
                              >
                                <Tag text={getApiStatusLabel(value)} />
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
                    ) : column === 'method' ? ( 
                      <>
                        <div className={styles.tagWrapper}>
                          <Tag text={data[column][index]} />
                        </div>
                        {isEditing[index]?.[column] && (
                          <div
                            className={styles.tagOptions}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((value) => (
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
                    ) : column === 'frontOwner' || column === 'backOwner' ? ( 
                      <>
                        <div className={styles.tagWrapper}>
                          {data[column][index]}
                        </div>
                        {isEditing[index]?.[column] && (
                          <div
                            className={styles.tagOptions}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {projectInfo?.projectMembers.map((value) => (
                              <div
                                key={value.pmId}
                                onFocus={() =>
                                  userInfo
                                    ? updateParticipant(userInfo.userName, index, column, true)
                                    : null
                                }
                                onClick={() => {
                                  handleInputChange(column, index, value.name);
                                  if (userInfo) {
                                    handleBlur(userInfo?.userName, index, column);
                                  }
                                }}
                                className={styles.tagOptionWrapper}
                              >
                                {value.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : isEditing[index]?.[column] ? (
                      <textarea
                        value={data[column][index]}
                        onFocus={() =>
                          userInfo
                            ? updateParticipant(userInfo.userName, index, column, true)
                            : null
                        }
                        onChange={(e) => handleInputChange(column, index, e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, index, column)}
                        onBlur={() => 
                          userInfo
                            ? handleBlur(userInfo.userName, index, column)
                            : null
                        }
                        autoFocus
                        ref={(el) => el && autoResize(el)}
                        className={styles.editTextarea}
                      />
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
                  <MdDelete
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 버블링 방지
                      handleDeleteRow(index);
                    }}
                  />
                </td>
              </tr>
            </React.Fragment>
          ))}
          <tr className={styles.addRow} onClick={addNewRow}>
            <td colSpan={11} className={styles.addRowTd}>+ Add New Row</td>
          </tr>
        </tbody>
      </table>
      {isModalOpen && selectedRowIndex !== null && (
        <ApiDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          data={data}
          rowIndex={selectedRowIndex}
          setData={setData}
          projectId={projectId}
          stompClient={stompClientRef.current}
        />
      )}
    </div>
  );
};

export default ApiSpecTable;