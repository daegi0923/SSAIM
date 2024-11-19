import NetworkErrorImg from '../../assets/error/NetworkError.png'
import styles from './NetworkErrorPage.module.css';
import Button from '../../components/button/Button';

const networkErrorPage = () => {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Network Error</h1>
                <p>네트워크 에러가 발생했습니다.</p>
                <p>잠시 후 다시 시도해 주세요.</p>
                <br/>
                <Button colorType='blue' size='small' onClick={handleRefresh}>새로고침</Button>
            </div>
            <img className={styles.image} src={NetworkErrorImg} alt="Network Error" />
        </div>
    );
};
  
export default networkErrorPage;
  