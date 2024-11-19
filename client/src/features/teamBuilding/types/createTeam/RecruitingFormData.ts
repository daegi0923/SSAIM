export interface RecruitingFormData {
    author: number | null;
    title: string;
    content: string;
    startDate: string | null;
    endDate: string | null;
    firstDomain: number;
    secondDomain?: number;
    campus: number;
    memberTotal: number;
    memberInfra: number;
    memberBackend: number;
    memberFrontend: number;
    position: number;
}