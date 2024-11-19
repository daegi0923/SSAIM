import React, { useState, useEffect } from "react";
import styles from './TeamBuildingBoard.module.css';
import DropDown from '../filterDropDown/FilterDropDown';
import CategoryDropdown from "../filterDropDown/CategoryDropDown";
import Tag from '../tag/Tag';
import useUserStore from "@/stores/useUserStore";
import { getTeamBuildingList } from "../../apis/teamBuildingBoard/teamBuildingBoard";
import { AiOutlineProfile } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { getDomainLabel, getRegionLabel } from "../../../../utils/labelUtils";
import DefaultProfile from "../../../../assets/profile/DefaultProfile.png"
import ApplicationsModal from "../modal/ApplicationsModal";
import { GrPowerReset } from "react-icons/gr";

type TeamBuildingData = {
    postId: number;
    campus: number;
    authorId: number;
    postTitle: string;
    firstDomain: number;
    secondDomain: number;
    status: number;
    recruitedTotal: number;
    memberTotal: number;
    authorProfileImageUrl: string;
    authorName: string;
    infraLimit: number;
    infraCurrent: number;
    backendLimit: number;
    backendCurrent: number;
    frontLimit: number;
    frontCurrent: number;
};

const TeamBuildingBoard: React.FC = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<TeamBuildingData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userId } = useUserStore();
    const [showMyPost, setShowMyPost] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const fetchData = (pageNum: number, isMyPost: boolean = false) => {
        setLoading(true);
        const params = isMyPost
            ? { author: userId } 
            : {
                title: searchQuery || undefined,
                domain: selectedDomain || undefined,
                campus: selectedRegion || undefined,
                position: selectedPosition || undefined,
                pageNum,
            };

        getTeamBuildingList(params)
            .then((response) => {
                setData(response.data);
                setCurrentPage(response.currentPage);
                setTotalPages(response.totalPages);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(true);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    // 필터링 상태 관리
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const regionOptions = [
        { value: '1', label: '서울' },
        { value: '2', label: '대전' },
        { value: '3', label: '광주' },
        { value: '4', label: '구미' },
        { value: '5', label: '부울경' },
        { value: '', label: '전체' },
    ];

    const domainCategory = [
        {
            label: '공통',
            options: [
                { value: '1', label: '웹기술' },
                { value: '2', label: '웹디자인' },
                { value: '3', label: '모바일' },
                { value: '4', label: 'AIoT' },
            ],
        },
        {
            label: '특화',
            options: [
                { value: '5', label: 'AI영상' },
                { value: '6', label: 'AI음성' },
                { value: '7', label: '추천' },
                { value: '8', label: '분산' },
                { value: '9', label: '자율주행' },
                { value: '10', label: '스마트홈' },
                { value: '11', label: 'P2P' },
                { value: '12', label: '디지털거래' },
                { value: '13', label: '메타버스' },
                { value: '14', label: '핀테크' },
            ],
        },
        {
            label: '자율',
            options: [
                { value: '15', label: '자유주제' },
                { value: '16', label: '기업연계' },
                { value: '17', label: '오픈소스' },
            ],
        },
    ];
    
    const positionOptions = [
        { value: '1', label: 'FE' },
        { value: '2', label: 'BE' },
        { value: '3', label: 'Infra' },
        { value: '', label: '전체' },
    ];

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
    const handleDropdownToggle = (dropdownName: string) => {
      setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    };

    const handleSelect = (type: 'region' | 'domain' | 'position' | 'state', selectedOption: { value: string }) => {
        if (type === 'region') {
            setSelectedRegion(selectedOption.value);
        } else if (type === 'domain') {
            setSelectedDomain(selectedOption.value);
        } else if (type === 'position') {
            setSelectedPosition(selectedOption.value);
        } 
    };

    useEffect(() => {
        if (!showMyPost) {
            fetchData(1);
        }
    }, [selectedRegion, selectedDomain, selectedPosition, showMyPost]);

    const handleShowMyPostsToggle = () => {
        setShowMyPost(!showMyPost);
        fetchData(1, !showMyPost);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => fetchData(1, showMyPost);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            fetchData(page);
        }
    };

    // 페이지 번호 계산 함수
    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <>
            <div className={styles.board}>
                <div className={styles.boardHeader}>
                    <div className={styles.filterSection}>
                        <DropDown 
                            options={regionOptions} 
                            selectedOption={selectedRegion === '' ? null : regionOptions.find(option => option.value === selectedRegion) || null} 
                            onSelect={(option) => handleSelect('region', option)} 
                            isOpen={openDropdown === '지역'}
                            onToggle={() => handleDropdownToggle('지역')}
                            placeholder="지역" 
                        />
                        <CategoryDropdown 
                            categories={domainCategory} 
                            selectedOption={
                                selectedDomain === '' ? null : domainCategory.flatMap(category => category.options).find(option => option.value === selectedDomain) || null
                            }
                            onSelect={(option) => handleSelect('domain', option)} 
                            isOpen={openDropdown === '도메인'}
                            onToggle={() => handleDropdownToggle('도메인')}
                            placeholder="도메인" 
                        />
                        <DropDown 
                            options={positionOptions} 
                            selectedOption={selectedPosition === '' ? null : positionOptions.find(option => option.value === selectedPosition) || null} 
                            onSelect={(option) => handleSelect('position', option)} 
                            isOpen={openDropdown === '직무'}
                            onToggle={() => handleDropdownToggle('직무')}
                            placeholder="직무" 
                        />
                        <GrPowerReset 
                            className={styles.resetButton}
                            onClick={() => {
                                    setSelectedRegion('');
                                    setSelectedDomain('');
                                    setSelectedPosition('');
                                }
                            }
                        />
                    </div>
                    <div className={styles.searchActions}>
                        <button
                            className={`${styles.myPostButton} ${showMyPost ? styles.active : ''}`}
                            onClick={handleShowMyPostsToggle}
                        >
                            내 글 보기
                        </button>
                        <div className={styles.searchBar}>
                            <input 
                                className={styles.searchInput} 
                                type="text" 
                                placeholder="검색" 
                                value={searchQuery}
                                onChange={handleInputChange}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                        </div>
                        <div className={styles.actionButtons}>
                            <button onClick={handleSearch}><IoSearchOutline /> 검색</button> 
                            <button onClick={openModal}><AiOutlineProfile /> 신청현황</button>
                            <button onClick={() => navigate('/team-building/create')}><FiPlus /> 팀 생성</button>
                        </div>
                    </div>
                </div>
                <div className={styles.boardContent}>
                    {!loading && data?.length > 0 ? (
                        data.map((item, index) => {
                            return (
                                <div key={index} className={styles.boardItem} onClick={() => navigate(`/team-building/detail/${item.postId}`)}>
                                    <span className={styles.region}>[{getRegionLabel(item.campus)}]</span>
                                    <span className={styles.title}>{item.postTitle}</span>
                                    <div className={styles.category}>
                                        <Tag text={getDomainLabel(item.firstDomain)} />
                                        { item.secondDomain && <Tag text={getDomainLabel(item.secondDomain)} />}
                                    </div>
                                    <div className={styles.state}>
                                        {/* <Tag text={getStatusLabel(item.status)} /> */}
                                        <span>{item.recruitedTotal}/{item.memberTotal}</span>
                                    </div>
                                    <div className={styles.position}>
                                        {(item.frontLimit - item.frontCurrent) > 0 && <Tag text={'FE'} />}
                                        {(item.backendLimit - item.backendCurrent) > 0 && <Tag text={'BE'} />}
                                        {(item.infraLimit - item.infraCurrent) > 0 && <Tag text={'Infra'} />}
                                    </div>
                                    <div className={styles.profile}>
                                        <img
                                            src={item.authorProfileImageUrl ? item.authorProfileImageUrl : DefaultProfile}
                                            alt="Profile Image"
                                            className={styles.profileImg}
                                        />
                                        <span>{item.authorName}</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : error ? (
                        <div className={styles.noResults}>
                            데이터를 가져오지 못했습니다. 다시 시도하세요.
                        </div>
                    ) : loading ? (
                        <div className={styles.noResults}>
                            Loading...
                        </div>
                    ) : (
                        <div className={styles.noResults}>
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
                <div className={styles.pagination}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        이전
                    </button>
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            className={page === currentPage ? styles.activePage : ''}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        다음
                    </button>
                </div>
            </div>
            {isModalOpen && <ApplicationsModal userId={userId} onClose={closeModal} />}
        </>
    );
};

export default TeamBuildingBoard;