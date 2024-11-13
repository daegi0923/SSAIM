package com.e203.global.utils;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class FileUploaderImpl implements FileUploader {

    private final AmazonS3 s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.cloudfront}")
    private String cloudFront;

    @Override
    public String upload(MultipartFile profileImage) {
        // 원본 파일 이름 가져오기
        String originalFileName = profileImage.getOriginalFilename();
        // UUID를 사용하여 고유한 파일 이름 생성
        String fileExtension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
        String uniqueFileName = UUID.randomUUID() + fileExtension;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(profileImage.getSize());
        metadata.setContentType(profileImage.getContentType());

        try {
            s3Client.putObject(bucket, uniqueFileName, profileImage.getInputStream(), metadata);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String url = s3Client.getUrl(bucket, uniqueFileName).toString();

        return cloudFront + url.split("/")[url.split("/").length - 1];
    }
}
