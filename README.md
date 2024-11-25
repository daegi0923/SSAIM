# SSAIM (SSAFY AI Manager)

SSAFY 11기 자율 프로젝트 E203 행운삼조룡 2024-10-14 ~ 2024-11-18

# 목차

- 프로젝트 개요
- 서비스 화면
- 개발 환경
- 활용 기술
- 프로젝트 산출물
- 팀원 소개 및 역할

# 1. 프로젝트 개요

### 1-1. 프로젝트 소개

현대 소프트웨어 개발에서 기획 단계는 프로젝트 성공의 핵심 요소로, SSAFY 기준으로 평균 1~2주가 소요되며, 이 기간 동안 다양한 산출물을 작성하느라 많은 시간을 할애해야 합니다. **SSAIM**은 이러한 비효율을 해결하기 위해 탄생한 **프로젝트 AI 통합 관리 시스템**으로, 생성형 AI를 활용해 주요 산출물을 자동 생성하고 관리 과정을 효율화합니다. 이를 통해 개발자는 핵심 업무에 더 집중할 수 있으며, 대시보드 기능으로 Jira, GitLab, 회의 기록 등을 통합하여 편리하게 관리할 수 있습니다.

특히, 반복적인 Jira 이슈 생성 작업을 AI로 자동화해 스프린트 관리의 부담을 줄이고, 음성 인식과 화자 분리를 통해 클릭 한 번으로 정확한 회의록을 생성할 수 있는 기능도 제공합니다. 또한, 프로젝트 기간과 모집 정보를 입력해 팀원을 쉽게 구성할 수 있는 팀 빌딩 도구를 통해 기획부터 실행까지 모든 단계를 효율적으로 지원합니다. **SSAIM**과 함께 더 스마트한 개발을 경험해보세요!

### 1-2. 주요 기능

| 기능 | 설명 |
| --- | --- |
| 대시보드 | 지라 이슈, gitlab MR 내역, 회의 내역을 날짜 별로 보여준다. |
| 지라 이슈 등록 | 스프린트에 이슈를 등록한다. |
| 지라 이슈 수정 | 등록된 지라 이슈를 수정한다. |
| 지라 상태 변경 | 이슈를 해야할 일/ 진행/ 완료 세 가지 상태 중 하나로 변경한다. |
| 스프린트 구성  | 스프린트를 생성하여 이슈를 등록한다. |
| 이슈 자동 생성 |  AI를 이용하여 사용자의 요구에 맞게 이슈를 생성한다. 스토리포인트, 에픽, 이슈 이름을 자동으로 생성한다. |
| 산출물 생성  | 기능명세서, 기획서, API 명세서를 생성한다. |
| 산출물 수정 |  WebSocket와 Stomp 를 이용해서 프로젝트 멤버 간 동시 편집을 제공한다. 현재 수정하고 있는 부분에 수정하는 사람의 이름을 표시한다. |
| 기능명세서 자동 생성 | 생성형 AI를 이용하여 기획서 기반의 기능명세서를 자동으로 생성한다. |
| API 명세서  | 생성형 AI를 이용하여 기획서 기반의 API 명세서를 자동으로 생성한다.
|회의록 생성 | 네이버 클로바 노트 API를 활용하여 음성 인식 및 화자 분리하여 회의록을 생성한다.  |
| 회의 AI 요약 | 회의록을 바탕으로 생성형 AI를 이용하여 회의를 요약한다.  |
| 팀 모집 | 프로젝트 모집 글을 생성한다. |
| 팀 지원 | 프로젝트 모집 글에 지원하는 댓글을 작성한다.  |
| 일일 회고 작성 | Keep, Problem, Try 의 세 가지 영역의 회고를 작성한다.  |
| 일일 회고 조회  | 본인 및 팀원의 일일 회고를 조회한다.  |
| 일일 회고 수정 | 본인의 일일 회고를 수정한다.  |
| 주간 회고 생성  | 일주일 간의 일일 회고를 생성형 AI가 요약한다. |
| 주간 회고 조회 | 본인 및 팀원의 주간 회고를 조회한다. |
| 우리들의 개발 이야기  |  한 개 또는 복수 개의 프로젝트 회고를 요약하여 제공한다.   |

# 2. UCC & 시연

* ![UCC](/exec/UCC/)
* ![시연 시나리오](/exec/시연시나리오/)



# 3. 개발 환경

1.  **시스템 아키텍쳐**
    
    ![system architecture](/exec/image/SSAIM-architecture.drawio.png)
    
2. **Frontend**
    
    Node.js - 20.15.0

    VS Code - 1.90.2

    React - 18.3.1

    Typescript - ~5.6.3

    Vite - 5.4.11

    React Query - 5.60.2

    zustand - 5.0.1
    
3. **Backend**
    
    JVM - Liberica JDK 17
    
    Spring Boot - 3.3.5
    
    IntelliJ - 2024.1.5(Ultimate)
    
4. **Server** 
    
    AWS EC2 xlarge(lightsail) + Ubuntu 20.04 LTS
    
    Nignx - 1.18.0
    
    Docker - 27.2.0

    Jenkins - 2.462.2
    
5. **DB**
    
    MySQL - 8.0.40

    MongoDB - 8.0.3
    

# **4. 형상관리**

- Jira
- Gitlab

# **5. 활용 기술**

- Jira 및 Gitlab API 연동
- Web socket을 활용한 동시 편집 (STOMP)
- 네이버 클로바 API (음성인식)
- OpenAI API (생성형 AI)

# **6. 프로젝트 산출물**

- [기능명세서](https://www.notion.so/v-2-4505432b7c434de09c275f126a1146ab?pvs=21)
- [API 명세서](https://www.notion.so/86f0a5bffb4a4acea0ca325a48575a91?pvs=21)
- [ERD](https://www.notion.so/ERD-v-2-2024-10-30-update-c2e0aab735d14fe29a3787ee4e15c553?pvs=21)
- [MockUp](https://www.figma.com/design/2BA91OO7TIgLnCXHIDD5V7/%ED%96%89%EC%9A%B4%EC%82%BC%EC%A1%B0%EB%A3%A1?node-id=1-2&node-type=canvas&t=4Y6EBWleAJ9mNI9g-0)

# **7. 팀원소개 및 역할**

<table>
    <tr>
        <td align="center"><a href="https://github.com/mango152">조원빈</a></td>
        <td align="center"><a href="https://github.com/DaftenP">박지용</a></td>
        <td align="center"><a href="https://github.com/kimjaegyeong">김재경</a></td>
        <td align="center"><a href="https://github.com/daegi0923">여대기</a></td>
        <td align="center"><a href="https://github.com/qwert0175">조성인</a></td>
        <td align="center"><a href="https://github.com/kangtea9">강수연</a></td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/mango152"><img src="https://avatars.githubusercontent.com/u/156670982?v=4" width="100px;" alt=""/><sub></sub></a></td>
        <td align="center"><a href="https://github.com/DaftenP"><img src="https://avatars.githubusercontent.com/u/80443975?v=4" width="100px;" alt=""/><sub></sub></a></td>
        <td align="center"><a href="https://github.com/kimjaegyeong"><img src="https://avatars.githubusercontent.com/u/50646904?v=4" width="100px;" alt=""/><sub></sub></a></td>
        <td align="center"><a href="https://github.com/daegi0923"><img src="https://avatars.githubusercontent.com/u/156268579?v=4" width="100px;" alt=""/><sub></sub></a></td>
        <td align="center"><a href="https://github.com/qwert0175"><img src="https://avatars.githubusercontent.com/u/145173921?v=4" width="100px;" alt=""/><sub></sub></a></td>
        <td align="center"><a href="https://github.com/Kangsooyeon"><img src="https://avatars.githubusercontent.com/u/64363148?v=4" width="100px;" alt=""/><sub></sub></a></td>
    </tr>
    <tr>
        <td align="center"><b>팀장, Backend</b></td>
        <td align="center"><b>Infra, Backend</b></td>
        <td align="center"><b>Backend</b></td>
        <td align="center"><b>Frontend</b></td>
        <td align="center"><b>Frontend</b></td>
        <td align="center"><b>Frontend</b></td>
    </tr>
</table>
