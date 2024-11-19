FROM jenkins/jenkins:lts

USER root

# Docker CLI 설치
RUN apt update && apt upgrade 
RUN curl -fsSL https://get.docker.com -o dockerSetter.sh && \
    chmod 711 dockerSetter.sh
RUN ./dockerSetter.sh

# nodejs 설치
RUN apt install -y nodejs && \
    apt install -y npm

# Allow Jenkins user to use Docker
RUN usermod -aG docker jenkins
