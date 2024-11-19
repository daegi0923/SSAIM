import React, { useEffect, useState } from 'react';
import styles from './ApplicationsModal.module.css';
import Tag from '../tag/Tag';
import { getDomainLabel, getPositionLabel, getApplicationStatusLabel } from '../../../../utils/labelUtils';
import { getTeamBuildingList, getApplications } from '@features/teamBuilding/apis/teamBuildingBoard/teamBuildingBoard';
import { useNavigate } from 'react-router-dom';

interface ApplicationData {
    applicantId: number;
    recruitingId: number;
    recruitingTitle: string;
    firstDomain: number;
    secondDomain: number;
    position: number;
    status: number;
}

interface MyPost {
    recruitingId: number;
    recruitingTitle: string;
    firstDomain: number;
    secondDomain: number;
    position: string;
}

interface ApplicationsModalProps {
    userId: number | null;
    onClose: () => void;
}

const ApplicationsModal: React.FC<ApplicationsModalProps> = ({ userId, onClose }) => {
    const [applications, setApplications] = useState<ApplicationData[]>([]);
    const [myPost, setMyPost] = useState<MyPost[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                if (userId === null) {
                    return;
                }
                const response = await getApplications(userId); // API 호출
                setApplications(response);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        const params = { author: userId }
        getTeamBuildingList(params)
            .then((response) => {
                const data = response.data.map((item: any) => ({
                    recruitingId: item.postId,
                    recruitingTitle: item.postTitle,
                    firstDomain: item.firstDomain,
                    secondDomain: item.secondDomain,
                }));
                setMyPost(data);
            })
            .catch((err) => {
                console.error(err);
            })

        fetchApplications();
    }, [userId]);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>신청 현황</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {applications.length > 0 && (
                        applications.map((application, index) => (
                            <div
                                key={index}
                                className={styles.applicationRow}
                                onClick={() => {
                                    onClose();
                                    navigate(`/team-building/detail/${application.recruitingId}`)
                                }}
                            >
                                <span className={styles.title}>{application.recruitingTitle}</span>
                                <div className={styles.tags}>
                                    <Tag text={getDomainLabel(application.firstDomain)} />
                                    {application.secondDomain && (
                                        <Tag text={getDomainLabel(application.secondDomain)} />
                                    )}
                                </div>
                                <Tag text={getPositionLabel(application.position)} />
                                <span
                                    className={`${styles.status} ${
                                        application.status === 1
                                            ? styles.accepted
                                            : application.status === 0
                                            ? styles.pending
                                            : styles.rejected
                                    }`}
                                >
                                    {getApplicationStatusLabel(application.status)}
                                </span>
                            </div>
                        ))
                    )}
                    {myPost.length > 0 && (
                        <>
                            {myPost.map((post, index) => (
                                <div
                                    key={`myPost-${index}`}
                                    className={styles.applicationRow}
                                    onClick={() => {
                                        onClose();
                                        navigate(`/team-building/detail/${post.recruitingId}`);
                                    }}
                                >
                                    <span className={styles.title}>{post.recruitingTitle}</span>
                                    <div className={styles.tags}>
                                        <Tag text={getDomainLabel(post.firstDomain)} />
                                        {post.secondDomain && (
                                            <Tag text={getDomainLabel(post.secondDomain)} />
                                        )}
                                    </div>
                                    <Tag text={'팀장'} />
                                    <span
                                        className={`${styles.status} ${styles.accepted}`}
                                    >
                                        가입됨
                                    </span>
                                </div>
                            ))}
                        </>
                    )}
                    {applications.length === 0 && myPost.length === 0 && (
                        <div className={styles.noApplications}>신청 내역과 게시글이 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationsModal;
