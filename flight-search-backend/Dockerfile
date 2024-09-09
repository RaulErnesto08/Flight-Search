FROM gradle:5.3.0-jdk-alpine AS TEMP_BUILD_IMAGE
ENV APP_HOME=/usr/app/
WORKDIR $APP_HOMECOPY build.gradle settings.gradle $APP_HOME  COPY gradle $APP_HOME/gradle
COPY --chown=gradle:gradle . /home/gradle/src
USER root
RUN chown -R gradle /home/gradle/src

RUN gradle build || return 0
COPY . .
RUN gradle clean build

FROM openjdk:22

WORKDIR /FlightSearch

COPY gradlew gradlew
COPY gradle gradle
COPY . .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "build/libs/flight-search-backend-0.0.1-SNAPSHOT.jar"]