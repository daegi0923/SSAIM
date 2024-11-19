export interface MeetingRequestDto {
    meetingTitle: string;
    projectId: number;
}

export interface MeetingPostDTO {
    audiofile: File;
    meetingRequestDto: MeetingRequestDto;
}

export interface MeetingItemDTO {
    meetingId: number;
    projectId: number;
    meetingTitle: string;
    meetingFirstVoiceText: string;
    meetingCreateTime: string;
    meetingVoiceTime: number;
}

export interface MeetingListDTO {
    meetingItems: MeetingItemDTO[];
}


// Speaker 정보를 정의합니다.
export interface Speaker {
    label: string;
    name: string;
    edited?: boolean;
}
  
  // Segment 정보를 정의합니다.
export interface Segment {
    start: number;
    end: number;
    text: string;
    confidence: number;
    diarization: Record<string, unknown>; // 필요한 경우 구체적인 타입으로 변경
    speaker: Speaker;
    words: Array<unknown>; // `words`의 상세 타입을 알고 있다면, 그에 맞게 설정합니다.
    textEdited: string;
}
  
  // STT Response 정보를 정의합니다.
export interface SttResponseDto {
    segments: Segment[];
    text: string;
    speakers: Speaker[];
}
  
  // Meeting 정보를 정의합니다.
export interface MeetingDetailDTO {
    meetingId: number;
    projectId: number;
    meetingTitle: string;
    meetingVoiceUrl: string;
    sttResponseDto: SttResponseDto;
    meetingCreateTime: string; // Date 타입으로 변환할 경우 `string`을 `Date`로 변경
    meetingVoiceTime: number;
}

export interface SpeakersPutDTO {
    speakers: Speaker[];
}

export interface MeetingTitlePutDTO {
    meetingTitle: string;
    projectId: number;
}

export interface MeetingScriptPutDTO {
    projectId: number;
    start: number|string;
    script: string;  
}
