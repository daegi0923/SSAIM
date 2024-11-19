import React, { useRef, useState, useEffect } from "react";
import styles from "./ERD.module.css";
import { getErd, postErd, patchErd } from "../../apis/webSocket/erd";
import { showToast } from "@/utils/toastUtils";
import Button from '@components/button/Button';

interface ERDProps {
  projectId: string;
}

const ERD: React.FC<ERDProps> = ({ projectId }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null); // 이미지 상태
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false); 


  const fetchErd = async () => {
    try {
      const response = await getErd(projectId);
      if (response === 'fail') {
        setImageUrl(null);
        return;
      }
      setImageUrl(response); // 서버에서 받은 이미지 URL로 설정
    } catch (error) {
      console.error("Error fetching ERD:", error);
    }
  };

  useEffect(() => {
    fetchErd();
  }, [projectId]);

  const validateFileSignature = async (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const buffer = new Uint8Array(e.target?.result as ArrayBuffer);
        const signature = buffer.slice(0, 8).join(" ");
  
        const isJPEG = signature.startsWith("255 216");
        const isPNG = signature.startsWith("137 80 78 71 13 10 26 10");
  
        resolve(isJPEG || isPNG);
      };
  
      reader.onerror = () => reject(new Error("파일을 읽는 도중 오류가 발생했습니다."));
      reader.readAsArrayBuffer(file.slice(0, 8));
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxFileSize = 100 * 1024 * 1024;
      const isValidImage = await validateFileSignature(file);

      if (file.size > maxFileSize) {
        showToast.error("파일 크기가 100MB를 초과할 수 없습니다.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
  
      if (!allowedTypes.includes(file.type)) {
        showToast.error("허용된 파일 형식은 JPG 및 PNG입니다.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (!isValidImage) {
        showToast.error("읽을 수 없는 파일입니다.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
  
      const formData = new FormData();
      formData.append("ErdImage", file);
  
      try {
        if (imageUrl === null) {
          // 이미지가 null일 경우 POST 요청
          postErd(projectId, formData)
            .then(() => {
              fetchErd();
            })
            .catch((error) => {
              console.error("Error uploading ERD:", error);
            });
        } else {
          // 이미지가 있을 경우 PATCH 요청
          patchErd(projectId, formData)
            .then(() => {
              fetchErd();
            })
            .catch((error) => {
              console.error("Error updating ERD:", error);
            });
        }
      } catch (error) {
        console.error("Error uploading ERD:", error);
      }
    }
  };

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 파일 선택 창 열기
    }
  };

  // const handleImageClick = () => {
  //   setIsModalOpen(true); // 모달 열기
  // };

  // const handleModalClose = () => {
  //   setIsModalOpen(false); // 모달 닫기
  // };
  
  const handleViewImage = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className={styles.erd}>
      {imageUrl ? (
        <>
          <div className={styles.editButton}>
            <Button size='custom' colorType='purple' onClick={handleEditClick}>수정</Button>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <img
            src={imageUrl}
            alt="ERD Image"
            className={styles.erdImage}
            // onClick={handleImageClick}
            onClick={handleViewImage}
          />
        </>
      ) : (
        <>
          <div className={styles.noImageText} onClick={handleEditClick}>
            <p>아직 등록된 이미지가 없습니다.</p>
            <p>여기를 눌러 ERD 이미지를 생성해주세요.</p>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </>
      )}
      {/* {isModalOpen && imageUrl && (
        <div className={styles.modal} onClick={handleModalClose}>
          <span className={styles.modalClose}>&times;</span>
          <img src={imageUrl} alt="ERD Enlarged" />
        </div>
      )} */}
    </div>
  );
};

export default ERD;
