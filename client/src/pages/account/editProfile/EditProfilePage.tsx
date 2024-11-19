import styles from './EditProfilePage.module.css';
import EditProfile from '@features/user/components/editProfile/EditProfile';
import React from 'react';

const EditProfilePage:React.FC = () => {
  return (
    <div className={styles.mainLayout}>
      <div className={styles.container}>
        <EditProfile/>
      </div>
    </div>
  );
};

export default EditProfilePage;
