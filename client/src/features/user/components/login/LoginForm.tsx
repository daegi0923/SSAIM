// LoginForm.tsx
import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { login } from '@features/user/apis/loginApi';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // 오류 상태 추가
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/'); // 성공 시 메인 페이지로 이동
    } catch (error) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.'); // 실패 시 에러 메시지 설정
      console.log(error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.header}>
          <h1>Login</h1>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            placeholder="Email"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            placeholder="Password"
          />
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>} {/* 오류 메시지 표시 */}
        <button type="submit" className={styles.loginButton}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
