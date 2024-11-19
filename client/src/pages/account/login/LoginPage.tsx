import styles from './LoginPage.module.css';
import LoginForm from '../../../features/user/components/login/LoginForm';
import React from 'react';

const LoginPage:React.FC = () => {
  return (
    <div className={styles.mainLayout}>
      <LoginForm/>
    </div>
  );
};

export default LoginPage;
