import React, { ReactNode } from 'react';
import styles from './Navbar.module.css';
import Logo from '/SSAIM.png';

import {
  IoHomeOutline,
  IoLayersOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoLogOutOutline,
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';
import defaultProfile from '@/assets/profile/DefaultProfile.png';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';

// 메뉴 아이템의 타입 정의
interface MenuItem {
  icon: ReactNode;
  text: string;
  path: string;
}

// NavItem 컴포넌트의 props 타입 정의
interface NavItemProps {
  icon: ReactNode;
  text: string;
  onClick: () => void;
}
// menuItem 에 navbar 에서 사용할 item들의 정보 배열으로 저장
const menuItems: MenuItem[] = [
  { icon: <IoHomeOutline className={styles.icon} />, text: 'Dashboard', path: '/' },
  { icon: <IoLayersOutline className={styles.icon} />, text: '프로젝트', path: '/project' },
  { icon: <IoPeopleOutline className={styles.icon} />, text: '팀 구성 게시판', path: '/team-building' },
  { icon: <IoDocumentTextOutline className={styles.icon} />, text: '회고', path: '/remind' },
];

// NavItem 컴포넌트 정의
const NavItem: React.FC<NavItemProps> = ({ icon, text, onClick }) => (
  <div className={styles.navItem} onClick={onClick}>
    {icon}
    <span className={styles.navText}>{text}</span>
  </div>
);

// Navbar 컴포넌트 정의
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { userId, logout } = useUserStore();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const { data: userInfo } = useUserInfoData(userId);
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.navList}>
        {/* 프로필 이미지와 이름 */}
        <div className={styles.title}>
          <img className={styles.logo} src={Logo}></img> <span className={styles.titleText}>{"SSAIM"}</span>
        </div>

        {/* 메뉴 아이템 리스트 */}
        {menuItems.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            text={item.text}
            onClick={() => {
              navigate(item.path);
            }}
          />
        ))}
      </div>

      {/* 로그아웃 버튼 */}
      <div className="">
        <div className={styles.footer}>
          <NavItem
            icon={
              <img
                className={styles.profileImage}
                src={userInfo?.userProfileImage ? userInfo?.userProfileImage : defaultProfile}
              ></img>
            }
            text={userInfo?.userName ? userInfo?.userName : ''}
            onClick={() => {
              navigate(`/profile/${userId}`);
            }}
          />
          <NavItem icon={<IoLogOutOutline className={styles.icon} />} text="로그아웃" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
