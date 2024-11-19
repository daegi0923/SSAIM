import { useState } from 'react';
import SearchResultItem from './SearchResultItem';
import styles from './SearchModal.module.css';
import { useUserSearchQuery } from '@/features/project/hooks/useUserSearchQuery';
import { TeamMemberDTO } from '@/features/project/types/TeamMemberDTO';

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tempQuery, setTempQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'userName' | 'userEmail' | 'userNickname'>('userName');
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const { data: searchResults, refetch } = useUserSearchQuery(searchQuery, searchType, isSearchEnabled);
  const handleSearch = async () => {
    setSearchQuery(tempQuery);
    setIsSearchEnabled(true);
    await refetch(); // 검색 버튼 클릭 시에만 요청을 보냄
    setIsSearchEnabled(false); // 검색 후 다시 비활성화
  };
  const handleEnterKeyDown =  (event : React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter') {
      console.log('enter key pressed', tempQuery)
      handleSearch();
    }
  }
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>사용자 검색</h3>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>
        <hr />
        <div className={styles.searchContainer}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'userName' | 'userEmail' | 'userNickname')}
            className={styles.searchTypeSelect}
          >
            <option value="userName">이름</option>
            <option value="userEmail">이메일</option>
            <option value="userNickname">닉네임</option>
          </select>
          <input
            type="text"
            value={tempQuery}
            onChange={(e) => setTempQuery(e.target.value)}
            onKeyDown={handleEnterKeyDown}
            placeholder="검색어 입력"
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            검색
          </button>
        </div>
        <div className={styles.results}>
          {searchQuery === '' ? (
            <p>검색어를 입력해 주세요.</p> // 검색어가 없을 때 메시지
          ) : searchResults.length === 0 ? (
            <p>검색 결과가 없습니다.</p> // 검색어가 있지만 결과가 없을 때 메시지
          ) : (
            searchResults.map((result: TeamMemberDTO, i: number) => <SearchResultItem key={i} member={result} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
