import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from '../pages/mainPage/MainPage';
import ProjectListPage from '../pages/project/ProjectListPage';
import ProjectDetailPage from '../pages/project/ProjectDetailPage';
import ProjectSprintPage from '../pages/project/ProjectSprintPage';
import ProjectOutputPage from '../pages/project/ProjectOutputPage';
import ProjectMeetingPage from '../pages/project/meeting/ProjectMeetingPage';
import MeetingCreatePage from '../pages/project/meeting/MeetingCreatePage';
import MeetingDetailPage from '../pages/project/meeting/MeetingDetailPage';
import ProjectRemindPage from '../pages/project/ProjectRemindPage';
import ProjectRemindCreatePage from '../pages/project/ProjectRemindCreatePage';
import MainLayout from '../components/mainLayout/MainLayout';
import TeamBuildingListPage from '../pages/teamBuilding/TeamBuildingListPage';
import RemindIntroPage from '../pages/remind/RemindIntroPage';
import RemindListPage from '../pages/remind/RemindListPage';
import RemindDetailPage from '../pages/remind/RemindDetailPage';
import RemindAllPage from '../pages/remind/RemindAllPage';
import TeamBuildingCreatePage from '../pages/teamBuilding/TeamBuildingCreatePage';
import TeamBuildingDetailPage from '../pages/teamBuilding/TeamBuildingDetailPage';
import TeamBuildingEditPage from '../pages/teamBuilding/TeamBuildingEditPage';
import MyPage from '../pages/myPage/MyPage';
import ProjectCreatePage from '../pages/project/ProjectCreatePage';
import LoginPage from '../pages/account/login/LoginPage';
import NetworkErrorPage from '../pages/error/NetworkErrorPage';
import NotFoundPage from '../pages/error/NotFoundPage';
import SignUpPage from '@pages/account/signup/SignUpPage';
import EditProfilePage from '@/pages/account/editProfile/EditProfilePage';
import ProtectedRoute from '@/components/protectedRoute/ProtectedRoute';
import SprintCreatePage from '@/pages/project/sprint/SprintCreatePage';
import SprintListPage from '@/pages/project/sprint/SprintListPage';
import useUserStore from '@/stores/useUserStore';
const AppRoutes = () => {
  const { isLogin } = useUserStore();
  return (
    <Routes>
      {!isLogin ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
      {/* error */}
      <Route path="/network" element={<NetworkErrorPage />}></Route>
      <Route path="/notfound" element={<NotFoundPage />}></Route>
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<MainPage />} />
        {/* 프로젝트 */}
        <Route path="/project" element={<ProjectListPage />}></Route>
        <Route path="/project/create" element={<ProjectCreatePage />}></Route>
        <Route path="/project/:projectId/info" element={<ProjectDetailPage />}></Route>
        <Route path="/project/:projectId/sprint" element={<ProjectSprintPage />}></Route>
        <Route path="/project/:projectId/sprint/list" element={<SprintListPage />}></Route>
        <Route path="/project/:projectId/sprint/:sprintId" element={<SprintCreatePage />}></Route>
        <Route path="/project/:projectId/output" element={<ProjectOutputPage />}></Route>
        <Route path="/project/:projectId/meeting" element={<ProjectMeetingPage />}></Route>
        <Route path="/project/:projectId/meeting/create" element={<MeetingCreatePage />}></Route>
        <Route path="/project/:projectId/meeting/:meetingId" element={<MeetingDetailPage />}></Route>
        <Route path="/project/:projectId/remind" element={<ProjectRemindPage />}></Route>
        <Route path="/project/:projectId/remind/create" element={<ProjectRemindCreatePage />}></Route>
        {/* 팀빌딩 */}
        <Route path="/team-building" element={<TeamBuildingListPage />}></Route>
        <Route path="/team-building/create" element={<TeamBuildingCreatePage />}></Route>
        <Route path="/team-building/detail/:postId" element={<TeamBuildingDetailPage />}></Route>
        <Route path="/team-building/edit/:postId" element={<TeamBuildingEditPage />}></Route>
        {/* 회고 */}
        <Route path="/remind" element={<RemindIntroPage />}></Route>
        <Route path="/remind/list" element={<RemindListPage />}></Route>
        <Route path="/remind/:remindId" element={<RemindDetailPage />}></Route>
        <Route path="/remind/all" element={<RemindAllPage />}></Route>
        {/* 마이페이지 */}
        <Route path="/profile/edit" element={<EditProfilePage />}></Route>
        <Route path="/profile/:profileOwnerId" element={<MyPage />}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
