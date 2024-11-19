import React, { useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import styles from './RemindAllPage.module.css';
import remindBG from '../../assets/remind/remindBG.png';
import ImageSample from '@/assets/remind/ImageSample.png'
import useUserStore from '@/stores/useUserStore';
import { useDevelopStory } from '@/features/remind/hooks/useDevelopStory';
import { DevelopStoryDTO } from '@features/remind/types/DevelopStoryDTO';

interface CoverProps {
  project: DevelopStoryDTO;
  pageIndex: number;
}

const Cover = React.forwardRef<HTMLDivElement, CoverProps>(
  ({ project, pageIndex  }, ref) => (
    <div className={styles.cover} ref={ref}>
      <div className={styles.coverContent}>
        <h1 className={styles.projectName}>{project.projectName}</h1>
        <p className={styles.projectDate}>{project.projectStartDate} ~ {project.projectEndDate}</p>
      </div>
      <div className={styles.pageNumber_W}>- {pageIndex + 1} -</div>
    </div>
  )
);

interface ImagePageProps {
  image: string;
  pageIndex: number;
}

const ImagePage = React.forwardRef<HTMLDivElement, ImagePageProps>(
  ({ image, pageIndex  }, ref) => (
    <div className={styles.page} ref={ref}>
      <div className={styles.imagePageContent}>
        <img src={image || ImageSample} alt="Weekly Reminder" className={styles.weeklyImage} />
      </div>
      <div className={styles.pageNumber_W}>- {pageIndex + 1} -</div>
    </div>
  )
);

interface ReportPageProps {
  report: string;
  pageIndex: number;
}

const ReportPage = React.forwardRef<HTMLDivElement, ReportPageProps>(
  ({ report, pageIndex }, ref) => (
    <div className={styles.page} ref={ref}>
      <div className={styles.reportPageContent}>
        <div className={styles.reportText}>{report}</div>
      </div>
      <div className={styles.pageNumber}>- {pageIndex + 1} -</div>
    </div>
  )
);

const splitContentToPages = (content: string, maxLength: number) => {
  const pages: string[] = [];
  for (let i = 0; i < content.length; i += maxLength) {
    pages.push(content.slice(i, i + maxLength));
  }
  return pages;
};

const RemindAllPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useUserStore();
  const { data } = useDevelopStory({ userId: userId ?? 0 });

  useEffect(() => {
    // 페이지에 들어오면 스크롤을 숨김
    document.body.style.overflow = 'hidden';
    return () => {
      // 페이지를 떠나면 스크롤을 복원
      document.body.style.overflow = 'auto';
    };
  }, []);

  let currentPageIndex = 0; 

  const pages = data?.flatMap((project) => [
    <Cover key={`cover-${project.projectId}`} project={project} pageIndex={currentPageIndex++} />,
    ...project.weeklyRemind.flatMap((remind, index) => [
      remind.imageUrl && (
        <ImagePage
          key={`image-${project.projectId}-${currentPageIndex}`}
          image={remind.imageUrl}
          pageIndex={currentPageIndex++}
        />
      ),
      ...splitContentToPages(remind.content, 500).map((pageContent) => (
        <ReportPage
          key={`report-${project.projectId}-${index}-${currentPageIndex}`}
          report={pageContent}
          pageIndex={currentPageIndex++}
        />
      )),
    ]).filter(Boolean),
  ]) ?? [];

  // 빈 페이지 추가
  pages.push(
    <div className={styles.page} key="end-page" ref={React.createRef<HTMLDivElement>()}>
      <div className={styles.endPageContent}>
        <h1 className={styles.end}>The End</h1>
      </div>
      <div className={styles.pageNumber_W}>- {currentPageIndex + 1} -</div>
    </div>
  );

  return (
    <div className={styles.mainContainer}>
      <div className={styles.buttonBox}>
        <button className={styles.backButton} onClick={() => navigate('/remind')}>
          뒤로가기
        </button>
      </div>
      <div className={styles.bookWrapper}>
        <img src={remindBG} alt="remindBG" className={styles.remindBG} />
        <HTMLFlipBook
          width={600}
          height={650}
          size="fixed"
          minWidth={500}
          maxWidth={1000}
          minHeight={300}
          maxHeight={800}
          maxShadowOpacity={0.5}
          className={styles.book}
          showCover={false}
          drawShadow={true}
          startPage={0}
          flippingTime={1000}
          style={{ margin: '0 auto', overflow: 'visible' }}
          usePortrait={false}
          startZIndex={0}
          autoSize={false}
          mobileScrollSupport={false}
          useMouseEvents={true}
          disableFlipByClick={false}
          swipeDistance={0}
          clickEventForward={true}
          showPageCorners={true}
        >
          {pages}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default RemindAllPage;
