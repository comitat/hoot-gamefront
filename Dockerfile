FROM node:20.15.1-alpine AS base
RUN apk update && \
    apk upgrade && \
    apk add  --no-cache bash git openssh
WORKDIR /hood-front
COPY id_rsa /root/.ssh/id_rsa
#COPY id_rsa.pub /root/.ssh/id_rsa.pub

RUN chmod 600 /root/.ssh/id_rsa && \
    ssh-keyscan git.bsn.si >> /root/.ssh/known_hosts

COPY package*.json ./
RUN NODE_OPTIONS="--max-old-space-size=2048" npm install
COPY . /hood-front
RUN npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY static.conf /etc/nginx/conf.d
COPY --from=base /hood-front/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
