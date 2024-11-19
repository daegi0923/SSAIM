package com.e203.meeting.service;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import org.springframework.web.multipart.MultipartFile;


@Service
public class NaverCloudClient {

    @Value("${spring.naver.cloud.secret}")
    private String secret;

    @Value("${spring.naver.cloud.url}")
    private String invokeUrl;

    private Header[] HEADERS;
    private final CloseableHttpClient httpClient = HttpClients.createDefault();
    private final Gson gson = new Gson();


    @PostConstruct
    private void initHeaders() {
        HEADERS = new Header[]{
                new BasicHeader("Accept", "application/json"),
                new BasicHeader("X-CLOVASPEECH-API-KEY", secret),
        };
    }

    @Getter
    @Setter
    public static class Boosting {
        private String words;

        public String getWords() {
            return words;
        }

        public void setWords(String words) {
            this.words = words;
        }
    }

    @Getter
    @Setter
    public static class Diarization {
        private Boolean enable = Boolean.FALSE;
        private Integer speakerCountMin;
        private Integer speakerCountMax;

        public Boolean getEnable() {
            return enable;
        }

        public void setEnable(Boolean enable) {
            this.enable = enable;
        }

        public Integer getSpeakerCountMin() {
            return speakerCountMin;
        }

        public void setSpeakerCountMin(Integer speakerCountMin) {
            this.speakerCountMin = speakerCountMin;
        }

        public Integer getSpeakerCountMax() {
            return speakerCountMax;
        }

        public void setSpeakerCountMax(Integer speakerCountMax) {
            this.speakerCountMax = speakerCountMax;
        }
    }

    @Getter
    @Setter
    public static class Sed {
        private Boolean enable = Boolean.FALSE;

        public Boolean getEnable() {
            return enable;
        }

        public void setEnable(Boolean enable) {
            this.enable = enable;
        }
    }

    @Getter
    @Setter
    public static class NestRequestEntity {
        private String language = "ko-KR";
        private String completion = "sync";
        private String callback;
        private Map<String, Object> userdata;
        private Boolean wordAlignment = Boolean.FALSE;
        private Boolean fullText = Boolean.TRUE;
        private List<Boosting> boostings;
        private String forbiddens;
        private Diarization diarization;
        private Sed sed;

    }

    public String url(String url, NestRequestEntity nestRequestEntity) {
        HttpPost httpPost = new HttpPost(invokeUrl + "/recognizer/url");
        httpPost.setHeaders(HEADERS);
        Map<String, Object> body = new HashMap<>();
        body.put("url", url);
        body.put("language", nestRequestEntity.getLanguage());
        body.put("completion", nestRequestEntity.getCompletion());
        body.put("callback", nestRequestEntity.getCallback());
        body.put("userdata", nestRequestEntity.getUserdata());
        body.put("wordAlignment", nestRequestEntity.getWordAlignment());
        body.put("fullText", nestRequestEntity.getFullText());
        body.put("forbiddens", nestRequestEntity.getForbiddens());
        body.put("boostings", nestRequestEntity.getBoostings());
        body.put("diarization", nestRequestEntity.getDiarization());
        body.put("sed", nestRequestEntity.getSed());
        HttpEntity httpEntity = new StringEntity(gson.toJson(body), ContentType.APPLICATION_JSON);
        httpPost.setEntity(httpEntity);
        return execute(httpPost);
    }

    public String objectStorage(String dataKey, NestRequestEntity nestRequestEntity) {
        HttpPost httpPost = new HttpPost(invokeUrl + "/recognizer/object-storage");
        httpPost.setHeaders(HEADERS);
        Map<String, Object> body = new HashMap<>();
        body.put("dataKey", dataKey);
        body.put("language", nestRequestEntity.getLanguage());
        body.put("completion", nestRequestEntity.getCompletion());
        body.put("callback", nestRequestEntity.getCallback());
        body.put("userdata", nestRequestEntity.getUserdata());
        body.put("wordAlignment", nestRequestEntity.getWordAlignment());
        body.put("fullText", nestRequestEntity.getFullText());
        body.put("forbiddens", nestRequestEntity.getForbiddens());
        body.put("boostings", nestRequestEntity.getBoostings());
        body.put("diarization", nestRequestEntity.getDiarization());
        body.put("sed", nestRequestEntity.getSed());
        StringEntity httpEntity = new StringEntity(gson.toJson(body), ContentType.APPLICATION_JSON);
        httpPost.setEntity(httpEntity);
        return execute(httpPost);
    }

    public String upload(MultipartFile file, NestRequestEntity nestRequestEntity) throws IOException {

        File file2 = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());

        // MultipartFile의 내용을 File에 복사
        file.transferTo(file2);

        HttpPost httpPost = new HttpPost(invokeUrl + "/recognizer/upload");
        httpPost.setHeaders(HEADERS);
        HttpEntity httpEntity = MultipartEntityBuilder.create()
                .addTextBody("params", gson.toJson(nestRequestEntity), ContentType.APPLICATION_JSON)
                .addBinaryBody("media", file2, ContentType.MULTIPART_FORM_DATA, file.getName())
                .build();
        httpPost.setEntity(httpEntity);
        return execute(httpPost);
    }

    private String execute(HttpPost httpPost) {
        try (final CloseableHttpResponse httpResponse = httpClient.execute(httpPost)) {
            final HttpEntity entity = httpResponse.getEntity();
            return EntityUtils.toString(entity, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}



