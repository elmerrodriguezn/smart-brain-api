FROM node:carbon

WORKDIR /urs/src/smart-brain-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]
