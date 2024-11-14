package com.e203.global.utils;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.openai.OpenAiImageModel;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.stereotype.Service;

@Service
public class ChatAiService {

    private final ChatClient chatClient;
    private final OpenAiImageModel openAiImageModel;

    public ChatAiService(ChatClient.Builder chatClientBuilder, OpenAiImageModel openaiImageModel) {
        this.chatClient = chatClientBuilder.build();
        this.openAiImageModel = openaiImageModel;
    }

    public String generateWeeklyRemind(String message) {

        return chatClient.prompt()
                .system("아래의 내용의 답변을 한글로 해주고 일기 형태로 요약해줘 1일차 2일차 이렇게 구분하지 말고 하나의 이야기처럼 요약해줘")
                .user(message)
                .call()
                .content();
    }

    public String generateMeetingSummary(String message) {

        return chatClient.prompt()
                .system("아래의 내용을 전체 대화의 주제, 나온 의견들, 미래 방향성의 3주제로 나누어서 요약해줘")
                .user(message)
                .call()
                .content();
    }

    public String generateProposal(String message) {

        return chatClient.prompt()
                .system("사용자의 요청을 바탕으로 소프트웨어 프로젝트 기획서를 작성해줘. 기획서 양식은 아래와 같이 한글로 자세하게 작성해줘.\n" +
                        "{\n" +
                        "\t  \"title\": \"[서비스 명]\",\n" +
                        "\t  \"description\": \"[서비스 소개]\", \n" +
                        "\t  \"background\": \"[기획 배경]\",\n" +
                        "\t  \"feature\":\"[주요 기능 소개]\",\n" +
                        "\t  \"effect\": \"[기대효과]\"" +
                        "}\n" +
                        "json 내용을 파싱하고 싶어. json만 응답해줘.")
                .user(message)
                .call()
                .content();
    }

    public String generateFunctionDescription(String message, String proposal) {
        return chatClient.prompt()
                .system("사용자의 요청과 아래의 프로젝트 기획서 내용을 바탕으로 소프트웨어 프로젝트의 기능 명세서를 작성해줘.\n" +
                        proposal +
                        "\n" +
                        "기능 명세서 양식은 아래와 같이 한글로 자세하게 작성해줘.\n" +
                        "{\n" +
                        "    \"category\": [\"분류1\", \"분류2\", ...],\n" +
                        "    \"functionName\": [\"기능1\", \"기능2\", ...],\n" +
                        "    \"description\": [\"설명1\", \"설명2\", ...],\n" +
                        "    \"priority\": [\"n순위\", \"m순위\", ...]\n" +
                        "}\n" +
                        "json 내용을 파싱하고 싶어. json만 응답해줘.")
                .user(message)
                .call()
                .content();
    }

    public String generateApiDocs(String message, String funcDesc) {
        return chatClient.prompt()
                .system("사용자의 요청과 아래의 프로젝트 기능 명세서 내용을 바탕으로 소프트웨어 프로젝트의 API 명세서를 작성해줘.\n" +
                        funcDesc +
                        "\n" +
                        "기능 명세서 양식은 아래와 같이 한글로 자세하게 작성해줘.\n" +
                        "{\n" +
                        "    \"category\": [\"분류1\", \"분류2\", ...],\n" +
                        "    \"functionName\": [\"기능1\", \"기능2\", ...],\n" +
                        "    \"description\": [\"설명1\", \"설명2\", ...],\n" +
                        "    \"uri\": [\"uri1\", \"uri2\", ...],\n" +
                        "    \"method\": [\"메소드1\", \"메소드2\", ...],\n" +
                        "    \"priority\": [\"n순위\", \"m순위\", ...],\n" +
                        "}\n" +
                        "json 내용을 파싱하고 싶어. json만 응답해줘.")
                .user(message)
                .call()
                .content();
    }

    public String generateImage(String prompt) {

        prompt += "\n 이 회고을 읽고 회고 내용에 알맞는 대표 이미지를 하나 생성해줘";
        ImageResponse response = openAiImageModel.call(
                new ImagePrompt(prompt,
                        OpenAiImageOptions.builder()
                                .withQuality("hd")
                                .withN(1)
                                .withHeight(1024)
                                .withWidth(1024)
                                .build())
        );
        return response.getResults().get(0).getOutput().getUrl(); // 생성된 이미지 URL 반환
    }

    public String generateJira(String message, String apiDocs, String assignee, String startDate, String endDate) {

        return chatClient.prompt()
                .system(apiDocs + "\n" +
                        "지라 스프린트의 이슈를 생성하고 싶어 스토리포인트는 일주일에 총 40 포인트로 맞춰서 생성해주고 " +
                        "나머지는 위의 api 명세서와 아래의 양식과 사용자의 요구사항에 맞춰서 작성해줘 여기서 일주일은 월화수목금 5일을 말하는거야 \n" +
                        "- 작성 형식은 assignee, summary, description, epic, issueType, storyPoint의 형식으로 작성해줘 \n" +
                        "- 매일 summary: 오전 스크림, epic: 회의 / summary: 종로 미팅, epic: 회의 이슈를 작성해줘 둘다 issueType은 Task로 작성해주고 스토리 포인트는 1을 부여해줘 \n" +
                        "- 시작 날짜는 " + startDate + "이고 끝나는 날짜는 " + endDate + "야. \n" +
                        "- 스토리 포인트는 한번에 3 이상을 부여하지 말아줘 \n" +
                        "- 각 이슈마다 summary 마지막에 (yymmdd)로 각 날짜를 작성해줘 yy는년도이고 mm은 월 dd는 요일이야 \n" +
                        "- assignee는 " + assignee + "로 작성해줘 \n" +
                        "- 하루에 8포인트씩 맞춰서 작성해줘 \n" +
                        "- 코딩 관련 이슈의 issueType Story, 나머지 이슈는 Task로 작성해줘 \n" +
                        "- json으로 작성해줘 근데 너가 응답할 때 ```json ``` 으로 묶는 마크다운은 제거하고 text로만 보내줘 \n" +
                        "- json 형태는 [ { day: \"\", tasks: [ {\"assignee\": \"\",\n" +
                        "        \"summary\": \"\",\n" +
                        "        \"description\": \"\",\n" +
                        "        \"epic\": \"\",\n" +
                        "        \"issueType\": \"\",\n" +
                        "        \"storyPoint\": } ] } ] 로 작성해줘")
                .user(message)
                .call()
                .content();
    }
}
