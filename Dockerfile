FROM ubuntu:16.04
MAINTAINER seongahjo <seongside@gmail.com>
RUN apt-get update && apt-get install -y --no-install-recommends apt-utils  &&apt-get -y install dialog locales python3-pip \
&& locale-gen ko_KR.UTF-8
ENV LANG ko_KR.UTF-8
ENV LANG ko_KR.UTF-8
ENV LANGUAGE ko_KR.UTF-8
ENV LC_ALL ko_KR.UTF-8
RUN apt-get -y install libgtk2.0-dev \
&& apt-get -y install cmake \
&& apt-get -y install git \
&& apt-get -y install nodejs npm
RUN git clone https://github.com/seongahjo/Mosaicer.git
WORKDIR Mosaicer
RUN pip3 install --upgrade pip \
&& pip3 install -r requirements.txt
WORKDIR node
RUN npm install
EXPOSE 3000
