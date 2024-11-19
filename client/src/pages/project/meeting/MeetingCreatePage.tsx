import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './MeetingCreatePage.module.css';
import Lottie from "lottie-react";
import micWave from "../../../assets/meeting/micWave.json";
import stopIcon from "../../../assets/meeting/stop.png";
import { createMeeting } from '@/features/project/apis/meeting/createMeeting';
import { MeetingPostDTO } from '@features/project/types/meeting/MeetingDTO';
import Loading from '@/components/loading/Loading';

const MeetingCreatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0, milliseconds: 0 });
  const { meetingTitle, selectedParticipants } = location.state || {};
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    console.log('전달된 회의 제목:', meetingTitle);
    console.log('선택된 참가자:', selectedParticipants);

    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          let { minutes, seconds, milliseconds } = prevTime;
          milliseconds += 10;
          if (milliseconds >= 100) {
            milliseconds = 0;
            seconds += 1;
          }
          if (seconds >= 60) {
            seconds = 0;
            minutes += 1;
          }
          return { minutes, seconds, milliseconds };
        });
      }, 100);
    }

    const startRecording = async () => {
      try {
        audioChunksRef.current = [];

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // 비디오 트랙을 추가하여 mp4 형식을 지원
        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(destination);

        const recorder = new MediaRecorder(destination.stream, { mimeType: 'video/mp4' });
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'video/mp4' });
          audioChunksRef.current = [];
          uploadMeeting(audioBlob); // 녹음 종료 후 API 호출
        };

        recorder.start();
      } catch (error) {
        console.error("마이크 접근 권한을 요청하는 중 오류가 발생했습니다:", error);
      }
    };

    if (isRecording) {
      startRecording();
    }

    return () => {
      clearInterval(interval);
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  const handleStopClick = () => {
    console.log("Stop button clicked");
    setIsRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
    } else {
      console.log("Media recorder is not initialized");
    }
  };

  // API 호출 함수
  const uploadMeeting = async (audioBlob: Blob) => {
    if (!projectId || !meetingTitle) return;

    setIsLoading(true);

    // Blob을 File 객체로 변환
    const audioFile = new File([audioBlob], `meeting_audio_${Date.now()}.mp4`, { type: audioBlob.type });
    console.log("audioFile", audioFile)

    // MeetingPostDTO 객체 생성
    const meetingPostDTO: MeetingPostDTO = {
      audiofile: audioFile,
      meetingRequestDto: {
        meetingTitle,
        projectId: parseInt(projectId),
      },
    };

    try {
      const response = await createMeeting(parseInt(projectId), meetingPostDTO);
      console.log("Meeting created successfully:", response);
      navigate(`/project/${projectId}/meeting/${response.meetingId}`);
    } catch (error) {
      console.error("Error uploading meeting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;  // Loading 요소 렌더링
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>
        {formatTime(timer.minutes)}:{formatTime(timer.seconds)}:{formatTime(timer.milliseconds)}
      </h1>
      <Lottie animationData={micWave} style={{ width: 400, height: 400 }} />
      <img
        src={stopIcon}
        alt="Stop Icon"
        className={styles.stopIcon}
        onClick={handleStopClick}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};

export default MeetingCreatePage;
