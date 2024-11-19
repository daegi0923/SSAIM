# 1단계: 빌드 스테이지
FROM openjdk:17-jdk-slim AS build

WORKDIR /app

COPY . .

RUN chmod +x gradlew

RUN ./gradlew build --no-daemon -x test

# 2단계: 최종 스테이지
FROM openjdk:17-jdk-slim

# 시간대 설정
ENV TZ=Asia/Seoul

# tzdata 패키지 설치
RUN apt-get update && apt-get install -y tzdata && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar

CMD ["java", "-jar", "app.jar"]
