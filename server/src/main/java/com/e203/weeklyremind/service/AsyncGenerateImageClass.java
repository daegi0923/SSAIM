package com.e203.weeklyremind.service;

import com.e203.global.utils.ChatAiService;
import com.e203.global.utils.FileUploader;
import com.e203.weeklyremind.entity.WeeklyRemind;
import com.e203.weeklyremind.repository.WeeklyRemindRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.e203.global.utils.ByteArrayMultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
@RequiredArgsConstructor
public class AsyncGenerateImageClass {

    private final ChatAiService chatAiService;
    private final FileUploader fileUploader;
    private final WeeklyRemindRepository weeklyRemindRepository;

    @Async
    @Transactional
    public void generateImage(String message, int weeklyRemindId) {
        MultipartFile image1 = downloadImageAsMultipartFile(chatAiService.generateImage(message), "image1");
        String imgUrl = fileUploader.upload(image1);

        WeeklyRemind weeklyRemind = weeklyRemindRepository.findById(weeklyRemindId).orElse(null);

        weeklyRemind.updateWeeklyRemindImg(imgUrl);
    }

    private MultipartFile downloadImageAsMultipartFile(String imageUrl, String fileName) {
        try {
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();

            String contentType = connection.getContentType();

            try (InputStream inputStream = connection.getInputStream()) {
                byte[] fileBytes = inputStream.readAllBytes();
                return new ByteArrayMultipartFile(fileBytes, fileName, contentType);
            }
        } catch (IOException e) {
            // 예외 발생 시 로깅
            System.err.println("Error downloading image from URL: " + e.getMessage());
            e.printStackTrace();
            return null; // 예외 처리 후 null 반환
        }
    }
}
