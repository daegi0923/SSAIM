import React from 'react';
import SignUpForm from '@/features/user/components/signUp/SignUpForm';
import styles from './SignUpPage.module.css';

const SignUpPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.signUpForm}>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
