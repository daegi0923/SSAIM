import Error404 from '../../assets/error/Error404.png'
import styles from './NotFoundPage.module.css'

const notFoundPage = () => {
    const goBack = () => {
        window.history.back();
    };

    const goToHome = () => {
        window.location.href = '/';
    };
    return (
        <div className={styles.container}>
            <img className={styles.image} src={Error404} alt="Not Found" />
            <div className={styles.content}>
                <p>죄송합니다, 요청하신 페이지를 찾을 수 없습니다.</p>
                <div className={styles.buttonSection}>
                    <button className={styles.button} onClick={goBack}>이전으로</button>
                    <button className={styles.button} onClick={goToHome}>메인으로</button>
                </div>
            </div>
        </div>
    );
};
  
export default notFoundPage;

  